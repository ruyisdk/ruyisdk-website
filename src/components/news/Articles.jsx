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
            className={`cursor-pointer rounded-xl border border-white/60 bg-white/80 backdrop-blur-md shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
            onClick={() => onClick(article.link)}
            style={{ height: '28vh' }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Content section (left on md+) */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-gray-800">{article.title}</span>
                  <span className="whitespace-nowrap text-base md:text-lg text-gray-600">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-base md:text-lg text-gray-700/90 line-clamp-3">
                  {article.summary}
                </p>
              </div>

              {/* Image section (right on md+) */}
              {article.image && (
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-48 md:h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
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
