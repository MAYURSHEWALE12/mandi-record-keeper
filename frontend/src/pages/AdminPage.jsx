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

  return (
    <>
      <div className="page-header">
        <h2>अॅडमिन पॅनल</h2>
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
