import React, { useEffect, useState } from "react";

export default function PdfPreview({ href, linkText }) {
  const [canPreview, setCanPreview] = useState(true);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.pdfViewerEnabled === false) {
      setCanPreview(false);
    }
  }, []);

  if (!canPreview) {
    return (
      <ul>
        <li>
          <a href={href} target="_blank" rel="noopener noreferrer">{linkText}</a>
        </li>
      </ul>
    );
  }

  return (
    <div className="-mx-6 mt-4 aspect-[4/3] overflow-hidden bg-white">
      <iframe
        className="block h-full w-full border-0 bg-white"
        src={href}
        title={linkText}
        onError={() => setCanPreview(false)}
      />
    </div>
  );
}
