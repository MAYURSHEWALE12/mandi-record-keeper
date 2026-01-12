import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./components/loginpage/LoginPage";
import ForgotPassword from "./components/loginpage/ForgotPassword";
import ResetPassword from "./components/loginpage/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import PaymentHistory from "./pages/PaymentHistory";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-history"
          element={
            <ProtectedRoute>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />

        {/* ❌ Invalid URL → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
