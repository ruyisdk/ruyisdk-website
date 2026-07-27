import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for diagnostics
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "24px",
            margin: "16px 0",
            borderRadius: "8px",
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
            color: "#ff4d4f",
            textAlign: "center",
          }}
          role="alert"
        >
          <h3>组件加载暂未完成或发生异常</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>
            请刷新页面重试，或联系系统管理员。
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
