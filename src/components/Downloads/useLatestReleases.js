import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import latestPmBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';
import latestVscodeBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_vscode.json';
import latestEclipseBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_eclipse.json';
import {
  PM_RELEASE_LATEST_API,
  VSCODE_RELEASE_LATEST_API,
  ECLIPSE_RELEASE_LATEST_API,
} from './constants';

export default function useLatestReleases() {
  const { data: pm, hasRemoteData: pmRemote } = useDataWithApiFallback(
    latestPmBuilt,
    PM_RELEASE_LATEST_API,
  );
  const { data: vscode, hasRemoteData: vscodeRemote } = useDataWithApiFallback(
    latestVscodeBuilt,
    VSCODE_RELEASE_LATEST_API,
  );
  const { data: eclipse, hasRemoteData: eclipseRemote } = useDataWithApiFallback(
    latestEclipseBuilt,
    ECLIPSE_RELEASE_LATEST_API,
  );

  return {
    pm,
    vscode,
    eclipse,
    hasRemoteData: pmRemote || vscodeRemote || eclipseRemote,
  };
}
