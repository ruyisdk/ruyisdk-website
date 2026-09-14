import React from 'react';

/**
 * SectionContainer
 * Unified wrapper for homepage sections: consistent max width, horizontal
 * paddings and vertical rhythm. Extra utilities (borders, spacing, etc.)
 * can be passed through className.
 */
export default function SectionContainer({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto flex flex-col px-4 py-8 gap-6 ${className}`}>
      {children}
    </div>
  );
}
