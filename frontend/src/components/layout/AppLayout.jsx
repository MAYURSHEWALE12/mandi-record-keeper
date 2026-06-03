import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Wallet, CheckCircle, LogOut, UserCog, BarChart3, Truck, ArrowLeftRight } from "lucide-react";

const farmerNavItems = [
  { path: "/dashboard", label: "डॅशबोर्ड", icon: LayoutDashboard },
  { path: "/admin", label: "अॅडमिन पॅनल", icon: UserCog },
  { path: "/pending", label: "बाकी रक्कम", icon: Wallet },
  { path: "/completed", label: "पूर्ण रक्कम", icon: CheckCircle },
  { path: "/payment-history", label: "पेमेंट हिस्ट्री", icon: BarChart3 },
  { path: "/report", label: "रिपोर्ट", icon: FileText },
];

const dealerNavItems = [
  { path: "/dealer-dashboard", label: "डीलर डॅशबोर्ड", icon: Truck },
];

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDealerPortal = location.pathname.startsWith("/dealer");
  const navItems = isDealerPortal ? dealerNavItems : farmerNavItems;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>त्र्यंबकराज</h1>
          <p>{isDealerPortal ? "लॉजिस्टिक्स & डीलर" : "धान्य खरेदी विक्री"}</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}

          {/* Switch Portal Button */}
          <button
            onClick={() => navigate("/select-dashboard")}
            className="sidebar-link"
            style={{ marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", borderRadius: 0, width: "100%" }}
          >
            <ArrowLeftRight size={20} />
            <span>पोर्टल बदला</span>
          </button>

          <button onClick={handleLogout} className="sidebar-link logout">
            <LogOut size={20} />
            <span>लॉगआउट</span>
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
