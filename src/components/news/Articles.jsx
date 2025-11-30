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
        className={`flex flex-col gap-4 transition ${isTransitioning ? "scale-98" : "scale-100"}`}
      >
        {currentPageItems.map((article, index) => (
          <div
            key={`${currentPage}-${index}`}
            className={`group cursor-pointer rounded-xl border border-white/60 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col md:flex-row`}
            onClick={() => onClick(article.link)}
          >
            {/* Content section */}
            <div className="flex-1 p-6 flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-emphasis transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <span className="whitespace-nowrap text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
              <div className="mt-4 flex items-center text-emphasis font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Read more →
              </div>
            </div>

            {/* Image section */}
            {article.image && (
              <div className="w-full md:w-48 lg:w-64 flex-shrink-0 order-1 md:order-2 relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 md:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
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

          <div className="flex items-center gap-2 rounded-lg bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-700">
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
