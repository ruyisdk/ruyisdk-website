import axios from 'axios';

let baseUrl = '/';

export const setBaseUrl = (url: string) => {
  baseUrl = url;
};

export const getEntities = async (type?: string, query?: string) => {
  const res = await axios.get(`${baseUrl}api/entities.json`);
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
  const res = await axios.get(`${baseUrl}api/packages.json`);
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
  const res = await axios.get(`${baseUrl}api/hierarchy.json`);
  return res.data;
};

export const getEntityDetail = async (type: string, id: string) => {
  const res = await axios.get(`${baseUrl}api/entities/${type}/${id}.json`);
  return res.data;
};

export const getPackageDetail = async (category: string, pkg: string, version: string) => {
  const res = await axios.get(`${baseUrl}api/packages/${category}/${pkg}/${version}.json`);
  return res.data;
};
