import React from "react";

const QRGroup = ({
  list,
  children,
  align = "left", // left | center | right
  gap = 16,
  wrap = true,
  style,
  className,
  ...props
}) => {
  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };
  const resolvedJustifyContent = justifyMap[align] || "flex-start";

  const itemsArray = React.useMemo(() => {
    if (Array.isArray(list)) return list;
    if (list) return [list];
    return React.Children.toArray(children);
  }, [list, children]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        justifyContent: resolvedJustifyContent,
        alignItems: "flex-start",
        gap: typeof gap === "number" ? `${gap}px` : gap,
        paddingLeft:
          align === "left"
            ? typeof gap === "number"
              ? `clamp(0px, 4vw, ${gap * 3}px)`
              : `min(4vw, calc(${gap} * 3))`
            : 0,
        margin: "1rem 0",
        ...style,
      }}
      className={className}
      {...props}
    >
      {itemsArray.map((node, index) => (
        <div key={index} style={{ display: "flex" }}>
          {node}
        </div>
      ))}
    </div>
  );
};

export default QRGroup; 