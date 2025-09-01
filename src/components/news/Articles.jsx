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
        className={`flex flex-col gap-4 transition ${
          isTransitioning ? "scale-98" : "scale-100"
        }`}
      >
        {currentPageItems.map((article, index) => (
          <div
            key={`${currentPage}-${index}`}
            className={`hover:scale-101 cursor-pointer rounded-lg p-6 shadow-md
            transition duration-200 hover:shadow-lg ${
              article.active
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            } `}
            onClick={() => onClick(article.link)}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-semibold">{article.title}</span>
              <span className="whitespace-nowrap text-xs opacity-70">
                {new Date(article.date).toLocaleDateString()}
              </span>
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
