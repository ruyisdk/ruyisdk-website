import React from 'react';

/**
 * SectionContainer
 * Unified wrapper for homepage sections to ensure consistent max width,
 * horizontal paddings, rounded corners on wide screens, and background.
 */
export default function SectionContainer({ children, className = '' }) {
  return (
    <div className="w-full bg-[#f5f5f7]">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className={`w-full mx-auto max-w-[90rem] xl:rounded-[0.625rem] ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
