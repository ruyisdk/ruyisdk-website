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
        "bg-[#0A2C7E] text-white shadow-[0_4px_12px_rgba(10,44,126,0.2)] hover:bg-[#133B9E] hover:shadow-[0_6px_16px_rgba(10,44,126,0.28)] dark:bg-[#2563eb] dark:hover:bg-[#3b82f6]",
      disabled: "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500",
    },
    secondary: {
      enabled:
        "bg-white text-[#0A2C7E] ring-1 ring-inset ring-[#0A2C7E]/20 shadow-xs hover:bg-[#eef4ff] dark:bg-[#232c3d] dark:text-slate-100 dark:ring-white/15 dark:hover:bg-[#2d384d]",
      disabled: "bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500",
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
