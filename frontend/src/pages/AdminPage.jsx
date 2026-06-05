import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import StatsCards from "../components/admin/StatsCards";
import DayStatsCards from "../components/admin/DayStatsCards";
import AddRecordForm from "../components/admin/AddRecordForm";
import RecordsTable from "../components/admin/RecordsTable";
import API_URL from "../config";

const AdminPage = () => {
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    if (location.state && location.state.editRecord) {
      setEditingRecord(location.state.editRecord);
      // Clear navigation state so a reload doesn't trigger edit mode again
      window.history.replaceState({}, document.title);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/records`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleRecordAdded = () => {
    fetchRecords();
    setEditingRecord(null);
  };

  const handleEditClick = (rec) => {
    setEditingRecord(rec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDatabase = async () => {
    const confirmReset = window.confirm("⚠️ तुम्हाला खात्री आहे का की तुम्हाला सर्व शेतकरी रेकॉर्ड्स आणि डीलर ऑर्डर्स डिलीट करायचे आहेत? हा बदल बदलता येणार नाही!");
    if (!confirmReset) return;
    
    const password = window.prompt("कृपया सुरक्षितता पासवर्ड प्रविष्ट करा (Enter admin password):");
    if (!password) return;

    try {
      const res = await fetch(`${API_URL}/api/reset-database-kt-traders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("डेटाबेस यशस्वीरित्या रिसेट झाला! ✅");
        fetchRecords();
      } else {
        alert(`रिसेट अयशस्वी: ${data.error || "चूक झाली"}`);
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  return (
    <>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <h2>अॅडमिन पॅनल</h2>
        <button 
          onClick={handleResetDatabase}
          className="glass-submit-btn" 
          style={{ width: "auto", padding: "10px 20px", background: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)", color: "#fff", boxShadow: "0 4px 15px rgba(198, 40, 40, 0.25)" }}
        >
          🗑️ डेटा रिसेट करा (Reset Data)
        </button>
      </div>
      <div className="page-body">
        <StatsCards records={records} />
        <DayStatsCards records={records} />
        <AddRecordForm
          onRecordAdded={handleRecordAdded}
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
        />
        <RecordsTable
          records={records}
          onEditClick={handleEditClick}
        />
      </div>
    </>
  );
};

export default AdminPage;
