import React from "react";

const WeChatQRCode = ({ 
  src = "/img/wechat_account_img.png", 
  alt = "Our WeChat account",
  maxWidth = 140,
  borderRadius = 10,
  shadow = "0 2px 8px rgba(0,0,0,0.08)",
  style,
  ...props 
}) => {
  return (
    <div style={{ textAlign: "left", margin: "1rem 0 1.5rem 0", ...style }} {...props}>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: `${maxWidth}px`,
          width: "100%",
          height: "auto",
          borderRadius: `${borderRadius}px`,
          boxShadow: shadow,
        }}
      />
    </div>
  );
};

export default WeChatQRCode;