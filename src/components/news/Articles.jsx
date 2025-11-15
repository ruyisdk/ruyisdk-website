import Button from "../common/Button";
import React, { useState, useMemo } from "react";

const Articles = ({ items, onClick, pageSize = 10 }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize],
  );
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
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* articles */}
      <div
        className={`flex flex-col gap-4 transition ${isTransitioning ? "scale-98" : "scale-100"
          }`}
      >
        {currentPageItems.map((article, index) => (
          <div
            key={`${currentPage}-${index}`}
            className={`group hover:scale-101 cursor-pointer rounded-lg shadow-md
            transition duration-200 hover:shadow-lg ${article.active
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
              } `}
            onClick={() => onClick(article.link)}
            style={{ height: '28vh' }}
          >
            {/* Use column layout on small screens, switch to row with image on right at md+ */}
            <div className="flex flex-col md:flex-row items-stretch h-full">
              {/* Content section (left on md+) */}
              <div className="space-y-3 p-6 flex-1 overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex-1 text-2xl md:text-3xl font-bold truncate">{article.title}</span>
                  <span className="whitespace-nowrap text-sm md:text-lg opacity-70 ml-3">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-base md:text-lg opacity-80 line-clamp-3 overflow-hidden">
                  {article.summary}
                </p>
              </div>

              {/* Image section (right on md+) */}
              {article.image && (
                <div className="flex-shrink-0 md:ml-4 md:mr-0 h-24 md:w-56 md:h-full">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover object-center rounded-b-lg md:rounded-r-lg md:rounded-bl-none transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder-news.svg';
                      e.target.className = 'w-full h-full object-cover object-center rounded-b-lg md:rounded-r-lg md:rounded-bl-none';
                    }}
                  />
                </div>
              )}
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
            ← 上一页
          </Button>

          <div
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2"
          >
            <span className="text-sm text-gray-600">
              {currentPage + 1} / {totalPages}
            </span>
          </div>

          <Button
            disabled={!canGoNext || isTransitioning}
            onClick={() => changePage("next")}
          >
            下一页 →
          </Button>
        </div>
      )}
    </div>
  );
};

export default Articles;
