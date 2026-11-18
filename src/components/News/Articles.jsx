import Button from "../common/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import LoadingSkeleton from "./LoadingSkeleton";

const getPageFromUrl = () => {
  if (typeof window === "undefined") return 0;

  const page = Number.parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10);
  return Number.isFinite(page) && page > 0 ? page - 1 : 0;
};

const updatePageInUrl = (pageIndex, { replace = false } = {}) => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("page", String(pageIndex + 1));
  window.history[replace ? "replaceState" : "pushState"](null, "", url);
};

const Articles = ({ items, onClick, pageSize = 10, loading = false }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const hasReadPageFromUrl = useRef(false);
  const { siteConfig, i18n } = useDocusaurusContext();
  const baseUrl = siteConfig?.baseUrl || "/";
  const currentLocale = i18n?.currentLocale;

  const resolveImg = (src) => {
    if (!src) return null;
    try {
      new URL(src);
      return src;
    } catch {}
    if (src.startsWith("/")) return baseUrl + src.slice(1);
    return baseUrl + src;
  };

  const formatDate = (date) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";

    if (currentLocale === "zh-Hans") {
      return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(parsed);
    }

    return parsed.toLocaleDateString();
  };

  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize],
  );

  useEffect(() => {
    if (totalPages <= 0) return;

    setCurrentPage((page) => {
      const pageFromUrl = hasReadPageFromUrl.current ? page : getPageFromUrl();
      const clampedPage = Math.min(Math.max(pageFromUrl, 0), totalPages - 1);

      if (!hasReadPageFromUrl.current) {
        hasReadPageFromUrl.current = true;
      }

      if (clampedPage !== pageFromUrl) {
        updatePageInUrl(clampedPage, { replace: true });
      }

      return clampedPage;
    });
  }, [totalPages]);

  useEffect(() => {
    const handlePopState = () => {
      const pageFromUrl = getPageFromUrl();
      const maxPage = Math.max(totalPages - 1, 0);
      setCurrentPage(Math.min(pageFromUrl, maxPage));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [totalPages]);

  const currentPageItems = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, currentPage, pageSize]);

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const changePage = async (direction) => {
    if (isTransitioning) return;

    const newPage =
      direction === "next"
        ? Math.min(currentPage + 1, totalPages - 1)
        : Math.max(currentPage - 1, 0);

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      updatePageInUrl(newPage);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* articles */}
      <div className={`flex flex-col gap-4 transition ${isTransitioning ? "scale-98" : "scale-100"}`}>
        {loading && <LoadingSkeleton type="articles" count={pageSize > 0 ? pageSize : 3} />}

        {!loading && currentPageItems.length === 0 && (
          <div className="rounded-xl border border-white/60 bg-white/80 backdrop-blur-md p-4 shadow-sm text-gray-600">
            {translate({ id: "news.articles.empty", message: "暂无文章" })}
          </div>
        )}

        {!loading && currentPageItems.map((article, index) => (
          <div
            key={`${currentPage}-${index}`}
            className={`group cursor-pointer rounded-xl border border-white/60 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col md:flex-row md:items-stretch md:min-h-[160px]`}
            onClick={() => onClick(article.link)}
          >
            {/* Content section (left on md+) */}
            <div className="min-w-0 flex flex-1 flex-col p-6 md:h-full">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="min-w-0 flex-1 break-words line-clamp-2 text-xl leading-snug font-bold text-gray-800">
                  {article.title}
                </span>
                <span className="flex-shrink-0 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(article.date)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed break-words">{article.summary}</p>
            </div>

            {/* Image section */}
            <div className="w-full md:w-48 lg:w-64 flex-shrink-0 order-1 md:order-2 relative overflow-hidden aspect-video md:aspect-auto md:h-full">
              <img
                src={resolveImg(article.image) || resolveImg("img/downloads/ruyi-logo-720.svg")}
                alt={article.title}
                className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = resolveImg("img/downloads/ruyi-logo-720.svg");
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* page controller */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            disabled={!canGoPrev || isTransitioning}
            onClick={() => changePage("prev")}
          >
            {"← "}
            {translate({ id: "news.pagination.prev", message: "上一页" })}
          </Button>

          <div className="flex items-center gap-2 rounded-lg bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-700">
              {currentPage + 1} / {totalPages}
            </span>
          </div>

          <Button
            disabled={!canGoNext || isTransitioning}
            onClick={() => changePage("next")}
          >
            {translate({ id: "news.pagination.next", message: "下一页" })}
            {" →"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Articles;
