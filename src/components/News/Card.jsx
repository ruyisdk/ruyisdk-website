import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

const Card = ({ label, color, borderColor, items, onClick, loading }) => {
  return (
    <div className="rounded-2xl border border-slate-200/85 dark:border-white/10 bg-white/95 dark:bg-[#151b23]/92 backdrop-blur-md p-4 shadow-[0_6px_20px_rgba(10,44,126,0.05)]">
      <div className="mb-2.5 flex items-center">
        <div className={`mr-2.5 h-2.5 w-2.5 rounded-full ${color}`}></div>
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{label}</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-md px-2 py-1.5">
              <div className="skeleton-line skeleton w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300 transition hover:-translate-y-0.5 hover:bg-[#eef4ff]/80 dark:hover:bg-white/8 hover:text-[#0A2C7E] dark:hover:text-[#79a8ff]"
              onClick={() => onClick(item.link)}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
