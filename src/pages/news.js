import Articles from "../components/news/Articles";
import Card from "../components/news/Card";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import axios from "axios";
import React, { useState, useEffect } from "react";

const NewsPage = () => {
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
      const response = await axios.get("/news.json");
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
  }, []);

  return (
    <Layout title="News" description="RuyiSDK News and Updates">
      <div className="flex min-h-0 flex-1 gap-4 bg-gray-50 p-4">
        {loading ? (
          <p className="text-gray-600">loading...</p>
        ) : (
          <>
            {/* left */}
            <div className="min-w-0 flex-[3]">
              <Articles items={articles} onClick={handleClick} />
            </div>

            {/* right */}
            <div
              className="sticky top-20 flex h-fit min-w-0 flex-1 flex-col gap-4"
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
    </Layout>
  );
};

export default NewsPage;
