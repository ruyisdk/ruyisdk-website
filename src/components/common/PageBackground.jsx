import React from 'react';
import ReactDOM from 'react-dom';

const DEFAULT_BLOBS = [
  {
    className: 'fixed top-0 left-0 rounded-full -z-10',
    style: { width: 600, height: 600, background: 'rgba(221, 190, 221, 0.2)', filter: 'blur(120px)' },
  },
  {
    className: 'fixed bottom-0 right-0 rounded-full -z-10',
    style: { width: 700, height: 700, background: 'rgba(168, 218, 220, 0.2)', filter: 'blur(120px)' },
  },
];

export default function PageBackground({ isClient, blobs = DEFAULT_BLOBS }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      {blobs.map((blob) => (
        <div
          key={blob.className}
          aria-hidden
          className={blob.className}
          style={blob.style}
        />
      ))}
    </div>,
    document.body,
  );
}