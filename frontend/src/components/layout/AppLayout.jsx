import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Wallet, CheckCircle, LogOut, UserCog, BarChart3, Truck, ArrowLeftRight, Menu, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  const isDealerPortal = location.pathname.startsWith("/dealer");
  const navItems = isDealerPortal ? dealerNavItems : farmerNavItems;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button onClick={toggleSidebar} className="hamburger-btn">
          <Menu size={24} />
        </button>
        <span className="mobile-brand-title">के.टी. ट्रेडर्स</span>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <h1>के.टी. ट्रेडर्स</h1>
            <p>{isDealerPortal ? "लॉजिस्टिक्स & डीलर" : "धान्य खरेदी विक्री"}</p>
          </div>
          <button onClick={closeSidebar} className="sidebar-close-btn">
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                closeSidebar();
              }}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}

          {/* Switch Portal Button */}
          <button
            onClick={() => {
              navigate("/select-dashboard");
              closeSidebar();
            }}
            className="sidebar-link"
            style={{ marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", borderRadius: 0, width: "100%" }}
          >
            <ArrowLeftRight size={20} />
            <span>पोर्टल बदला</span>
          </button>

          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="sidebar-link logout"
          >
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
