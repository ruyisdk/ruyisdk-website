import React from "react";
import { QRCode as AntdQRCode } from "antd";

const QRCode = ({ 
  src, // 图片路径
  value, // 二维码内容（用于动态生成）
  alt = "QR Code",
  size = 140,
  borderRadius = 10,
  shadow = "0 2px 8px rgba(0,0,0,0.08)",
  QRnumber = null, // 二维码下方的号码信息
  style,
  className,
  location = "left",
  ...props 
}) => {
  const textAlignMap = { left: "left", center: "center", right: "right" };
  const resolvedTextAlign = textAlignMap[location] || "left";
  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };
  const resolvedJustifyContent = justifyMap[location] || "flex-start";
  // 如果提供了src，使用图片
  if (src) {
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
  }

  // 如果提供了value，使用动态生成的二维码
  if (value) {
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
          <div
            style={{
              display: "inline-block",
              padding: "8px",
              borderRadius: `${borderRadius}px`,
              boxShadow: shadow,
              backgroundColor: "white",
            }}
          >
            <AntdQRCode 
              value={value} 
              size={size - 16} // 减去padding
              style={{
                borderRadius: `${borderRadius - 4}px`,
              }}
            />
          </div>
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
  }

  // 如果既没有src也没有value，显示错误信息
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
      <p>请提供 src 或 value 属性</p>
    </div>
  );
};

export default QRCode; 