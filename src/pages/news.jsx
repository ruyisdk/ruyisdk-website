import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import WeChatLink from "@site/src/components/common/WeChatLink";
import Articles from "@site/src/components/News/Articles";
import Card from "@site/src/components/News/Card";
import ButtonSubscription from "@site/src/components/News/Subscription/ButtonSubscription";

const NewsPage = () => {
  const { i18n } = useDocusaurusContext();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [ruyinews, setRuyinews] = useState([]);
  const [weeklies, setWeeklies] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const handleClick = (link) => {
    window.open(link, "_blank");
  };

  const filterFutureItems = (items) => {
    const now = Date.now();
    return (items || []).filter((item) => {
      const timestamp = Number(item?.date);
      return !Number.isFinite(timestamp) || timestamp <= now;
    });
  };

  const loadNewsData = async () => {
    try {
      let newsUrl = "/news.json";
      if (i18n.currentLocale !== i18n.defaultLocale) {
        newsUrl = `/${i18n.currentLocale}${newsUrl}`;
      }
      let response = await axios.get(newsUrl);
      const { articles, ruyinews, weeklies } = response.data;
      setArticles(filterFutureItems(articles));
      setRuyinews(filterFutureItems(ruyinews).slice(0, 10));
      setWeeklies(filterFutureItems(weeklies).slice(0, 10));
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsData();
  }, [i18n.currentLocale]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout title="News" description="RuyiSDK News and Updates">
      <PageBackground isClient={isClient} />
      <div className="relative overflow-visible px-6 py-8 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          {loading ? (
            <div className="flex w-full justify-center items-center py-12">
              <div className="skeleton-card w-full max-w-4xl">
                <div className="skeleton-title skeleton w-2/5 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="skeleton-line skeleton mb-3 h-6"></div>
                    <div className="skeleton-line skeleton mb-3 h-6 w-5/6"></div>
                    <div className="skeleton-line skeleton mb-3 h-40"></div>
                  </div>
                  <div>
                    <div className="skeleton-line skeleton mb-3 h-6 w-3/4"></div>
                    <div className="skeleton-line skeleton mb-3 h-6 w-2/3"></div>
                    <div className="skeleton-line skeleton mb-3 h-40"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-row md:gap-x-8 md:gap-y-6">
              {/* left */}
                <div className="min-w-0 flex-1 md:flex-[3] md:pr-0 lg:pr-0">
                <Articles items={articles} loading={loading} onClick={handleClick} />
              </div>

              {/* right (will be fixed on md+ screens) */}
                <div className="relative md:w-64 md:flex-initial">
                <div className="md:sticky md:top-6 self-start md:w-64">
                  <div className="p-2">
                    <ButtonSubscription />
                  </div>
                  <div className="space-y-4">
                    <Card
                      items={weeklies}
                      label={translate({ id: "news.biweekly", message: "Biweekly" })}
                      color="bg-blue-500"
                      borderColor="border-blue-500"
                      onClick={handleClick}
                      loading={loading}
                    />
                    <Card
                      items={ruyinews}
                      label={translate({ id: "news.news", message: "RuyiSDK 新闻" })}
                      color="bg-green-500"
                      borderColor="border-green-500"
                      onClick={handleClick}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <WeChatLink />
        </div>
      </div>
    </Layout>
  );
};

export default NewsPage;

// Background blobs similar to Contributors page
function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: "rgba(221, 190, 221, 0.2)", filter: "blur(120px)" }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: "rgba(168, 218, 220, 0.2)", filter: "blur(120px)" }}
      />
    </div>,
    document.body,
  );
}
