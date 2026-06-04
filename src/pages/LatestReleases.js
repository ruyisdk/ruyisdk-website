import ReleaseProvider, {
  DownloadRuyi,
  ChmodCommand,
  CpCommand,
  useReleaseData,
  FileName,
  extractFileName,
  generateChmodCommand,
} from '@site/src/components/Docs/LatestReleases';

// Re-export default and named exports so imports targeting
// '@site/src/pages/LatestReleases' will resolve correctly.
export default ReleaseProvider;
export {
  DownloadRuyi,
  ChmodCommand,
  CpCommand,
  useReleaseData,
  FileName,
  extractFileName,
  generateChmodCommand,
};
