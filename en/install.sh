#!/bin/sh

set -u

PRIMARY_RELEASES_URL="https://api.ruyisdk.cn/releases/latest-pm"
FALLBACK_RELEASES_URL="https://ruyisdk.org/data/api/api_ruyisdk_cn/releases_latest_pm.json"
INSTALLER_URL="https://ruyisdk.org/install.sh"
PRIVACY_POLICY_URL="https://ruyisdk.org/docs/legal/privacyPolicy/"
INSTALLER_VERSION="20260831"

INSTALL_DIR=${RUYI_INSTALL_DIR:-/usr/local/bin}
UPGRADE=0
DRY_RUN=0
INSTALL_UPGRADE_HELPER=0
STAGED_FILE=
USE_SUDO=0

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
  cat <<EOF
RuyiSDK installer

Usage:
  sh install.sh [OPTIONS]
  curl --proto '=https' --tlsv1.2 -fL $INSTALLER_URL | sh

Options:
  -v                     Show the installer version
  --install-dir DIR      Install ruyi into DIR. Default: /usr/local/bin
                         Ignored with --upgrade; this script's directory is used instead
  --upgrade              Upgrade the ruyi executable next to this script
  --dry-run              Print the selected download URLs without installing
  -h, --help             Show this help message

Environment:
  RUYI_INSTALL_DIR       Default install directory when --install-dir is not provided
EOF
}

cleanup() {
  [ -z "$STAGED_FILE" ] || run_privileged rm -f "$STAGED_FILE" >/dev/null 2>&1 || :
  rm -rf "$TMP_ROOT"
}

SCRIPT_DIR=$(cd -P "$(dirname "$0")" 2>/dev/null && pwd) \
  || die "failed to resolve the installer directory: $0"
[ "${0##*/}" = ruyi-upgrade ] && UPGRADE=1

while [ "$#" -gt 0 ]; do
  case "$1" in
    --install-dir)
      [ "$#" -ge 2 ] || die "--install-dir requires a value"
      INSTALL_DIR=$2
      shift 2
      ;;
    --install-dir=*)
      INSTALL_DIR=${1#*=}
      shift
      ;;
    --upgrade)
      UPGRADE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -v|--version)
      printf '%s\n' "$INSTALLER_VERSION"
      exit 0
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

[ "$UPGRADE" -eq 0 ] || INSTALL_DIR=$SCRIPT_DIR

case "$INSTALL_DIR" in
  /*)
    [ "$INSTALL_DIR" = / ] || INSTALL_DIR=${INSTALL_DIR%/}
    ;;
  *) die "install directory must be an absolute path: $INSTALL_DIR" ;;
esac

RAW_SYSTEM=$(uname -s)
RAW_ARCH=$(uname -m)
TARGET_NAME=ruyi
case "$RAW_SYSTEM:$RAW_ARCH" in
  Linux:x86_64|Linux:amd64)
    PLATFORM_KEY=linux/x86_64
    ;;
  Linux:aarch64|Linux:arm64)
    PLATFORM_KEY=linux/aarch64
    ;;
  Linux:riscv64)
    PLATFORM_KEY=linux/riscv64
    ;;
  Darwin:arm64|Darwin:aarch64)
    PLATFORM_KEY=darwin/aarch64
    ;;
  MINGW*:x86_64|MINGW*:amd64|MSYS*:x86_64|MSYS*:amd64|CYGWIN*:x86_64|CYGWIN*:amd64)
    PLATFORM_KEY=windows/x86_64
    [ "$UPGRADE" -eq 1 ] || TARGET_NAME=ruyi.exe
    ;;
  *)
    die "no official ruyi binary is published for $RAW_SYSTEM/$RAW_ARCH"
    ;;
esac

TARGET_FILE=$INSTALL_DIR/$TARGET_NAME

TMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/ruyi-install.XXXXXX") \
  || die "failed to create temporary directory"
if [ "$(id -u 2>/dev/null)" = 0 ] \
  && [ -n "${SUDO_USER:-}" ] \
  && [ "$SUDO_USER" != root ]; then
  chmod 711 "$TMP_ROOT" || die "failed to prepare the temporary directory"
fi

trap cleanup 0

if command -v curl >/dev/null 2>&1; then
  FETCH_TOOL=curl
elif command -v wget >/dev/null 2>&1; then
  FETCH_TOOL=wget
else
  die "curl or wget is required"
fi

fetch() {
  url=$1
  output=${2:-}

  if [ "$FETCH_TOOL" = curl ]; then
    if [ -n "$output" ]; then
      curl --proto '=https' --proto-redir '=https' --tlsv1.2 -fL -o "$output" "$url"
    else
      curl --proto '=https' --proto-redir '=https' --tlsv1.2 -fsSL "$url"
    fi
  elif [ -n "$output" ]; then
    wget -O "$output" "$url"
  else
    wget -q -O - "$url"
  fi
}

ask_yes_no() {
  if ! {
    printf '%s [y/N] ' "$1" > /dev/tty \
      && IFS= read -r answer < /dev/tty
  } 2>/dev/null; then
    printf '%s [y/N] ' "$1" >&2 || return 2
    IFS= read -r answer || return 2
  fi
  case "$answer" in
    y|Y|yes|YES|Yes) return 0 ;;
    *) return 1 ;;
  esac
}

confirm_privacy_policy() {
  [ "$UPGRADE" -eq 0 ] || return 0

  printf '%s\n%s\n' \
    "By downloading and using RuyiSDK, you agree to the license terms and the privacy policy." \
    "$PRIVACY_POLICY_URL"

  ask_yes_no "Do you agree to the license terms and privacy policy?"
  case "$?" in
    0) ;;
    1) die "license terms and privacy policy not accepted" ;;
    *) die "downloading Ruyi requires interactive acceptance of the license terms and privacy policy" ;;
  esac
}

confirm_install_target() {
  [ "$UPGRADE" -eq 0 ] && [ "$DRY_RUN" -eq 0 ] || return 0
  if [ -e "$TARGET_FILE" ] || [ -L "$TARGET_FILE" ]; then
    ask_yes_no "Overwrite $TARGET_FILE?"
  else
    ask_yes_no "Continue installing Ruyi to $TARGET_FILE?"
  fi
  case "$?" in
    0) ;;
    1) die "installation cancelled" ;;
    *) die "installation requires interactive confirmation" ;;
  esac
}

warn_if_path_missing() {
  [ "$UPGRADE" -eq 0 ] || return 0
  case ":${PATH:-}:" in
    *":$INSTALL_DIR:"*) return 0 ;;
  esac
  warn "install directory is not in PATH: $INSTALL_DIR"
}

is_supported_binary() {
  magic=$(LC_ALL=C od -An -N4 -tx1 "$1" 2>/dev/null | tr -d '[:space:]')
  [ "$magic" = 7f454c46 ] || [ "$magic" = cffaedfe ]
}

run_ruyi() {
  if [ "$(id -u 2>/dev/null)" = 0 ] \
    && [ -n "${SUDO_USER:-}" ] \
    && [ "$SUDO_USER" != root ]; then
    sudo -u "$SUDO_USER" -H env RUYI_TELEMETRY_OPTOUT=1 "$@"
  else
    RUYI_TELEMETRY_OPTOUT=1 "$@"
  fi
}

version_is_newer() {
  awk -v newer="$1" -v older="$2" '
    BEGIN {
      split(newer, n, ".")
      split(older, o, ".")
      for (i = 1; i <= 3; i++)
        if (n[i] + 0 != o[i] + 0) exit(n[i] + 0 > o[i] + 0 ? 0 : 1)
      exit(index(newer, "-") == 0 && index(older, "-") > 0 ? 0 : 1)
    }
  '
}

prepare_upgrade() {
  [ "$UPGRADE" -eq 1 ] || return 0
  is_supported_binary "$TARGET_FILE" \
    || die "upgrade target is not an ELF or Mach-O executable: $TARGET_FILE"
  current_output=$(run_ruyi "$TARGET_FILE" version) \
    || die "failed to read the current ruyi version: $TARGET_FILE"
  CURRENT_VERSION=$(printf '%s\n' "$current_output" | awk '$1 == "Ruyi" { print $2; exit }')
  [ -n "$CURRENT_VERSION" ] || die "failed to read the current ruyi version: $TARGET_FILE"
}

confirm_upgrade_helper() {
  [ "$UPGRADE" -eq 0 ] && [ "$DRY_RUN" -eq 0 ] || return 0
  helper_file=$INSTALL_DIR/ruyi-upgrade
  if [ -e "$helper_file" ] || [ -L "$helper_file" ]; then
    ask_yes_no "Overwrite $helper_file?"
  else
    ask_yes_no "Install ruyi-upgrade into $helper_file?"
  fi
  prompt_status=$?
  case "$prompt_status" in
    0) INSTALL_UPGRADE_HELPER=1 ;;
    2) warn "no interactive terminal detected; skipping ruyi-upgrade installation"; return 0 ;;
    *) log "Skipped ruyi-upgrade installation."; return 0 ;;
  esac
}

install_upgrade_helper() {
  [ "$INSTALL_UPGRADE_HELPER" -eq 1 ] || return 0
  helper_file=$INSTALL_DIR/ruyi-upgrade
  if [ -f "$0" ]; then
    cp "$0" "$TMP_ROOT/ruyi-upgrade.new"
  else
    fetch "$INSTALLER_URL" "$TMP_ROOT/ruyi-upgrade.new"
  fi || {
    warn "failed to prepare ruyi-upgrade"
    return 0
  }
  if ! sh -n "$TMP_ROOT/ruyi-upgrade.new"; then
    warn "ruyi-upgrade failed the shell syntax check"
    return 0
  fi
  install_binary "$TMP_ROOT/ruyi-upgrade.new" "$helper_file"
  log "Installed ruyi-upgrade: $helper_file"
}

extract_urls() {
  awk -v platform="$PLATFORM_KEY" -v error_file="$PARSE_ERROR" '
    function fail(message) {
      print message > error_file
      exit 1
    }
    {
      gsub(/[[:space:]]/, "", $0)
      json = json $0
    }
    END {
      stable_start = index(json, "\"stable\":{")
      if (stable_start == 0) fail("channel stable is missing")
      stable = substr(json, stable_start)
      version_key = "\"version\":\""
      version_start = index(stable, version_key)
      if (version_start == 0) fail("version is missing from channel stable")
      version = substr(stable, version_start + length(version_key))
      sub(/".*/, "", version)
      if (version !~ /^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/)
        fail("invalid semantic version: " version)

      platform_key = "\"" platform "\":["
      platform_start = index(stable, platform_key)
      if (platform_start == 0) fail("platform " platform " is missing")

      array_body = substr(stable, platform_start + length(platform_key))
      sub(/\].*/, "", array_body)
      if (array_body == "") fail("download URL list for " platform " is empty or malformed")

      print version
      count = split(array_body, urls, ",")
      for (i = 1; i <= count; i++) {
        url = urls[i]
        gsub(/"/, "", url)
        if (url != "") print url
      }
    }
  ' "$1"
}

install_binary() {
  source_file=$1
  target_file=$2

  [ ! -d "$target_file" ] || die "install target is a directory: $target_file"

  if ! mkdir -p "$INSTALL_DIR" 2>/dev/null; then
    request_sudo
    run_privileged mkdir -p "$INSTALL_DIR" || die "failed to create install directory: $INSTALL_DIR"
  fi

  STAGED_FILE=$(mktemp "$INSTALL_DIR/.ruyi.install.XXXXXX" 2>/dev/null) || {
    request_sudo
    STAGED_FILE=$(run_privileged mktemp "$INSTALL_DIR/.ruyi.install.XXXXXX") \
      || die "failed to create a staging file in $INSTALL_DIR"
  }
  run_privileged cp "$source_file" "$STAGED_FILE" || die "failed to stage the ruyi binary"
  run_privileged chmod 0755 "$STAGED_FILE" || die "failed to set executable permissions"
  if [ "$UPGRADE" -eq 1 ]; then
    is_supported_binary "$target_file" \
      || die "upgrade target changed and is no longer an ELF or Mach-O executable: $target_file"
  fi
  run_privileged mv "$STAGED_FILE" "$target_file" \
    || die "failed to install $target_file"
  STAGED_FILE=
}

fetch_release_data() {
  for release_url in "$PRIMARY_RELEASES_URL" "$FALLBACK_RELEASES_URL"; do
    log "Fetching release metadata from $release_url"
    : > "$PARSE_ERROR"
    if fetch "$release_url" | extract_urls - > "$RELEASE_DATA"; then
      VERSION=$(sed -n '1p' "$RELEASE_DATA")
      return 0
    fi
    parse_error=$(sed -n '1p' "$PARSE_ERROR")
    [ -n "$parse_error" ] || parse_error="download failed or response contains no release data"
    warn "release metadata from $release_url is unavailable or invalid: $parse_error"
  done
  return 1
}

ping_host() {
  case "$RAW_SYSTEM" in
    Darwin) LC_ALL=C ping -c 1 -W 1000 "$1" ;;
    MINGW*|MSYS*|CYGWIN*) LC_ALL=C ping -n 1 -w 1000 "$1" ;;
    *) LC_ALL=C ping -c 1 -W 1 "$1" ;;
  esac
}

sort_download_urls() {
  urls_file=$1
  command -v ping >/dev/null 2>&1 && command -v sort >/dev/null 2>&1 || return 0
  ping_data=$TMP_ROOT/urls.ping
  : > "$ping_data"
  order=0
  while IFS= read -r url; do
    [ -n "$url" ] || continue
    order=$((order + 1))
    host=${url#https://}
    host=${host%%/*}
    latency=$(ping_host "$host" 2>/dev/null \
      | awk 'match($0, /time[=<][0-9.]+/) { print substr($0, RSTART + 5, RLENGTH - 5); exit }')
    if [ -n "$latency" ]; then
      log "Ping $host: $latency ms"
    else
      warn "could not measure latency for $host; trying it last"
      latency=999999999
    fi
    printf '%s\t%s\t%s\n' "$latency" "$order" "$url" >> "$ping_data"
  done < "$urls_file"

  LC_ALL=C sort -t "$(printf '\t')" -k1,1n -k2,2n "$ping_data" \
    | awk -F '\t' '{ print $3 }' > "$urls_file"
}

show_selection() {
  log "Selected platform: $PLATFORM_KEY"
  log "Selected version: $VERSION"
  log "Install path: $TARGET_FILE"
  log "$1"
  sed 's/^/  /' "$CANDIDATE_URLS"
}

verify_binary() {
  binary_file=$1
  chmod 0755 "$binary_file" || return 1
  if ! run_ruyi "$binary_file" version > "$VERSION_OUTPUT" 2>&1; then
    warn "downloaded binary failed its version check: $2"
    return 1
  fi
  reported_version=$(sed -n '1p' "$VERSION_OUTPUT")
  if [ "$reported_version" != "Ruyi $VERSION" ]; then
    warn "downloaded binary reports '$reported_version', expected 'Ruyi $VERSION'"
    return 1
  fi
}

run_privileged() {
  if [ "$USE_SUDO" -eq 1 ]; then
    sudo "$@"
  else
    "$@"
  fi
}

request_sudo() {
  if [ "$USE_SUDO" -eq 1 ] || [ "$(id -u 2>/dev/null)" = 0 ]; then
    return 0
  fi
  command -v sudo >/dev/null 2>&1 || die "sudo is required to install into $INSTALL_DIR"

  ask_yes_no "Use sudo to install Ruyi into $INSTALL_DIR?"
  prompt_status=$?
  case "$prompt_status" in
    0) ;;
    2) die "installation into $INSTALL_DIR requires interactive confirmation to use sudo" ;;
    *) die "installation cancelled" ;;
  esac

  sudo -v || die "sudo authorization failed"
  USE_SUDO=1
}

prepare_upgrade
warn_if_path_missing

RELEASE_DATA=$TMP_ROOT/release.data
PARSE_ERROR=$TMP_ROOT/release.error
CANDIDATE_URLS=$TMP_ROOT/urls.candidates
VERSION_OUTPUT=$TMP_ROOT/version.out

confirm_privacy_policy
confirm_install_target
confirm_upgrade_helper
fetch_release_data || die "failed to fetch valid release metadata from the official endpoints"
if [ "$UPGRADE" -eq 1 ] && ! version_is_newer "$VERSION" "$CURRENT_VERSION"; then
  log "Ruyi $CURRENT_VERSION is already $VERSION or newer; no upgrade is needed."
  exit 0
fi
awk '
  NR == 1 { next }
  /^https:\/\/mirror\.iscas\.ac\.cn\/ruyisdk\/ruyi\// { print; next }
  /^https:\/\/github\.com\/ruyisdk\/ruyi\/releases\/download\// {
    github[++count] = $0
    next
  }
  { print "warning: ignored unexpected download URL: " $0 > "/dev/stderr" }
  END { for (i = 1; i <= count; i++) print github[i] }
' "$RELEASE_DATA" > "$CANDIDATE_URLS"
[ -s "$CANDIDATE_URLS" ] || die "no trusted download URLs found for the stable channel on $PLATFORM_KEY"

if [ "$DRY_RUN" -eq 1 ]; then
  show_selection "Download candidates:"
  log "Dry run complete; no Ruyi binary was downloaded or installed."
  exit 0
fi

sort_download_urls "$CANDIDATE_URLS" || die "failed to sort download URLs by latency"
show_selection "Download candidates (lowest latency first):"

BINARY_FILE=$TMP_ROOT/$TARGET_NAME

while IFS= read -r url; do
  [ -n "$url" ] || continue
  log "Downloading $url"
  if fetch "$url" "$BINARY_FILE" && verify_binary "$BINARY_FILE" "$url"; then
    break
  fi
  rm -f "$BINARY_FILE"
  warn "ignoring unusable download: $url"
done < "$CANDIDATE_URLS"

[ -f "$BINARY_FILE" ] || die "all download candidates failed"

install_binary "$BINARY_FILE" "$TARGET_FILE"

log "Ruyi $VERSION was installed successfully: $TARGET_FILE"

install_upgrade_helper
