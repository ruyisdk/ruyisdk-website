import axios from 'axios';

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

export const getEntities = async (type?: string, query?: string) => {
  const res = await axios.get(getApiUrl('/entities.json'));
  let data = res.data;
  if (type) {
    data = data.filter((e: any) => e.type === type);
  }
  if (query) {
    const q = query.toLowerCase();
    data = data.filter((e: any) => 
      e.id.toLowerCase().includes(q) || e.display_name.toLowerCase().includes(q)
    );
  }
  return data;
};

export const getPackages = async (category?: string, pkg?: string, query?: string) => {
  const res = await axios.get(getApiUrl('/packages.json'));
  let data = res.data;
  if (category) {
    data = data.filter((p: any) => p.category === category);
  }
  if (pkg) {
    data = data.filter((p: any) => p.package === pkg);
  }
  if (query) {
    const q = query.toLowerCase();
    data = data.filter((p: any) => 
      p.package.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q)
    );
  }
  return data;
};

export const getHierarchy = async () => {
  const res = await axios.get(getApiUrl('/hierarchy.json'));
  return res.data;
};

export const getEntityDetail = async (type: string, id: string) => {
  const res = await axios.get(getApiUrl(`/entities/${type}/${id}.json`));
  return res.data;
};

export const getPackageDetail = async (category: string, pkg: string, version: string) => {
  const res = await axios.get(getApiUrl(`/packages/${category}/${pkg}/${version}.json`));
  return res.data;
};
