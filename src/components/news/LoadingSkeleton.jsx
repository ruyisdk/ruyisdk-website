import React from "react";

const SkeletonArticle = () => (
  <div className="skeleton-card group rounded-xl p-4 flex flex-col md:flex-row gap-4" aria-hidden>
    <div className="flex-1">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="skeleton-title skeleton w-3/4"></div>
        <div className="skeleton-meta skeleton"></div>
      </div>
      <div className="skeleton-line skeleton mb-2 w-full"></div>
      <div className="skeleton-line skeleton mb-2 w-5/6"></div>
      <div className="skeleton-line skeleton mb-2 w-2/3"></div>
    </div>
    <div className="w-full md:w-48 lg:w-64 flex-shrink-0 order-1 md:order-2">
      <div className="skeleton-image skeleton h-48 w-full" />
    </div>
  </div>
);

const SidebarSkeleton = ({ rows = 6 }) => (
  <div className="rounded-xl border border-white/60 bg-white/80 backdrop-blur-md p-3 shadow-md">
    <div className="mb-2 flex items-center">
      <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
      <div className="skeleton-title skeleton w-1/2"></div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-md px-2 py-1.5">
          <div className="skeleton-line skeleton w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const LoadingSkeleton = ({ type = "articles", count = 3 }) => {
  if (type === "sidebar") return <SidebarSkeleton rows={count} />;
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonArticle key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
