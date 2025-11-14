import React from "react";

const Card = ({ label, color, borderColor, items, onClick }) => {
  return (
    <div className={`rounded-xl border border-white/60 bg-white/80 backdrop-blur-md p-3 shadow-md`}>
      <div className="mb-2 flex items-center">
        <div className={`mr-2 h-2 w-2 rounded-full ${color}`}></div>
        <span className="text-lg font-semibold text-gray-800">{label}</span>
      </div>
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
    </div>
  );
};

export default Card;
