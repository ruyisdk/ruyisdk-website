import React from "react";
import { QRCode } from "@site/src/components/common";

const WeChatQRCode = ({ 
  src = "/img/wechat_account_img.png", 
  alt = "Our WeChat account",
  size = 140,
  borderRadius = 10,
  shadow = "0 2px 8px rgba(0,0,0,0.08)",
  style,
  ...props 
}) => {
  return (
    <QRCode
      src={src}
      alt={alt}
      size={size}
      borderRadius={borderRadius}
      shadow={shadow}
      style={style}
      {...props}
    />
  );
};

export default WeChatQRCode;