#!/bin/sh

set -u

DEFAULT_RELEASE_API_URL="https://api.ruyisdk.cn/releases/latest-pm"
DEFAULT_CHANNEL="stable"

CHANNEL=${RUYI_CHANNEL:-$DEFAULT_CHANNEL}
INSTALL_DIR=${RUYI_INSTALL_DIR:-}
RELEASE_API_URL=${RUYI_RELEASE_API_URL:-$DEFAULT_RELEASE_API_URL}
DRY_RUN=0
TMP_ROOT=

log() {
  printf '%s\n' "$*"
}

warn() {
  printf 'warning: %s\n' "$*" >&2
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
RuyiSDK installer

Usage:
  sh install.sh [OPTIONS]
  curl --proto '=https' --tlsv1.2 -fsSL https://ruyisdk.org/install.sh | sh

Options:
  --channel CHANNEL      Install from stable or testing. Default: stable
  --install-dir DIR      Install ruyi into DIR. Default: $HOME/.local/bin
  --dry-run              Print the selected download URLs without installing
  -h, --help             Show this help message

Environment:
  RUYI_CHANNEL           Default channel when --channel is not provided
  RUYI_INSTALL_DIR       Default install directory when --install-dir is not provided
  RUYI_RELEASE_API_URL   Release metadata URL
EOF
}

cleanup() {
  if [ -n "${TMP_ROOT:-}" ] && [ -d "$TMP_ROOT" ]; then
    rm -rf "$TMP_ROOT"
  fi
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --channel)
      [ "$#" -ge 2 ] || die "--channel requires a value"
      CHANNEL=$2
      shift 2
      ;;
    --channel=*)
      CHANNEL=${1#*=}
      shift
      ;;
    --install-dir)
      [ "$#" -ge 2 ] || die "--install-dir requires a value"
      INSTALL_DIR=$2
      shift 2
      ;;
    --install-dir=*)
      INSTALL_DIR=${1#*=}
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown option: $1"
      ;;
  esac
done

case "$CHANNEL" in
  stable|testing) ;;
  *) die "unsupported channel: $CHANNEL" ;;
esac

if [ -z "$INSTALL_DIR" ]; then
  if [ -z "${HOME:-}" ]; then
    die "HOME is not set; pass --install-dir explicitly"
  fi
  INSTALL_DIR=$HOME/.local/bin
fi

case "$INSTALL_DIR" in
  /*) ;;
  *) die "install directory must be an absolute path: $INSTALL_DIR" ;;
esac

if [ "$(uname -s 2>/dev/null)" != "Linux" ]; then
  die "this installer currently supports Linux only"
fi

RAW_ARCH=$(uname -m 2>/dev/null || printf unknown)
case "$RAW_ARCH" in
  x86_64|amd64) ARCH=x86_64 ;;
  aarch64|arm64) ARCH=aarch64 ;;
  riscv64) ARCH=riscv64 ;;
  *) die "unsupported architecture: $RAW_ARCH" ;;
esac

if command -v mktemp >/dev/null 2>&1; then
  TMP_PARENT=${TMPDIR:-/tmp}
  TMP_ROOT=$(mktemp -d "${TMP_PARENT%/}/ruyi-install.XXXXXX") || die "failed to create temporary directory"
else
  die "mktemp is required"
fi

trap cleanup EXIT HUP INT TERM

if command -v curl >/dev/null 2>&1; then
  FETCH_TOOL=curl
elif command -v wget >/dev/null 2>&1; then
  FETCH_TOOL=wget
else
  die "curl or wget is required"
fi

fetch_to_stdout() {
  url=$1
  case "$FETCH_TOOL" in
    curl)
      curl --proto '=https' --tlsv1.2 -fsSL "$url"
      ;;
    wget)
      wget -q -O - "$url"
      ;;
    *)
      return 1
      ;;
  esac
}

download_to_file() {
  url=$1
  output=$2
  case "$FETCH_TOOL" in
    curl)
      curl --proto '=https' --tlsv1.2 -fL "$url" -o "$output"
      ;;
    wget)
      wget -q -O "$output" "$url"
      ;;
    *)
      return 1
      ;;
  esac
}

is_allowed_download_url() {
  case "$1" in
    https://mirror.iscas.ac.cn/ruyisdk/ruyi/*) return 0 ;;
    https://github.com/ruyisdk/ruyi/releases/download/*) return 0 ;;
    *) return 1 ;;
  esac
}

is_install_dir_on_path() {
  case ":${PATH:-}:" in
    *":$INSTALL_DIR:"*) return 0 ;;
    *) return 1 ;;
  esac
}

show_path_guidance() {
  {
    printf 'warning: install directory is not in PATH: %s\n' "$INSTALL_DIR"
    printf 'After installation, your shell may not find the ruyi command automatically.\n'
    printf 'Add the install directory to PATH, for example:\n'
    printf '\n'
    printf '  export PATH="%s:$PATH"\n' "$INSTALL_DIR"
    printf '\n'
    printf 'Then restart your shell, or reload the profile file where you added it.\n'
  } >&2
}

confirm_path_guidance() {
  if is_install_dir_on_path; then
    return 0
  fi

  show_path_guidance

  if [ "$DRY_RUN" -eq 1 ]; then
    warn "dry run requested; skipping interactive PATH confirmation"
    return 0
  fi

  if [ -r /dev/tty ] && [ -w /dev/tty ]; then
    printf 'Continue installing to %s anyway? [Y/n] ' "$INSTALL_DIR" > /dev/tty
    IFS= read -r answer < /dev/tty || die "failed to read confirmation from terminal"
    case "$answer" in
      ""|y|Y|yes|YES|Yes) return 0 ;;
      *) die "installation cancelled" ;;
    esac
  fi

  warn "no interactive terminal detected; continuing without confirmation"
}

extract_urls() {
  awk -v channel="$CHANNEL" -v arch="$ARCH" '
    {
      gsub(/[[:space:]]/, "", $0)
      json = json $0
    }
    END {
      channel_key = "\"" channel "\":{"
      arch_key = "\"linux/" arch "\":["

      channel_start = index(json, channel_key)
      if (channel_start == 0) exit 1

      object_start = channel_start + length("\"" channel "\":")
      depth = 0
      channel_object = ""
      for (i = object_start; i <= length(json); i++) {
        ch = substr(json, i, 1)
        if (ch == "{") depth++
        if (ch == "}") depth--
        if (depth == 0) {
          channel_object = substr(json, object_start, i - object_start + 1)
          break
        }
      }
      if (channel_object == "") exit 1

      arch_start = index(channel_object, arch_key)
      if (arch_start == 0) exit 2

      array_start = arch_start + length("\"linux/" arch "\":")
      depth = 0
      array_body = ""
      for (i = array_start; i <= length(channel_object); i++) {
        ch = substr(channel_object, i, 1)
        if (ch == "[") depth++
        if (ch == "]") depth--
        if (depth == 0) {
          array_body = substr(channel_object, array_start + 1, i - array_start - 1)
          break
        }
      }
      if (array_body == "") exit 2

      count = split(array_body, urls, ",")
      for (i = 1; i <= count; i++) {
        url = urls[i]
        gsub(/^"/, "", url)
        gsub(/"$/, "", url)
        if (url != "") print url
      }
    }
  ' "$1"
}

install_binary() {
  source_file=$1
  target_file=$INSTALL_DIR/ruyi

  if mkdir -p "$INSTALL_DIR" 2>/dev/null && [ -w "$INSTALL_DIR" ]; then
    if command -v install >/dev/null 2>&1; then
      install -m 0755 "$source_file" "$target_file"
    else
      cp "$source_file" "$target_file" && chmod 0755 "$target_file"
    fi
    return $?
  fi

  die "cannot write to $INSTALL_DIR; rerun this installer with sudo for a system directory, for example: curl -fsSL https://ruyisdk.org/install.sh | sudo sh -s -- --install-dir /usr/local/bin"
}

confirm_path_guidance

log "Fetching release metadata from $RELEASE_API_URL"
API_JSON=$TMP_ROOT/latest-pm.json
if ! fetch_to_stdout "$RELEASE_API_URL" > "$API_JSON"; then
  die "failed to fetch release metadata"
fi

RAW_URLS=$TMP_ROOT/urls.raw
VALID_URLS=$TMP_ROOT/urls.valid
CANDIDATE_URLS=$TMP_ROOT/urls.candidates

if ! extract_urls "$API_JSON" > "$RAW_URLS"; then
  die "failed to find download URLs for channel $CHANNEL and linux/$ARCH"
fi

: > "$VALID_URLS"
while IFS= read -r url; do
  [ -n "$url" ] || continue
  if is_allowed_download_url "$url"; then
    printf '%s\n' "$url" >> "$VALID_URLS"
  else
    warn "ignored untrusted download URL: $url"
  fi
done < "$RAW_URLS"

if [ ! -s "$VALID_URLS" ]; then
  die "no trusted download URLs found for channel $CHANNEL and linux/$ARCH"
fi

: > "$CANDIDATE_URLS"
while IFS= read -r url; do
  case "$url" in
    https://mirror.iscas.ac.cn/*) printf '%s\n' "$url" >> "$CANDIDATE_URLS" ;;
  esac
done < "$VALID_URLS"
while IFS= read -r url; do
  case "$url" in
    https://github.com/*) printf '%s\n' "$url" >> "$CANDIDATE_URLS" ;;
  esac
done < "$VALID_URLS"

log "Selected platform: linux/$ARCH"
log "Selected channel: $CHANNEL"
log "Install directory: $INSTALL_DIR"
log "Download candidates:"
sed 's/^/  /' "$CANDIDATE_URLS"

if [ "$DRY_RUN" -eq 1 ]; then
  log "Dry run requested; no files were downloaded or installed."
  exit 0
fi

BINARY_FILE=$TMP_ROOT/ruyi
SELECTED_URL=

while IFS= read -r url; do
  [ -n "$url" ] || continue
  log "Downloading $url"
  if download_to_file "$url" "$BINARY_FILE"; then
    SELECTED_URL=$url
    break
  fi
  warn "download failed: $url"
done < "$CANDIDATE_URLS"

if [ -z "$SELECTED_URL" ]; then
  die "failed to download ruyi from all trusted sources"
fi

chmod 0755 "$BINARY_FILE" || die "failed to mark downloaded binary executable"

install_binary "$BINARY_FILE" || die "failed to install ruyi"

TARGET_FILE=$INSTALL_DIR/ruyi

if "$TARGET_FILE" version > "$TMP_ROOT/version.out" 2>&1; then
  log "Ruyi was installed successfully: $TARGET_FILE"
  sed -n '1,5p' "$TMP_ROOT/version.out"
else
  cat "$TMP_ROOT/version.out" >&2
  die "installed binary did not run successfully: $TARGET_FILE"
fi

case ":${PATH:-}:" in
  *":$INSTALL_DIR:"*) ;;
  *) warn "install directory is not in PATH: $INSTALL_DIR" ;;
esac
