import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const DashboardSelection = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="dashboard-selection-wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'Poppins', 'Mukta', sans-serif",
        padding: "20px",
        transition: "background 0.25s ease",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 10px 0" }}>
          के.टी. ट्रेडर्स
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-muted)", margin: 0 }}>
          धान्य व्यापार व लॉजिस्टिक्स मॅनेजमेंट सिस्टीम
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "24px",
          width: "100%",
          maxWidth: "700px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* CARD 1: FARMER RECORDS */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            flex: "1 1 300px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "30px",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
            transition: "transform 150ms ease, border-color 150ms ease, background 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🌾</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>
            शेतकरी खाते (मंडी रेकॉर्ड्स)
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            बिल पावती तयार करणे, आवक/जावक नोंदणी, पिकांचे भाव, शेतकरी पेमेंट व बाकी रक्कम व्यवस्थापन.
          </p>
        </div>

        {/* CARD 2: DEALER DISPATCHES */}
        <div
          onClick={() => navigate("/dealer-dashboard")}
          style={{
            flex: "1 1 300px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "30px",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
            transition: "transform 150ms ease, border-color 150ms ease, background 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🚚</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>
            डीलर ऑर्डर & ट्रक लोडिंग
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            कंपन्यांच्या बल्क ऑर्डर्स (P.O.), ट्रक निहाय लोडिंग नोंदी, ड्रायव्हर/ट्रान्सपोर्ट तपशील व एकूण भाडे हिशोब.
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          background: "transparent",
          border: "1px solid var(--border)",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--red)",
          fontWeight: "600",
          fontSize: "14px",
          transition: "background 150ms ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--red-bg)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <LogOut size={16} />
        <span>लॉगआउट (Logout)</span>
      </button>
    </div>
  );
};

export default DashboardSelection;
