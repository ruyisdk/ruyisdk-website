import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import latestPmBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';
import latestVscodeBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_vscode.json';
import latestEclipseBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_eclipse.json';

const PM_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-pm';
const VSCODE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/vscode';
const ECLIPSE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/eclipse';

export default function useLatestReleases() {
  const { data: releaseData } = useDataWithApiFallback(latestPmBuilt, PM_RELEASE_LATEST_API);
  const { data: vscodeLatestData } = useDataWithApiFallback(
    latestVscodeBuilt,
    VSCODE_RELEASE_LATEST_API,
  );
  const { data: eclipseLatestData } = useDataWithApiFallback(
    latestEclipseBuilt,
    ECLIPSE_RELEASE_LATEST_API,
  );
  return { releaseData, vscodeLatestData, eclipseLatestData };
}
