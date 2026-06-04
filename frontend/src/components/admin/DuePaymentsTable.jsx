import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../layout/PageWrapper";
import API_URL from "../../config";
import CustomDropdown from "../common/CustomDropdown";

const DuePaymentsTable = ({ onEditClick }) => {
  const navigate = useNavigate();
  const handleClick = onEditClick || ((rec) => navigate(`/payment-history?farmer=${encodeURIComponent(rec.farmerName)}`));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // डेटा लोड करणे
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/records`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(Array.isArray(response.data) ? response.data : response.data.records || []);
        setLoading(false);
      } catch (error) {
        console.error("डेटा एरर:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // बाकी असलेले रेकॉर्ड्स फिल्टर करणे
  const dueRecordsOnly = records.filter((rec) => {
    const isDue = (Number(rec.totalAmount) - Number(rec.paidAmount)) > 0;
    const matchName = rec.farmerName?.toLowerCase().includes(searchName.toLowerCase());
    const matchCrop = filterCrop ? rec.crop === filterCrop : true;
    const matchDate = filterDate ? rec.date === filterDate : true;
    return isDue && matchName && matchCrop && matchDate;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dueRecordsOnly.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(dueRecordsOnly.length / recordsPerPage);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner-ring"></div>
        <span>डेटा लोड होत आहे...</span>
      </div>
    );
  }

  return (
    <PageWrapper title={`बाकी पेमेंट (एकूण: ${dueRecordsOnly.length})`}>
      <div className="card">

      <div className="filters">
        <input className="filter-input" placeholder="नाव शोधा" value={searchName} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
        <CustomDropdown
          value={filterCrop}
          onChange={(val) => { setFilterCrop(val); setCurrentPage(1); }}
          options={[
            { value: "", label: "सर्व पिके" },
            { value: "मका", label: "मका" },
            { value: "गहू", label: "गहू" },
            { value: "कांदा", label: "कांदा" }
          ]}
          placeholder="सर्व पिके"
          style={{ minWidth: "160px", width: "160px" }}
        />
        <input type="date" className="filter-input" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }} />
      </div>

      <div className="table-responsive">
        <table className="records-table" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>तारीख</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>शेतकरी</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>मोबाइल</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>पिक</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>एकूण</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>दिलेली</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>बाकी</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? currentRecords.map((rec) => {
              const dueAmt = rec.totalAmount - rec.paidAmount;
              return (
                <tr key={rec.id || rec._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td data-label="तारीख" style={{ padding: '10px' }}>{rec.date}</td>
                  <td data-label="शेतकरी" style={{ textAlign: 'left', fontWeight: 'bold', padding: '10px' }}>
                    <button 
                      onClick={() => handleClick(rec)} 
                      style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: '14px', fontWeight: 'bold' }}
                    >
                      {rec.farmerName}
                    </button>
                  </td>
                  <td data-label="मोबाइल">{rec.mobile}</td>
                  <td data-label="पिक">{rec.crop}</td>
                  <td data-label="एकूण">₹{rec.totalAmount}</td>
                  <td data-label="दिलेली">₹{rec.paidAmount}</td>
                  <td data-label="बाकी" style={{ color: "red", fontWeight: "bold" }}>₹{dueAmt.toFixed(2)}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan="7" style={{ padding: '20px' }}>कोणतीही बाकी रक्कम सापडली नाही.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 पेज नेव्हिगेशन (◀ पाने 1 / 2 ▶)Prathmesh Malusare  */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '20px', fontSize: '18px' }}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '20px', color: currentPage === 1 ? '#ccc' : '#2196F3' }}
        >
          ◀
        </button>
        <span style={{ fontWeight: 'bold' }}>
          पाने {currentPage} / {totalPages || 1}
        </span>
        <button 
          disabled={currentPage >= totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{ background: 'none', border: 'none', cursor: currentPage >= totalPages ? 'default' : 'pointer', fontSize: '20px', color: currentPage >= totalPages ? '#ccc' : '#2196F3' }}
        >
          ▶
        </button>
      </div>
    </div>
    </PageWrapper>
  );
};

export default DuePaymentsTable;