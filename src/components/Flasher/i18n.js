import { translate } from "@docusaurus/Translate";

/** Maps worker error codes to extractable messages in the active locale. */
const errors = {
  "error.pageClosed": (values) =>
    translate(
      { id: "flasher.error.pageClosed", message: "Page closed" },
      values,
    ),
  "error.storageUnsupported": (values) =>
    translate(
      {
        id: "flasher.error.storageUnsupported",
        message:
          "This browser does not support temporary file storage. Use a current desktop Chrome or Edge.",
      },
      values,
    ),
  "error.preparation": (values) =>
    translate(
      { id: "flasher.error.preparation", message: "Could not load images" },
      values,
    ),
  "error.stopped": (values) =>
    translate(
      {
        id: "flasher.error.stopped",
        message:
          "Stopped before the next step. Completed writes have been retained.",
      },
      values,
    ),
  "error.stoppedBeforeReconnect": (values) =>
    translate(
      {
        id: "flasher.error.stoppedBeforeReconnect",
        message:
          "Stopped before reconnection. Completed writes have been retained.",
      },
      values,
    ),
  "error.cancelled": (values) =>
    translate(
      { id: "flasher.error.cancelled", message: "Image loading cancelled" },
      values,
    ),
  "error.stoppedWhileReconnecting": (values) =>
    translate(
      {
        id: "flasher.error.stoppedWhileReconnecting",
        message: "Stopped while waiting for reconnection",
      },
      values,
    ),
  "error.downloadSize": (values) =>
    translate(
      {
        id: "flasher.error.downloadSize",
        message: "Download size mismatch: {name}",
      },
      values,
    ),
  "error.noChecksum": (values) =>
    translate(
      {
        id: "flasher.error.noChecksum",
        message: "No checksum is available for {name}",
      },
      values,
    ),
  "error.checksum": (values) =>
    translate(
      { id: "flasher.error.checksum", message: "Checksum mismatch: {name}" },
      values,
    ),
  "error.duplicate": (values) =>
    translate(
      { id: "flasher.error.duplicate", message: "Duplicate image: {name}" },
      values,
    ),
  "error.tooManyImages": (values) =>
    translate(
      { id: "flasher.error.tooManyImages", message: "Too many image files" },
      values,
    ),
  "error.storageInsufficient": (values) =>
    translate(
      {
        id: "flasher.error.storageInsufficient",
        message: "Not enough browser storage for the extracted images",
      },
      values,
    ),
  "error.storageLimit": (values) =>
    translate(
      {
        id: "flasher.error.storageLimit",
        message: "Browser storage limit exceeded",
      },
      values,
    ),
  "error.storageWrite": (values) =>
    translate(
      {
        id: "flasher.error.storageWrite",
        message: "Failed to write extracted image",
      },
      values,
    ),
  "error.truncatedImage": (values) =>
    translate(
      {
        id: "flasher.error.truncatedImage",
        message: "Truncated image: {name}",
      },
      values,
    ),
  "error.emptyInput": (values) =>
    translate(
      { id: "flasher.error.emptyInput", message: "Empty input file: {name}" },
      values,
    ),
  "error.encryptedZip": (values) =>
    translate(
      {
        id: "flasher.error.encryptedZip",
        message: "Encrypted ZIP files are not supported",
      },
      values,
    ),
  "error.profileMismatch": (values) =>
    translate(
      {
        id: "flasher.error.profileMismatch",
        message: "This image does not belong to the selected profile: {name}",
      },
      values,
    ),
  "error.zstdInit": (values) =>
    translate(
      {
        id: "flasher.error.zstdInit",
        message: "Could not initialize Zstandard",
      },
      values,
    ),
  "error.invalidZstd": (values) =>
    translate(
      { id: "flasher.error.invalidZstd", message: "Invalid Zstandard image" },
      values,
    ),
  "error.truncatedZstd": (values) =>
    translate(
      {
        id: "flasher.error.truncatedZstd",
        message: "Truncated Zstandard image",
      },
      values,
    ),
  "error.unsupportedFile": (values) =>
    translate(
      {
        id: "flasher.error.unsupportedFile",
        message:
          "Unsupported file or image does not match the selected profile: {name}",
      },
      values,
    ),
  "error.noImages": (values) =>
    translate(
      { id: "flasher.error.noImages", message: "No matching images found" },
      values,
    ),
  "error.noInterface": (values) =>
    translate(
      {
        id: "flasher.error.noInterface",
        message: "The selected device does not expose a fastboot interface",
      },
      values,
    ),
  "error.usbTimeout": (values) =>
    translate(
      {
        id: "flasher.error.usbTimeout",
        message:
          "USB operation timed out. Reconnect the device before continuing.",
      },
      values,
    ),
  "error.disconnected": (values) =>
    translate(
      { id: "flasher.error.disconnected", message: "Device disconnected" },
      values,
    ),
  "error.usbResponse": (values) =>
    translate(
      { id: "flasher.error.usbResponse", message: "Invalid USB response" },
      values,
    ),
  "error.fastbootResponse": (values) =>
    translate(
      {
        id: "flasher.error.fastbootResponse",
        message: "Unexpected fastboot response: {status}",
      },
      values,
    ),
  "error.tooManyResponses": (values) =>
    translate(
      {
        id: "flasher.error.tooManyResponses",
        message: "Too many fastboot status messages",
      },
      values,
    ),
  "error.command": (values) =>
    translate(
      { id: "flasher.error.command", message: "Invalid fastboot command" },
      values,
    ),
  "error.commandTransfer": (values) =>
    translate(
      {
        id: "flasher.error.commandTransfer",
        message: "Incomplete USB command transfer",
      },
      values,
    ),
  "error.unexpectedData": (values) =>
    translate(
      {
        id: "flasher.error.unexpectedData",
        message: "Unexpected DATA response to {command}",
      },
      values,
    ),
  "error.downloadLimit": (values) =>
    translate(
      {
        id: "flasher.error.downloadLimit",
        message: "Invalid max-download-size",
      },
      values,
    ),
  "error.imageTransfer": (values) =>
    translate(
      {
        id: "flasher.error.imageTransfer",
        message: "Incomplete USB image transfer",
      },
      values,
    ),
  "error.downloadLength": (values) =>
    translate(
      {
        id: "flasher.error.downloadLength",
        message: "Invalid fastboot download size",
      },
      values,
    ),
  "error.acceptedLength": (values) =>
    translate(
      {
        id: "flasher.error.acceptedLength",
        message: "Device accepted an unexpected download size",
      },
      values,
    ),
  "error.dataAfterTransfer": (values) =>
    translate(
      {
        id: "flasher.error.dataAfterTransfer",
        message: "Unexpected DATA after image transfer",
      },
      values,
    ),
  "error.partitionName": (values) =>
    translate(
      { id: "flasher.error.partitionName", message: "Invalid partition name" },
      values,
    ),
  "error.ramLimit": (values) =>
    translate(
      {
        id: "flasher.error.ramLimit",
        message: "RAM image exceeds the device download limit",
      },
      values,
    ),
  "error.stageLimit": (values) =>
    translate(
      {
        id: "flasher.error.stageLimit",
        message: "Boot-stage image exceeds the device download limit",
      },
      values,
    ),
  "error.archivePath": (values) =>
    translate(
      { id: "flasher.error.archivePath", message: "Invalid archive path" },
      values,
    ),
  "error.ambiguousImage": (values) =>
    translate(
      {
        id: "flasher.error.ambiguousImage",
        message: "Ambiguous image: {name}",
      },
      values,
    ),
  "error.missingImage": (values) =>
    translate(
      { id: "flasher.error.missingImage", message: "Missing image: {name}" },
      values,
    ),
  "error.emptyNamedImage": (values) =>
    translate(
      { id: "flasher.error.emptyNamedImage", message: "Empty image: {name}" },
      values,
    ),
  "error.strategy": (values) =>
    translate(
      {
        id: "flasher.error.strategy",
        message: "Unsupported flashing strategy: {strategy}",
      },
      values,
    ),
  "error.emptyPlan": (values) =>
    translate(
      { id: "flasher.error.emptyPlan", message: "The flashing plan is empty" },
      values,
    ),
  "error.emptyImage": (values) =>
    translate(
      { id: "flasher.error.emptyImage", message: "Empty image" },
      values,
    ),
  "error.sparseHeader": (values) =>
    translate(
      {
        id: "flasher.error.sparseHeader",
        message: "Unsupported sparse image header",
      },
      values,
    ),
  "error.sparseDimensions": (values) =>
    translate(
      {
        id: "flasher.error.sparseDimensions",
        message: "Invalid sparse image dimensions",
      },
      values,
    ),
  "error.sparseChunkHeader": (values) =>
    translate(
      {
        id: "flasher.error.sparseChunkHeader",
        message: "Truncated sparse chunk header",
      },
      values,
    ),
  "error.sparseChunk": (values) =>
    translate(
      { id: "flasher.error.sparseChunk", message: "Invalid sparse chunk" },
      values,
    ),
  "error.sparseLength": (values) =>
    translate(
      {
        id: "flasher.error.sparseLength",
        message: "Sparse image length mismatch",
      },
      values,
    ),
  "error.sparseBlockLimit": (values) =>
    translate(
      {
        id: "flasher.error.sparseBlockLimit",
        message: "Image exceeds sparse block count limit",
      },
      values,
    ),
  "error.sparseDownloadLimit": (values) =>
    translate(
      {
        id: "flasher.error.sparseDownloadLimit",
        message: "Device download limit is too small for sparse images",
      },
      values,
    ),
  "error.truncatedArchive": (values) =>
    translate(
      { id: "flasher.error.truncatedArchive", message: "Truncated archive" },
      values,
    ),
  "error.negativeTarSize": (values) =>
    translate(
      { id: "flasher.error.negativeTarSize", message: "Negative tar size" },
      values,
    ),
  "error.tarNumber": (values) =>
    translate(
      { id: "flasher.error.tarNumber", message: "Invalid tar number" },
      values,
    ),
  "error.tarEntrySize": (values) =>
    translate(
      { id: "flasher.error.tarEntrySize", message: "Tar entry is too large" },
      values,
    ),
  "error.paxHeader": (values) =>
    translate(
      { id: "flasher.error.paxHeader", message: "Invalid PAX header" },
      values,
    ),
  "error.paxRecord": (values) =>
    translate(
      { id: "flasher.error.paxRecord", message: "Invalid PAX record" },
      values,
    ),
  "error.paxField": (values) =>
    translate(
      { id: "flasher.error.paxField", message: "Invalid PAX field" },
      values,
    ),
  "error.sparseTar": (values) =>
    translate(
      {
        id: "flasher.error.sparseTar",
        message: "Sparse tar archives must be extracted before use",
      },
      values,
    ),
  "error.tarEnd": (values) =>
    translate(
      { id: "flasher.error.tarEnd", message: "Invalid tar end marker" },
      values,
    ),
  "error.tarTrailingData": (values) =>
    translate(
      {
        id: "flasher.error.tarTrailingData",
        message: "Unexpected data after tar end marker",
      },
      values,
    ),
  "error.tarChecksum": (values) =>
    translate(
      {
        id: "flasher.error.tarChecksum",
        message: "Invalid tar header checksum",
      },
      values,
    ),
  "error.tarMetadataSize": (values) =>
    translate(
      {
        id: "flasher.error.tarMetadataSize",
        message: "Tar metadata is too large",
      },
      values,
    ),
  "error.paxSize": (values) =>
    translate(
      { id: "flasher.error.paxSize", message: "Invalid PAX size" },
      values,
    ),
  "error.zstdMagic": (values) =>
    translate(
      {
        id: "flasher.error.zstdMagic",
        message: "Invalid Zstandard frame magic",
      },
      values,
    ),
  "error.zstdFlags": (values) =>
    translate(
      {
        id: "flasher.error.zstdFlags",
        message: "Reserved Zstandard frame flags",
      },
      values,
    ),
  "error.zstdBlockType": (values) =>
    translate(
      {
        id: "flasher.error.zstdBlockType",
        message: "Invalid Zstandard block type",
      },
      values,
    ),
  "error.zstdBlockSize": (values) =>
    translate(
      {
        id: "flasher.error.zstdBlockSize",
        message: "Invalid Zstandard block size",
      },
      values,
    ),
};

/** Localizes application errors while preserving device and external diagnostics. */
export function formatError(error) {
  if (typeof error?.code === "string" && Object.hasOwn(errors, error.code))
    return errors[error.code](error.values || {});
  const values = { detail: error?.message || String(error) };
  if (error?.status === "FAIL" && error.command)
    return translate(
      {
        id: "flasher.deviceCommandError",
        message: "Device rejected {command}: {detail}",
      },
      { ...values, command: error.command },
    );
  return error?.status === "FAIL"
    ? translate(
        {
          id: "flasher.deviceError",
          message: "Device rejected the command: {detail}",
        },
        values,
      )
    : translate(
        { id: "flasher.externalError", message: "Operation failed: {detail}" },
        values,
      );
}

/** Formats progress messages sent by the preparation worker. */
export function formatProgress({ phase, name }) {
  switch (phase) {
    case "verifying":
      return translate(
        { id: "flasher.verifying", message: "Verifying: {name}" },
        { name },
      );
    case "extracting":
      return translate(
        { id: "flasher.extracting", message: "Extracting: {name}" },
        { name },
      );
    case "decompressing":
      return translate(
        { id: "flasher.decompressing", message: "Extracting: {name}" },
        { name },
      );
    default:
      throw new Error("Unknown preparation phase: " + phase);
  }
}
