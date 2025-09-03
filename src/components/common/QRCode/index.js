import React from "react";
import { QRCode as AntdQRCode } from "antd";

const QRCode = ({ 
  src, // 必填：图片路径
  alt = "QR Code",
  size = 120, // 默认 120
  borderRadius = 10,
  shadow = "0 2px 8px rgba(0,0,0,0.08)",
  QRnumber = null, // 可选：二维码下方的号码信息
  style,
  className,
  location = "left", // 可选：left | center | right
  ...props 
}) => {
  const textAlignMap = { left: "left", center: "center", right: "right" };
  const resolvedTextAlign = textAlignMap[location] || "left";
  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };
  const resolvedJustifyContent = justifyMap[location] || "flex-start";

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
          src={src}
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