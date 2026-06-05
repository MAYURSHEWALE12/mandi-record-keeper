import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon, Phone, Award, Users, Truck, ArrowRight } from "lucide-react";
import "../components/loginpage/LoginPage.css";

const DashboardSelection = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  const toggleTheme = (theme) => {
    if (theme === "dark") {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    } else {
      setIsDark(false);
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="login-container-wrapper"
      style={{
        background: `url(${process.env.PUBLIC_URL + "/maharashtra-corn-field.png"}) center/cover no-repeat`
      }}
    >
      <div className="login-split-layout">
        {/* LEFT PANEL: Branding & Info */}
        <div className="login-left-pane">
          <div className="left-brand">
            <div className="brand-logo-wrap">
              <span className="logo-icon-corn">🌽</span>
              <div className="brand-text">
                <span className="kt-text">KT</span>
                <span className="traders-text">TRADERS</span>
              </div>
            </div>
            <p className="brand-tagline">Connecting Dealers. Growing Together.</p>
          </div>

          <div className="left-hero-text">
            <h2>Premium Quality Corn.<br />Stronger Relationships.<br />Sustainable Growth.</h2>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <Award size={20} />
              </div>
              <div className="feature-info">
                <h4>Quality Assured</h4>
                <p>Best quality corn sourced from trusted farms.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <Users size={20} />
              </div>
              <div className="feature-info">
                <h4>Dealer First</h4>
                <p>Dedicated support and exclusive benefits for our dealers.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <Truck size={20} />
              </div>
              <div className="feature-info">
                <h4>Timely Delivery</h4>
                <p>Reliable logistics ensuring on-time delivery.</p>
              </div>
            </div>
          </div>

          <div className="help-widget">
            <Phone className="help-icon" size={20} />
            <div className="help-info">
              <p className="help-title">Need Help?</p>
              <p className="help-desc">Our support team is here for you.</p>
              <p className="help-phone">+91 98502 92298</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Selection Options & Controls */}
        <div className="login-right-pane">
          {/* Top-Right Theme Toggle Switcher */}
          <div className="top-theme-toggle">
            <div className="theme-toggle-pill">
              <button 
                className={`theme-pill-btn ${!isDark ? "active" : ""}`}
                onClick={() => toggleTheme("light")}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
              <button 
                className={`theme-pill-btn ${isDark ? "active" : ""}`}
                onClick={() => toggleTheme("dark")}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="glass-login-card select-portal-card" style={{ maxWidth: "520px" }}>
            <div className="card-brand-badge">
              <span className="badge-corn">🌽</span>
              <span className="badge-logo-text">KT</span>
            </div>

            <h3 className="welcome-heading">Welcome to</h3>
            <h2 className="company-heading">KT Traders</h2>
            
            <div className="portal-subheading-wrap">
              <div className="subheading-line"></div>
              <span className="portal-subheading">Select Portal</span>
              <div className="subheading-line"></div>
            </div>

            <p className="secure-access-text">Select the portal dashboard you wish to access.</p>

            <div className="portal-selection-buttons-wrap" style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "20px 0 28px" }}>
              {/* Option 1: Farmer portal */}
              <button 
                onClick={() => navigate("/dashboard")}
                className="glass-selection-btn"
              >
                <div className="btn-portal-content">
                  <span className="btn-portal-emoji">🌾</span>
                  <div className="btn-portal-text-wrap">
                    <h4>शेतकरी खाते (मंडी रेकॉर्ड्स)</h4>
                    <p>बिल पावती, आवक/जावक, पेमेंट हिशोब</p>
                  </div>
                </div>
                <ArrowRight size={18} className="btn-arrow" />
              </button>

              {/* Option 2: Dealer portal */}
              <button 
                onClick={() => navigate("/dealer-dashboard")}
                className="glass-selection-btn"
              >
                <div className="btn-portal-content">
                  <span className="btn-portal-emoji">🚚</span>
                  <div className="btn-portal-text-wrap">
                    <h4>डीलर ऑर्डर & ट्रक लोडिंग</h4>
                    <p>कंपनी P.O., ट्रक नोंदी, ट्रान्सपोर्ट भाडे</p>
                  </div>
                </div>
                <ArrowRight size={18} className="btn-arrow" />
              </button>
            </div>

            <button 
              onClick={handleLogout} 
              className="glass-submit-btn logout-btn-selection"
              style={{ background: "transparent", border: "1px solid var(--red)", color: "var(--red)", boxShadow: "none" }}
            >
              <LogOut size={16} />
              <span>लॉगआउट (Logout)</span>
            </button>
          </div>

          {/* Global Footer */}
          <footer className="login-footer">
            <p className="footer-copyright">© 2026 KT Traders. All Rights Reserved.</p>
            <div className="footer-links">
              <span>Privacy Policy</span>
              <span className="divider">|</span>
              <span>Terms & Conditions</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardSelection;
