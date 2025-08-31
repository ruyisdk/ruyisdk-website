import React from "react";

const Card = ({ label, color, borderColor, items, onClick }) => {
  return (
    <div
      className={`border-l-solid rounded-lg border-l-4 bg-white p-2 shadow-md
        ${borderColor}`}
    >
      <div className="mb-2 flex items-center">
        <div className={`mr-2 h-2 w-2 rounded-full ${color}`}></div>
        <span className="text-lg font-semibold text-gray-800">{label}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center justify-between border-l
              border-transparent pl-3 text-gray-500 transition
              hover:border-gray-700 hover:text-gray-700"
            onClick={() => onClick(item.link)}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
