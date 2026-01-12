import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const farmerName = queryParams.get("name")?.trim();
  const mobileNumber = queryParams.get("mobile")?.trim() || "";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5001/records");
        const allRecords = await response.json();
        const filtered = allRecords.filter(
          (rec) => rec.farmerName?.trim().toLowerCase() === farmerName?.toLowerCase()
        );
        setHistory(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    if (farmerName) fetchHistory();
  }, [farmerName]);

  const handleDownload = () => {
    window.print();
  };

  const handleBackToAdmin = () => {
    navigate("/admin");
  };

  if (loading) return (
    <div style={styles.centerWrapper}>
      <div style={styles.spinner}></div>
    </div>
  );

  return (
    <div style={styles.screenWrapper}>
      <div style={styles.container}>
        
        {/* Buttons */}
        <div className="no-print" style={styles.actionButtons}>
          <button onClick={handleBackToAdmin} style={styles.backBtn}>⬅ मागे जा</button>
          <button onClick={handleDownload} style={styles.downloadBtn}>प्रिंट / PDF 📥</button>
        </div>

        {/* Farmer Profile */}
        <div style={styles.profileCard}>
            <div style={styles.profileIcon}>👤</div>
            <div style={{flex: 1}}>
                <h1 style={styles.farmerTitle}>{farmerName}</h1>
                <p style={{margin:0, color:'#64748b'}}>खातेदार पेमेंट इतिहास</p>
            </div>
            {mobileNumber && <div style={styles.contactBadge}>📞 {mobileNumber}</div>}
        </div>

        {history.length === 0 ? (
          <div style={styles.noDataCard}>रेकॉर्ड सापडले नाही.</div>
        ) : (
          history.map((rec, index) => {
            const currentRemaining = rec.totalAmount - rec.paidAmount;
            return (
              <div key={rec._id || index} style={styles.mainCard}>
                
                {/* Top Info Bar */}
                <div style={styles.cropInfoBar}>
                    <div style={styles.infoBox}>
                        <label style={styles.infoLabel}>पिक</label>
                        <span style={styles.infoValue}>{rec.crop || "-"}</span>
                    </div>
                    <div style={styles.infoBox}>
                        <label style={styles.infoLabel}>प्रमाण</label>
                        <span style={styles.infoValue}>{rec.quantity || "-"}</span>
                    </div>
                    <div style={styles.infoBox}>
                        <label style={styles.infoLabel}>दर</label>
                        <span style={styles.infoValue}>₹{rec.rate || "0"}</span>
                    </div>
                    <div style={styles.totalBadge}>
                        <label style={{fontSize:'11px', opacity:0.8}}>एकूण बिल</label>
                        <span style={{fontSize:'20px', fontWeight: '800'}}>₹{rec.totalAmount}</span>
                    </div>
                </div>

                {/* Table Header - Grid Fix */}
                <div style={styles.tableWrapper}>
                  <div style={styles.tableHeaderGrid}>
                    <div style={styles.gridHeaderItem}>पेमेंट तारीख</div>
                    <div style={styles.gridHeaderItem}>जमा रक्कम</div>
                    <div style={{...styles.gridHeaderItem, textAlign: 'right'}}>बाकी</div>
                  </div>

                  {/* Table Body - Grid Fix */}
                  {rec.payments && rec.payments.length > 0 ? (
                    rec.payments.map((p, i) => (
                      <div key={i} style={styles.tableRowGrid}>
                        <div style={styles.gridBodyItem}>{p.date}</div>
                        <div style={styles.gridBodyItemAmount}>+ ₹{p.amount}</div>
                        <div style={{...styles.gridBodyItem, textAlign: 'right'}}>
                          {p.remaining <= 0 ? (
                            <span style={styles.successBadge}>पूर्ण</span>
                          ) : (
                            <span style={styles.dangerText}>₹{p.remaining}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.tableRowGrid}>
                      <div style={styles.gridBodyItem}>{rec.date}</div>
                      <div style={styles.gridBodyItemAmount}>+ ₹{rec.paidAmount}</div>
                      <div style={{...styles.gridBodyItem, textAlign: 'right'}}>
                        {currentRemaining <= 0 ? <span style={styles.successBadge}>पूर्ण</span> : <span style={styles.dangerText}>₹{currentRemaining}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div style={styles.footerBar}>
                    <div style={{fontSize: '13px', color: '#94a3b8'}}>तारीख: {rec.date}</div>
                    <div style={currentRemaining <= 0 ? styles.statusPaid : styles.statusPending}>
                        {currentRemaining <= 0 ? "✅ हिशोब चुकता" : `बाकी: ₹${currentRemaining}`}
                    </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  screenWrapper: { display: 'flex', justifyContent: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '30px 10px' },
  centerWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' },
  container: { width: "100%", maxWidth: "800px", fontFamily: "sans-serif" },
  spinner: { width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #10b981', borderRadius: '50%' },
  
  actionButtons: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' },
  backBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: '600' },
  downloadBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', cursor: 'pointer', fontWeight: '600' },

  profileCard: { background: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', border: '1px solid #e2e8f0' },
  profileIcon: { width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  farmerTitle: { margin: 0, fontSize: '24px', color: '#1e293b' },
  contactBadge: { background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },

  mainCard: { background: '#fff', borderRadius: '12px', marginBottom: '30px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cropInfoBar: { display: 'flex', padding: '20px', background: '#fff', borderBottom: '1px solid #f1f5f9', justifyContent: 'space-between', alignItems: 'center' },
  infoBox: { display: 'flex', flexDirection: 'column' },
  infoLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  infoValue: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  totalBadge: { background: '#10b981', color: '#fff', padding: '10px 15px', borderRadius: '10px', textAlign: 'center' },

  tableWrapper: { padding: '10px 0' },
  tableHeaderGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', background: '#f8fafc', padding: '12px 20px', borderBottom: '2px solid #e2e8f0' },
  tableRowGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', padding: '15px 20px', borderBottom: '1px solid #f1f5f9' },
  
  gridHeaderItem: { color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  gridBodyItem: { color: '#475569', fontSize: '15px', fontWeight: '500' },
  gridBodyItemAmount: { color: '#059669', fontSize: '15px', fontWeight: '700' },

  successBadge: { background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '700' },
  dangerText: { color: '#ef4444', fontWeight: '700' },
  
  footerBar: { padding: '15px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusPaid: { color: '#10b981', fontWeight: '700' },
  statusPending: { color: '#ef4444', fontWeight: '700' },
  noDataCard: { textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', color: '#94a3b8' }
};

export default PaymentHistory;