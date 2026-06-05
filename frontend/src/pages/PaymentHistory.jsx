import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import API_URL from "../config";
import { ArrowLeft, Printer, Phone, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

// Inline styles for the Flat Organic Theme
const historyStyles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "10px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  actionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  btnBack: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #c4beb4",
    borderRadius: "8px",
    color: "#4e653c",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  btnPrint: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#4e653c",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  profileCard: {
    background: "#fff",
    border: "1px solid #e6e1d8",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
  },
  avatarCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#f0ede4",
    color: "#4e653c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  farmerName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#2b2f2a",
    letterSpacing: "-0.3px",
  },
  subTitle: {
    margin: "2px 0 0 0",
    fontSize: "12.5px",
    color: "#828b7e",
    fontWeight: "500",
  },
  phoneBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#f7f5ef",
    border: "1px solid #e6e1d8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#4e653c",
    marginLeft: "auto",
  },
  recordCard: {
    background: "#fff",
    border: "1px solid #e6e1d8",
    borderRadius: "12px",
    marginBottom: "24px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
  },
  cardHeader: {
    background: "#fdfcf9",
    borderBottom: "1px dashed #e6e1d8",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billNoText: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#828b7e",
  },
  dateText: {
    fontSize: "13px",
    color: "#828b7e",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  gridInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr) auto",
    padding: "16px 20px",
    gap: "16px",
    alignItems: "center",
    borderBottom: "1px solid #f7f5ef",
  },
  infoCol: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "10.5px",
    fontWeight: "700",
    color: "#828b7e",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: "#2b2f2a",
  },
  totalBillBadge: {
    background: "#e8f5e9",
    border: "1px solid #c8e6c9",
    padding: "8px 14px",
    borderRadius: "8px",
    textAlign: "right",
  },
  totalBillText: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#2e7d32",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr",
    background: "#faf8f5",
    padding: "10px 20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#828b7e",
    borderBottom: "1px solid #e6e1d8",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr",
    padding: "12px 20px",
    fontSize: "13.5px",
    borderBottom: "1px solid #f7f5ef",
    alignItems: "center",
  },
  amountPaid: {
    fontWeight: "700",
    color: "#2e7d32",
  },
  amountDue: {
    fontWeight: "700",
    color: "#c94a4a",
  },
  badgeFullPaid: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
  },
  cardFooter: {
    background: "#faf8f5",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e6e1d8",
  },
  footerStatusPaid: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#2e7d32",
    fontWeight: "700",
    fontSize: "13.5px",
  },
  footerStatusPending: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#c94a4a",
    fontWeight: "700",
    fontSize: "13.5px",
  }
};

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const farmerName = queryParams.get("farmer")?.trim() || queryParams.get("name")?.trim();
  const mobileNumber = queryParams.get("mobile")?.trim() || "";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/records`);
        const allRecords = await response.json();
        const filtered = allRecords.filter(
          (rec) => rec.farmerName?.trim().toLowerCase() === farmerName?.toLowerCase() ||
                   rec.farmerName?.trim() === farmerName?.trim()
        );
        setHistory(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    if (farmerName) fetchHistory();
    else setLoading(false);
  }, [farmerName]);

  const handleDownload = () => window.print();

  const handleBackToAdmin = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/admin");
  };

  if (loading) {
    return (
      <PageWrapper title="पेमेंट हिस्ट्री">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <div className="skeleton-line title skeleton-shimmer" style={{ width: "200px", margin: 0 }}></div>
            <div className="skeleton-shimmer" style={{ height: "36px", width: "120px", borderRadius: "8px" }}></div>
          </div>
          
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div className="skeleton-card" style={{ padding: "15px", border: "1px dashed var(--border)" }}>
                <div className="skeleton-line subtitle skeleton-shimmer"></div>
                <div className="skeleton-line title skeleton-shimmer" style={{ width: "80%" }}></div>
              </div>
              <div className="skeleton-card" style={{ padding: "15px", border: "1px dashed var(--border)" }}>
                <div className="skeleton-line subtitle skeleton-shimmer"></div>
                <div className="skeleton-line title skeleton-shimmer" style={{ width: "80%" }}></div>
              </div>
              <div className="skeleton-card" style={{ padding: "15px", border: "1px dashed var(--border)" }}>
                <div className="skeleton-line subtitle skeleton-shimmer"></div>
                <div className="skeleton-line title skeleton-shimmer" style={{ width: "80%" }}></div>
              </div>
            </div>
            
            <div className="table-responsive" style={{ marginTop: "20px" }}>
              <table className="skeleton-table">
                <thead>
                  <tr>
                    <th><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0, width: "60px" }}></div></th>
                    <th><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0, width: "120px" }}></div></th>
                    <th><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0, width: "80px" }}></div></th>
                    <th><div className="skeleton-line subtitle skeleton-shimmer" style={{ margin: 0, width: "80px" }}></div></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "50px" }}></div></td>
                      <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "100px" }}></div></td>
                      <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "70px" }}></div></td>
                      <td><div className="skeleton-line text skeleton-shimmer" style={{ width: "60px" }}></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const displayBillNo =
    history.length > 0 ? history[history.length - 1].billNo || "---" : "---";

  return (
    <PageWrapper title={`${farmerName || "शेतकरी"} - पेमेंट हिस्ट्री`}>
      <div style={historyStyles.container}>
        
        {/* Actions header */}
        <div className="no-print" style={historyStyles.actionHeader}>
          <button onClick={handleBackToAdmin} style={historyStyles.btnBack}>
            <ArrowLeft size={16} /> मागे जा
          </button>
          <button onClick={handleDownload} style={historyStyles.btnPrint}>
            <Printer size={16} /> प्रिंट / PDF
          </button>
        </div>

        {/* Profile Details */}
        <div style={historyStyles.profileCard}>
          <div style={historyStyles.avatarCircle}>👤</div>
          <div>
            <div style={historyStyles.subTitle}>बिल क्रमांक: No. {displayBillNo}</div>
            <h1 style={historyStyles.farmerName}>{farmerName}</h1>
            <p style={historyStyles.subTitle}>खातेदार पेमेंट इतिहास (Farmer Payment Ledger)</p>
          </div>
          {mobileNumber && (
            <div style={historyStyles.phoneBadge}>
              <Phone size={14} /> {mobileNumber}
            </div>
          )}
        </div>

        {/* Payment History Lists */}
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#fff", border: "1px solid #e6e1d8", borderRadius: "12px", color: "#828b7e" }}>
            या खातेदारासाठी कोणतेही पेमेंट रेकॉर्ड सापडले नाही.
          </div>
        ) : (
          history.map((rec, index) => {
            const currentRemaining = Number(rec.totalAmount || 0) - Number(rec.paidAmount || 0);

            // Dynamically calculate the remaining balance after each payment
            let runningPaid = 0;
            const paymentsList = rec.payments && rec.payments.length > 0
              ? rec.payments
              : [{ date: rec.date, amount: rec.paidAmount }];

            const paymentsWithRemaining = paymentsList.map((p) => {
              runningPaid += Number(p.amount || 0);
              const remaining = Number(rec.totalAmount || 0) - runningPaid;
              return {
                ...p,
                remaining: remaining >= 0 ? remaining : 0
              };
            });

            return (
              <div key={rec.id || rec._id || index} style={historyStyles.recordCard}>
                
                {/* Card Header */}
                <div style={historyStyles.cardHeader}>
                  <span style={historyStyles.billNoText}>बिल क्रमांक: {rec.billNo || "N/A"}</span>
                  <span style={historyStyles.dateText}>
                    <Calendar size={14} /> {rec.date}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={historyStyles.gridInfo}>
                  <div style={historyStyles.infoCol}>
                    <span style={historyStyles.infoLabel}>पिक</span>
                    <span style={historyStyles.infoValue}>{rec.crop || "माहिती नाही"}</span>
                  </div>
                  <div style={historyStyles.infoCol}>
                    <span style={historyStyles.infoLabel}>प्रमाण</span>
                    <span style={historyStyles.infoValue}>{rec.quantity ? `${rec.quantity} क्विंटल` : "---"}</span>
                  </div>
                  <div style={historyStyles.infoCol}>
                    <span style={historyStyles.infoLabel}>दर</span>
                    <span style={historyStyles.infoValue}>{rec.rate ? `₹${rec.rate}` : "₹0"}</span>
                  </div>
                  <div style={historyStyles.totalBillBadge}>
                    <span style={historyStyles.infoLabel}>एकूण बिल</span>
                    <div style={historyStyles.totalBillText}>₹{rec.totalAmount}</div>
                  </div>
                </div>

                {/* Payments Table */}
                <div>
                  <div style={historyStyles.tableHeader}>
                    <div>पेमेंट तारीख</div>
                    <div>जमा रक्कम</div>
                    <div style={{ textAlign: "right" }}>बाकी</div>
                  </div>

                  {paymentsWithRemaining.map((p, idx) => (
                    <div key={idx} style={historyStyles.tableRow}>
                      <div>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : p.date}</div>
                      <div style={historyStyles.amountPaid}>+ ₹{p.amount}</div>
                      <div style={{ textAlign: "right" }}>
                        {p.remaining <= 0 ? (
                          <span style={historyStyles.badgeFullPaid}>पूर्ण</span>
                        ) : (
                          <span style={historyStyles.amountDue}>₹{p.remaining}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer status info */}
                <div style={historyStyles.cardFooter}>
                  <span style={{ fontSize: "12.5px", color: "#828b7e" }}>
                    तपशील: {rec.crop || "धान्य"} खरेदी व्यवहार
                  </span>
                  <div>
                    {currentRemaining <= 0 ? (
                      <span style={historyStyles.footerStatusPaid}>
                        <CheckCircle2 size={16} /> हिशोब चुकता (Paid)
                      </span>
                    ) : (
                      <span style={historyStyles.footerStatusPending}>
                        <AlertCircle size={16} /> बाकी: ₹{currentRemaining}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </PageWrapper>
  );
};

export default PaymentHistory;
