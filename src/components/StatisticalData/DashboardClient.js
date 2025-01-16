import { useMemo, useContext } from "react";
import axios from "axios";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const useDashboardClient = () => {
  const { siteConfig: { customFields }, } = useDocusaurusContext()

  const axiosInstance = useMemo(() => {
    if (!customFields.apiURL) return null;

    const instance = axios.create({
      baseURL: `https://${customFields.apiURL}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return instance;
  }, [customFields.apiURL]);

  return axiosInstance;
};

export default useDashboardClient;
