import React, { useState, useEffect } from "react";
import axios from "axios";
import PageWrapper from "../layout/PageWrapper";
import API_URL from "../../config";
import CustomDropdown from "../common/CustomDropdown";

const PaidPaymentsTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  const [filterDate, setFilterDate] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // 🟢 १. डेटाबेस मधून सर्व रेकॉर्ड्स मिळवणे
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/records`);
        setRecords(response.data);
        setLoading(false);
      } catch (err) {
        console.error("डेटा लोड झाला नाही:", err);
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // 🟢 २. फिल्टर: फक्त पूर्ण झालेले (Paid) व्यवहार
  const paidRecordsOnly = (records || []).filter((rec) => {
    const isPaid = (Number(rec.totalAmount) - Number(rec.paidAmount)) === 0;
    const matchName = rec.farmerName.toLowerCase().includes(searchName.toLowerCase());
    const matchCrop = filterCrop ? rec.crop === filterCrop : true;
    const matchDate = filterDate ? rec.date === filterDate : true; 
    
    return isPaid && matchName && matchCrop && matchDate;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = paidRecordsOnly.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(paidRecordsOnly.length / recordsPerPage);

  if (loading) {
    return (
      <PageWrapper title="पूर्ण पेमेंट">
        <div className="card">
          <div className="filters" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div className="skeleton-shimmer" style={{ height: "38px", width: "200px", borderRadius: "8px" }}></div>
            <div className="skeleton-shimmer" style={{ height: "38px", width: "160px", borderRadius: "8px" }}></div>
            <div className="skeleton-shimmer" style={{ height: "38px", width: "160px", borderRadius: "8px" }}></div>
          </div>
          <div className="table-responsive">
            <table className="skeleton-table">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0 }}></div></th>
                  <th style={{ width: "25%" }}><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0 }}></div></th>
                  <th style={{ width: "15%" }}><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0 }}></div></th>
                  <th style={{ width: "15%" }}><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0 }}></div></th>
                  <th style={{ width: "25%" }}><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0 }}></div></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "80%" }}></div></td>
                    <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "90%" }}></div></td>
                    <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "60%" }}></div></td>
                    <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "70%" }}></div></td>
                    <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "85%" }}></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`पूर्ण पेमेंट (एकूण: ${paidRecordsOnly.length})`}>
      <div className="card">

      <div className="filters">
        <input className="filter-input" placeholder="शेतकऱ्याचे नाव शोधा" value={searchName} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
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

      <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
        <table className="records-table" style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--accent-bg)' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>तारीख</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>शेतकरी</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>मोबाइल</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>पिक</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>एकूण रक्कम</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>दिलेली रक्कम</th>
              <th style={{ padding: '12px', borderBottom: '2px solid var(--border)' }}>स्थिती</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? currentRecords.map((rec) => {
              return (
                <tr key={rec.id || rec._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td data-label="तारीख" style={{ padding: '10px' }}>{rec.date}</td>
                  <td data-label="शेतकरी" style={{ textAlign: 'left', padding: '10px', fontWeight: 'bold' }}>
                    {rec.farmerName}
                  </td>
                  <td data-label="मोबाइल">{rec.mobile}</td>
                  <td data-label="पिक">{rec.crop}</td>
                  <td data-label="एकूण">₹{rec.totalAmount}</td>
                  <td data-label="दिलेली">₹{rec.paidAmount}</td>
                  <td data-label="स्थिती" style={{ color: "green", fontWeight: "bold" }}>● पूर्ण भरले</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" style={{ padding: '20px' }}>कोणतीही पूर्ण झालेले व्यवहार सापडले नाहीत.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 पेज नेव्हिगेशन (◀ पाने 1 / 1 ▶) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '20px', fontSize: '18px' }}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '20px', color: currentPage === 1 ? '#ccc' : '#2e7d32' }}
        >
          ◀
        </button>
        <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>
          पाने {currentPage} / {totalPages || 1}
        </span>
        <button 
          disabled={currentPage >= totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{ background: 'none', border: 'none', cursor: currentPage >= totalPages ? 'default' : 'pointer', fontSize: '20px', color: currentPage >= totalPages ? '#ccc' : '#2e7d32' }}
        >
          ▶
        </button>
      </div>
    </div>
    </PageWrapper>
  );
};

export default PaidPaymentsTable;