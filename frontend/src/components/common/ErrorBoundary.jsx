import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", padding: "20px",
          fontFamily: "sans-serif", textAlign: "center",
          background: "#f8f9fa", color: "#333"
        }}>
          <div style={{
            background: "white", borderRadius: "12px", padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "400px"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
              काहीतरी चूक झाली
            </h2>
            <p style={{ margin: "0 0 24px", color: "#666", fontSize: "14px" }}>
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              style={{
                padding: "10px 24px", border: "none", borderRadius: "8px",
                background: "#2563eb", color: "white", fontSize: "14px",
                cursor: "pointer", fontWeight: 600
              }}
            >
              पुन्हा प्रयत्न करा (Retry)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
