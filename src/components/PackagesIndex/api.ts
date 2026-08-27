const API_PATH = 'data/api/api_packages_index';
let apiBaseUrl: string | undefined;

export const setBaseUrl = (baseUrl: string) => {
  apiBaseUrl = `${baseUrl}${API_PATH}`;
};

const getApiUrl = (path: string) => {
  if (!apiBaseUrl) {
    throw new Error('Packages API base URL has not been configured');
  }
  return `${apiBaseUrl}${path}`;
};

const fetchJson = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const getEntities = async (type?: string, query?: string) => {
  let data = await fetchJson<any[]>(getApiUrl('/entities.json'));
  if (type) {
    data = data.filter((e: any) => e.type === type);
  }
  if (query) {
    const q = query.toLowerCase();
    data = data.filter(
      (e: any) =>
        e.id.toLowerCase().includes(q) ||
        e.display_name.toLowerCase().includes(q),
    );
  }
  return data;
};

export const getPackages = async (
  category?: string,
  pkg?: string,
  query?: string,
) => {
  let data = await fetchJson<any[]>(getApiUrl('/packages.json'));
  if (category) {
    data = data.filter((p: any) => p.category === category);
  }
  if (pkg) {
    data = data.filter((p: any) => p.package === pkg);
  }
  if (query) {
    const q = query.toLowerCase();
    data = data.filter(
      (p: any) =>
        p.package.toLowerCase().includes(q) ||
        (p.desc || '').toLowerCase().includes(q),
    );
  }
  return data;
};

export const getHierarchy = async () => {
  return await fetchJson<Record<string, string[]>>(getApiUrl('/hierarchy.json'));
};

export const getEntityDetail = async (type: string, id: string) => {
  return await fetchJson<any>(getApiUrl(`/entities/${type}/${id}.json`));
};

export const getPackageDetail = async (
  category: string,
  pkg: string,
  version: string,
) => {
  return await fetchJson<any>(
    getApiUrl(`/packages/${category}/${pkg}/${version}.json`),
  );
};
