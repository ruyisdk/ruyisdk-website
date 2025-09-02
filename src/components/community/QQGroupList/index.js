import React from "react";
import { QRCode } from "@site/src/components/common";
import { translate } from "@docusaurus/Translate";

const QQGroupList = () => {
  const qqGroups = [
    {
      title: translate({ id: "QQ1", message: "QQ 1群" }),
      value: "https://qm.qq.com/q/oAWlZnWV3y",
      qqGroupNumber: "544940413",
      isActive: true,
    },
    {
      title: translate({ id: "QQ2", message: "QQ 2群" }),
      value: null,
      qqGroupNumber: null,
      isActive: false,
    },
    {
      title: translate({ id: "QQ3", message: "QQ 3群" }),
      value: null,
      qqGroupNumber: null,
      isActive: false,
    },
    {
      title: translate({ id: "QQ4", message: "QQ 4群" }),
      value: null,
      qqGroupNumber: null,
      isActive: false,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #eee",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {qqGroups.map((group, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "1rem",
            borderRight:
              index !== qqGroups.length - 1 ? "1px solid #eee" : "none",
          }}
        >
          {group.isActive && (
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "#333",
              }}
            >
              {group.title}
            </div>
          )}

          {group.isActive ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "120px", // 固定高度，内容垂直居中
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onClick={() => {
                if (group.value) {
                  window.open(group.value, '_blank');
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              <QRCode 
                value={group.value} 
                size={95}
                style={{
                  margin: 0,
                  padding: 0,
                }}
              />
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                {group.qqGroupNumber}
              </div>
            </div>
          ) : (
            <div style={{ height: "120px" }} /> // 空群占位，保持高度一致
          )}
        </div>
      ))}
    </div>
  );
};

export default QQGroupList;
