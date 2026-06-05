import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BUSINESS_INFO from "../../constants";
import { User, Lock, Eye, EyeOff, ArrowRight, Sun, Moon, Phone, Shield, Award, Users, Truck } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [rememberMe, setRememberMe] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/select-dashboard");
    } catch (err) {
      toast.error("❌ Invalid Email or Password");
    }
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
              <p className="help-phone">{BUSINESS_INFO.supportPhone}</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Form Card & Controls */}
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

          <div className="glass-login-card">
            <div className="card-brand-badge">
              <span className="badge-corn">🌽</span>
              <span className="badge-logo-text">KT</span>
            </div>

            <h3 className="welcome-heading">Welcome to</h3>
            <h2 className="company-heading">KT Traders</h2>
            
            <div className="portal-subheading-wrap">
              <div className="subheading-line"></div>
              <span className="portal-subheading">Dealer Portal</span>
              <div className="subheading-line"></div>
            </div>

            <p className="secure-access-text">Secure access for authorized dealers and distributors.</p>

            <form className="glass-login-form" onSubmit={handleLogin}>
              <div className="glass-input-group">
                <User className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="Dealer ID / Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="glass-input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="form-options-row">
                <label className="remember-me-checkbox">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <span className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="glass-submit-btn">
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="continue-divider">
              <span className="divider-line"></span>
              <span className="divider-text">or continue with</span>
              <span className="divider-line"></span>
            </div>

            <div className="shield-icon-container">
              <div className="shield-badge">
                <Shield size={20} />
              </div>
            </div>
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

export default LoginPage;
