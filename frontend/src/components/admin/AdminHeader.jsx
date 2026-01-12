import React, { useState } from "react"; // useState जोडला आहे
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, CheckCircle } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div style={{ textAlign: "center", padding: "30px 10px 15px 10px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            fontWeight: "900",
            textAlign: "center",
            background: "linear-gradient(to bottom, #1a4a8e, #0d2d5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
            letterSpacing: "1.5px",
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          त्र्यंबकराज ट्रेडर्स
        </h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "8px" }}>
          <div style={{ height: "2px", width: "60px", background: "linear-gradient(to right, transparent, #2196F3)", borderRadius: "2px" }}></div>
          <span style={{ margin: "0 15px", fontSize: "16px", color: "#555", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
            त्र्यंबकराज पेट्रोलियम निमगाव
          </span>
          <div style={{ height: "2px", width: "60px", background: "linear-gradient(to left, transparent, #2196F3)", borderRadius: "2px" }}></div>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          padding: "10px",
          background: "#f8f9fa",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="डॅशबोर्ड" 
          active={location.pathname === "/dashboard"} 
          onClick={() => navigate("/dashboard")} 
        />
        <NavItem 
          icon={<Wallet size={20} />} 
          label="बाकी रक्कम" 
          active={location.pathname === "/pending"} 
          onClick={() => navigate("/pending")} 
        />
        <NavItem 
          icon={<CheckCircle size={20} />} 
          label="पूर्ण रक्कम" 
          active={location.pathname === "/completed"} 
          onClick={() => navigate("/completed")} 
        />
      </nav>
    </>
  );
};

// NavItem कंपोनंटमध्ये Hover लॉजिक
const NavItem = ({ icon, label, active, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "12px",
        cursor: "pointer",
        // Hover किंवा Active असेल तर निळा रंग, अन्यथा पांढरा
        backgroundColor: active || isHovered ? "#2196F3" : "white",
        color: active || isHovered ? "white" : "#333",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: active || isHovered ? "0 4px 10px rgba(33, 150, 243, 0.3)" : "0 2px 5px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        transform: active || isHovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default AdminHeader;