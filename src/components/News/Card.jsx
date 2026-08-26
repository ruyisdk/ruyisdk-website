import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

const Card = ({ label, color, borderColor, items, onClick, loading }) => {
  return (
    <div className={`rounded-xl border border-white/60 bg-white/80 backdrop-blur-md p-3 shadow-md`}>
      <div className="mb-2 flex items-center">
        <div className={`mr-2 h-2 w-2 rounded-full ${color}`}></div>
        <span className="text-lg font-semibold text-gray-800">{label}</span>
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
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-gray-600 transition hover:-translate-y-0.5 hover:bg-white/70 hover:text-gray-800"
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
