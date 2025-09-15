import WeChatLink from "../components/common/WeChatLink";
import Articles from "../components/news/Articles";
import Card from "../components/news/Card";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import axios from "axios";
import React, { useState, useEffect } from "react";

const NewsPage = () => {
  const { i18n } = useDocusaurusContext();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [ruyinews, setRuyinews] = useState([]);
  const [weeklies, setWeeklies] = useState([]);

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
      let newsUrl = `/${i18n.currentLocale}/news.json`;
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

  return (
    <Layout title="News" description="RuyiSDK News and Updates">
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:flex-row">
        {loading ? (
          <p className="text-gray-600">loading...</p>
        ) : (
          <>
            {/* left */}
            <div className="min-w-0 flex-1 md:flex-[3]">
              <Articles items={articles} onClick={handleClick} />
            </div>

            {/* right */}
            <div
              className="flex h-fit min-w-0 flex-1 flex-col gap-4 md:sticky md:top-20"
            >
              <Card
                items={weeklies}
                label={translate({
                  id: "news.biweekly",
                  message: "RuyiSDK 周报",
                })}
                color="bg-blue-500"
                borderColor="border-blue-500"
                onClick={handleClick}
              />
              <Card
                items={ruyinews}
                label={translate({
                  id: "news.news",
                  message: "RuyiSDK 新闻",
                })}
                color="bg-green-500"
                borderColor="border-green-500"
                onClick={handleClick}
              />
            </div>
          </>
        )}
      </div>
      <WeChatLink />
    </Layout>
  );
};

export default NewsPage;
