import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Explorer from './components/Explorer';
import DeviceDetail from './components/DeviceDetail';
import PackageDetail from './components/PackageDetail';
import { I18nProvider } from './i18n';
import { setBaseUrl } from './api';

function App() {
  const { siteConfig } = useDocusaurusContext();
  
  useEffect(() => {
    setBaseUrl(siteConfig.baseUrl);
  }, [siteConfig.baseUrl]);

  return (
    <I18nProvider>
      <div className="pi-shell min-h-screen w-screen text-left">
        <Router>
          <Routes>
            <Route path="/" element={<Explorer />} />
            <Route path="/device/:id" element={<DeviceDetail />} />
            <Route path="/package/:category/:name/:version" element={<PackageDetail />} />
          </Routes>
        </Router>
      </div>
    </I18nProvider>
  );
}

export default App;
