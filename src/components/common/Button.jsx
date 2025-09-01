import React from "react";

const Button = ({
  disabled = false,
  variant = "primary",
  size = "md",
  onClick,
  children,
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3",
    lg: "px-6 py-4 text-lg",
  };

  const variantClasses = {
    primary: {
      enabled:
        "bg-amber-400 text-white hover:bg-amber-500 hover:shadow-amber hover:shadow-[0_0_7px_rgba(245,158,11,0.5)]",
      disabled: "bg-gray-200 text-gray-500",
    },
    secondary: {
      enabled:
        "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-[0_0_7px_rgba(156,163,175,0.4)]",
      disabled: "bg-gray-100 text-gray-400",
    },
  };

  return (
    <button
      disabled={disabled}
      className={`cursor-pointer rounded-full border-none font-medium transition
        disabled:cursor-not-allowed disabled:opacity-40 ${sizeClasses[size]} ${
          disabled
            ? variantClasses[variant].disabled
            : variantClasses[variant].enabled
        } `}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
