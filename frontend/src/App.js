import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/modern.css";

import LoginPage from "./components/loginpage/LoginPage";
import ForgotPassword from "./components/loginpage/ForgotPassword";
import ResetPassword from "./components/loginpage/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import PaymentHistory from "./pages/PaymentHistory";
import ReportTable from "./components/ReportTable/ReportTable";
import DuePaymentsTable from "./components/admin/DuePaymentsTable";
import PaidPaymentsTable from "./components/admin/PaidPaymentsTable";
import AppLayout from "./components/layout/AppLayout";
import DashboardSelection from "./pages/DashboardSelection";
import DealerDashboard from "./pages/DealerDashboard";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/select-dashboard" element={<ProtectedRoute><DashboardSelection /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminPage /></AppLayout></ProtectedRoute>} />
        <Route path="/pending" element={<ProtectedRoute><AppLayout><DuePaymentsTable /></AppLayout></ProtectedRoute>} />
        <Route path="/completed" element={<ProtectedRoute><AppLayout><PaidPaymentsTable /></AppLayout></ProtectedRoute>} />
        <Route path="/payment-history" element={<ProtectedRoute><AppLayout><PaymentHistory /></AppLayout></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><AppLayout><ReportTable /></AppLayout></ProtectedRoute>} />
        <Route path="/dealer-dashboard" element={<ProtectedRoute><AppLayout><DealerDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/select-dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
