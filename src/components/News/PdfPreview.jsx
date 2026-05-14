import React, { useEffect, useState } from "react";

export default function PdfPreview({ href, linkText }) {
  const [canPreview, setCanPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      setCanPreview(false);
      return;
    }

    const userAgent = navigator.userAgent || "";
    const isMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(userAgent);
    const isNarrowTouchScreen =
      window.matchMedia?.("(max-width: 767px)").matches &&
      window.matchMedia?.("(pointer: coarse)").matches;
    const supportsPdfPreview = navigator.pdfViewerEnabled !== false;

    setCanPreview(supportsPdfPreview && !isMobileUserAgent && !isNarrowTouchScreen);
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
