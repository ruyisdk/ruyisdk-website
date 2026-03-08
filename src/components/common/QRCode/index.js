import React from "react";

const QRCode = ({ 
  src, // 必填：图片路径
  alt = "QR Code",
  size = 120, // 默认 120
  borderRadius = 10,
  shadow = "0 2px 8px rgba(0,0,0,0.08)",
  QRnumber = null, // 可选：二维码下方的号码信息
  normalizeQuietZone = true,
  normalizedPadding = 18,
  style,
  className,
  location = "left", // 可选：left | center | right
  ...props 
}) => {
  const [displaySrc, setDisplaySrc] = React.useState(src);

  const textAlignMap = { left: "left", center: "center", right: "right" };
  const resolvedTextAlign = textAlignMap[location] || "left";
  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };
  const resolvedJustifyContent = justifyMap[location] || "flex-start";

  React.useEffect(() => {
    let cancelled = false;

    if (!src || !normalizeQuietZone) {
      setDisplaySrc(src);
      return () => {
        cancelled = true;
      };
    }

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      if (cancelled) return;

      try {
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = image.naturalWidth;
        sourceCanvas.height = image.naturalHeight;
        const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
        if (!sourceCtx) {
          setDisplaySrc(src);
          return;
        }

        sourceCtx.drawImage(image, 0, 0);
        const { data, width, height } = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        // Detect non-white pixels to locate the effective QR area.
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            const isWhiteLike = r > 245 && g > 245 && b > 245;
            if (a > 10 && !isWhiteLike) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (maxX < minX || maxY < minY) {
          setDisplaySrc(src);
          return;
        }

        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        const cropSize = Math.max(cropWidth, cropHeight);
        const cropOffsetX = minX - Math.max(0, (cropSize - cropWidth) / 2);
        const cropOffsetY = minY - Math.max(0, (cropSize - cropHeight) / 2);

        const outputSize = 512;
        const safePadding = Math.max(0, Math.min(normalizedPadding, 80));
        const innerSize = outputSize - safePadding * 2;

        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize;
        const outputCtx = outputCanvas.getContext("2d");
        if (!outputCtx) {
          setDisplaySrc(src);
          return;
        }

        outputCtx.fillStyle = "#ffffff";
        outputCtx.fillRect(0, 0, outputSize, outputSize);
        outputCtx.drawImage(
          sourceCanvas,
          cropOffsetX,
          cropOffsetY,
          cropSize,
          cropSize,
          safePadding,
          safePadding,
          innerSize,
          innerSize,
        );

        setDisplaySrc(outputCanvas.toDataURL("image/png"));
      } catch {
        setDisplaySrc(src);
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setDisplaySrc(src);
      }
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [normalizeQuietZone, normalizedPadding, src]);

  // 必填校验
  if (!src) {
    return (
      <div 
        style={{ 
          textAlign: resolvedTextAlign, 
          display: "flex",
          justifyContent: resolvedJustifyContent,
          margin: "1rem 0",
          color: "#999",
          ...style 
        }} 
        className={className}
        {...props}
      >
        <p>请提供必填属性 src</p>
      </div>
    );
  }

  // 渲染图片二维码
  return (
    <div 
      style={{ 
        textAlign: resolvedTextAlign, 
        display: "flex",
        justifyContent: resolvedJustifyContent,
        margin: "1rem 0", 
        ...style 
      }} 
      className={className}
      {...props}
    >
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        width: `${size}px`
      }}>
        <img
          src={displaySrc}
          alt={alt}
          style={{
            maxWidth: `${size}px`,
            width: "100%",
            height: "auto",
            borderRadius: `${borderRadius}px`,
            boxShadow: shadow,
          }}
        />
        {QRnumber && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              color: "#666",
              textAlign: "center",
              width: "100%",
            }}
          >
            {QRnumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCode; 