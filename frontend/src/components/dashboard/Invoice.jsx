import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API_URL from "../../config";
import "./dashboard.css";
import InvoiceRecordsTable from "./InvoiceRecordsTable"; 
import CustomDropdown from "../common/CustomDropdown";

const slipStyles = {
  container: {
    width: "100%",
    maxWidth: "500px",
    background: "#fcfbf9",
    border: "1.5px solid #000",
    padding: "24px",
    fontFamily: "sans-serif",
    color: "#000",
    boxSizing: "border-box",
    margin: "0 auto",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "2px solid #000",
    paddingBottom: "10px"
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#8B0000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold"
  },
  titleArea: {
    flex: 1
  },
  mainTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
    color: "#8B0000"
  },
  subTitle: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#555"
  },
  addressLine: {
    fontSize: "9px",
    margin: "4px 0",
    borderBottom: "1px solid #000",
    paddingBottom: "2px",
    color: "#444"
  },
  metaLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
    fontSize: "11px"
  },
  fieldLine: {
    borderBottom: "1px dotted #555",
    paddingBottom: "3px",
    marginBottom: "8px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center"
  },
  fieldLabel: {
    fontWeight: "bold"
  },
  fieldValue: {
    marginLeft: "6px",
    fontWeight: "600",
    color: "#222"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "11px"
  },
  th: {
    border: "1px solid #000",
    padding: "6px",
    background: "#e8e8e8",
    fontWeight: "bold",
    textAlign: "center"
  },
  td: {
    border: "1px solid #000",
    padding: "6px",
    textAlign: "center"
  },
  summaryArea: {
    marginTop: "15px",
    fontSize: "11px"
  },
  balanceText: {
    color: "#C94A4A",
    fontWeight: "bold",
    fontSize: "13px"
  },
  footerSignatures: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "35px",
    fontSize: "11px"
  }
};

// --- DayStatsCards Component ---
const DayStatsCards = ({ records = [], dealerOrders = [] }) => {
  const today = new Date().toISOString().slice(0, 10);

  const todayRecords = records.filter(
    (r) => r.date === today
  );

  const totalRecords = todayRecords.length;

  const totalAmount = todayRecords.reduce(
    (sum, r) => sum + Number(r.totalAmount || 0),
    0
  );

  const totalPaid = todayRecords.reduce(
    (sum, r) => sum + Number(r.paidAmount || 0),
    0
  );

  const totalDue = totalAmount - totalPaid;

  // Calculate available stock (1 Ton = 10 Quintals)
  const totalInwardTons = records.reduce((sum, r) => {
    const isMakka = r.crop === "मका" || (r.commodity && r.commodity.includes("मका"));
    if (isMakka) {
      return sum + Number(r.weight || r.quantity || 0) / 10;
    }
    return sum;
  }, 0);

  const totalOutwardTons = dealerOrders.reduce((sum, o) => {
    return sum + Number(o.totalOrderedWeight || 0);
  }, 0);

  const availableStockTons = Math.max(0, totalInwardTons - totalOutwardTons);
  const availableStockQuintals = availableStockTons * 10;

  const cards = [
    { title: "आजचे रेकॉर्ड", value: totalRecords },
    { title: "आजची रक्कम", value: `₹${totalAmount}` },
    { title: "आजची दिलेली रक्कम", value: `₹${totalPaid}` },
    { title: "आजची बाकी रक्कम", value: `₹${totalDue}` },
    { 
      title: "मका शिल्लक साठा", 
      value: `${availableStockTons.toFixed(2)} T`, 
      extra: `(${availableStockQuintals.toFixed(0)} क्विंटल)` 
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div className="stat-card" key={i}>
          <h3>{card.title}</h3>
          <p>
            {card.value}
            {card.extra && (
              <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "6px", fontWeight: "normal" }}>
                {card.extra}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

// --- Main Invoice Component ---
const Invoice = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [farmerContact, setFarmerContact] = useState("");
  const [crop, setCrop] = useState("मका");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [dealerOrders, setDealerOrders] = useState([]);
  const [previewData, setPreviewData] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const invoiceRef = useRef(); 
  const today = new Date().toISOString().split("T")[0];

  const handleEditClick = (rec) => {
    navigate(`/admin`, { state: { editRecord: rec } });
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/api/records`);
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("डेटा लोड करताना एरर आली:", err);
    }
  };

  const fetchDealerOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dealer-orders`);
      const data = await response.json();
      setDealerOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("डीलर ऑर्डर्स लोड करताना एरर आली:", err);
    }
  };

  const loadData = async () => {
    await fetchRecords();
    await fetchDealerOrders();
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTotal = (r, q) => {
    if (r && q) {
      const total = r * q;
      setTotalAmount(total);
      if (Number(paidAmount) > total) {
        setPaidAmount(total);
      }
    } else {
      setTotalAmount("");
    }
  };

  const handlePaidAmountChange = (val) => {
    const enteredAmount = Number(val);
    const total = Number(totalAmount);
    if (enteredAmount > total) {
      setPaidAmount(total);
    } else {
      setPaidAmount(val);
    }
  };

  const downloadPDF = async () => {
  const input = invoiceRef.current;

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  // ✅ Receipt / DL size (A5)
  const pdf = new jsPDF("p", "mm", "a5");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let finalWidth = imgWidth;
  let finalHeight = imgHeight;

  // ✅ Full invoice content fit logic
  if (imgHeight > pageHeight) {
    const scaleFactor = pageHeight / imgHeight;
    finalWidth = imgWidth * scaleFactor;
    finalHeight = imgHeight * scaleFactor;
  }

  const x = (pageWidth - finalWidth) / 2;
  const y = 5;

  pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
  pdf.save(`Invoice_Receipt_${previewData.customer || "Bill"}.pdf`);
};


  const handleBillCreate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (farmerContact.length !== 10) {
      setError("⚠️ कृपया वैध १० अंकी मोबाईल नंबर टाका");
      return;
    }
    if (!date || !customer || !farmerContact || !crop || !rate || !quantity || !totalAmount || !paidAmount) {
      setError("⚠️ कृपया सर्व माहिती भरा");
      return;
    }

    setIsSubmitting(true);
    const recordData = {
      date,
      farmerName: customer,
      mobile: farmerContact,
      crop,
      rate: Number(rate),
      quantity: Number(quantity),
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
    };

    try {
      const res = await fetch(`${API_URL}/api/add-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordData),
      });

      if (res.ok) {
        alert("बिल तयार झाले आणि डेटाबेसमध्ये सेव्ह झाले! ✅");
        setPreviewData({
          date, customer, farmerContact, crop, rate, quantity, totalAmount, paidAmount,
          billNo: Date.now().toString().slice(-5)
        });
        setDate("");
        setCustomer("");
        setFarmerContact("");
        setCrop("मका");
        setRate("");
        setQuantity("");
        setTotalAmount("");
        setPaidAmount("");
        setError("");
        await loadData(); 
      } else {
        alert("डेटा सेव्ह करताना त्रुटी आली.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("सर्व्हरशी संपर्क होऊ शकला नाही.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-wrapper" style={{ padding: "20px" }}>
      <div className="invoice-container">
        <div className="invoice-left">
          <form className="bill-form">
            <div className="form-row">
              <div className="form-group">
                <label>तारीख:</label>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>ग्राहकाचे नाव:</label>
                <input type="text" placeholder="उदा. रमेश पाटील" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>शेतकऱ्याचा संपर्क (१० अंक):</label>
                <input 
                  type="text" 
                  placeholder="उदा. 9876543210" 
                  maxLength="10" 
                  value={farmerContact} 
                  onChange={(e) => setFarmerContact(e.target.value.replace(/\D/g, ""))} 
                />
              </div>
              <div className="form-group">
                <label>पिकाचे नाव:</label>
                <CustomDropdown
                  value={crop}
                  onChange={setCrop}
                  options={[
                    { value: "मका", label: "मका" }
                  ]}
                  placeholder="पिक निवडा"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>आजचा दर (₹ / क्विंटल):</label>
                <input type="number" placeholder="उदा. 2300" value={rate} onChange={(e) => { setRate(e.target.value); updateTotal(e.target.value, quantity); }} />
              </div>
              <div className="form-group">
                <label>प्रमाण (क्विंटल):</label>
                <input type="number" placeholder="उदा. 12" value={quantity} onChange={(e) => { setQuantity(e.target.value); updateTotal(rate, e.target.value); }} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>एकूण रक्कम (₹):</label>
                <input type="number" value={totalAmount} readOnly style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} />
              </div>
              <div className="form-group">
                <label>दिलेली रक्कम (₹):</label>
                <input 
                  type="number" 
                  placeholder="उदा. 20000" 
                  value={paidAmount} 
                  onChange={(e) => handlePaidAmountChange(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleBillCreate} 
              className="submit-btn"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "बिल तयार होत आहे..." : "बिल तयार करा"}
            </button>

            <button 
              type="button" 
              onClick={downloadPDF} 
              className="submit-btn" 
              style={{ marginTop: "12px", backgroundColor: "#4CAF50" }}
            >
              फक्त डाउनलोड करा (PDF)
            </button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>

        <div className="invoice-right" ref={invoiceRef} style={slipStyles.container}>
          {/* Header */}
          <div style={slipStyles.header}>
            <div style={slipStyles.logoCircle}>KT</div>
            <div style={slipStyles.titleArea}>
              <h2 style={slipStyles.mainTitle}>मे. के.टी. ट्रेडर्स</h2>
              <h3 style={slipStyles.subTitle}>K. T. TRADERS</h3>
            </div>
          </div>

          <div style={slipStyles.addressLine}>
            मार्केट यार्ड, श्री व्यंकटेश बँकच्या मागे, मालेगाव कॅम्प जि. नाशिक. मो. 9850291298, 9767128838
          </div>

          <div style={slipStyles.metaLine}>
            <div><strong>बिल क्रमांक:</strong> No. {previewData.billNo || Date.now().toString().slice(-5)}</div>
            <div><strong>तारीख:</strong> {previewData.date || date || ""}</div>
          </div>

          <div style={slipStyles.fieldLine}>
            <span style={slipStyles.fieldLabel}>शेतकऱ्याचे नाव:</span>
            <span style={slipStyles.fieldValue}>{previewData.customer || customer || ""}</span>
          </div>

          <div style={slipStyles.fieldLine}>
            <span style={slipStyles.fieldLabel}>मोबाईल क्रमांक:</span>
            <span style={slipStyles.fieldValue}>{previewData.farmerContact || farmerContact || ""}</span>
          </div>

          <div style={slipStyles.fieldLine}>
            <span style={slipStyles.fieldLabel}>पत्ता:</span>
            <span style={slipStyles.fieldValue}>निमगाव, ता. मालेगाव, जि. नाशिक.</span>
          </div>

          <table style={slipStyles.table}>
            <thead>
              <tr>
                <th style={slipStyles.th}>पीक</th>
                <th style={slipStyles.th}>प्रमाण</th>
                <th style={slipStyles.th}>दर</th>
                <th style={slipStyles.th}>एकूण रक्कम</th>
                <th style={slipStyles.th}>दिलेली रक्कम</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={slipStyles.td}>{previewData.crop || crop || ""}</td>
                <td style={slipStyles.td}>{(previewData.quantity || quantity) ? `${previewData.quantity || quantity} क्विंटल` : ""}</td>
                <td style={slipStyles.td}>{(previewData.rate || rate) ? `₹${previewData.rate || rate}` : ""}</td>
                <td style={slipStyles.td}>{(previewData.totalAmount || totalAmount) ? `₹${previewData.totalAmount || totalAmount}` : ""}</td>
                <td style={slipStyles.td}>{(previewData.paidAmount || paidAmount) ? `₹${previewData.paidAmount || paidAmount}` : ""}</td>
              </tr>
              <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                <td colSpan="3" style={{ ...slipStyles.td, textAlign: "left" }}>एकूण</td>
                <td style={slipStyles.td}>{(previewData.totalAmount || totalAmount) ? `₹${previewData.totalAmount || totalAmount}` : ""}</td>
                <td style={slipStyles.td}>{(previewData.paidAmount || paidAmount) ? `₹${previewData.paidAmount || paidAmount}` : ""}</td>
              </tr>
            </tbody>
          </table>

          <div style={slipStyles.summaryArea}>
            <div style={slipStyles.fieldLine}>
              <span style={slipStyles.fieldLabel}>बाकी रक्कम:</span>
              <span style={{ ...slipStyles.fieldValue, ...slipStyles.balanceText }}>
                {(previewData.totalAmount && previewData.paidAmount) 
                  ? `₹${previewData.totalAmount - previewData.paidAmount}` 
                  : (totalAmount && paidAmount) ? `₹${totalAmount - paidAmount}` : "₹0"}
              </span>
            </div>
          </div>

          <div style={slipStyles.footerSignatures}>
            <div>
              <div style={{ marginBottom: "25px", fontWeight: "bold" }}>शेतकरी स्वाक्षरी</div>
              <div>...............................</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: "25px", fontWeight: "bold" }}>तर्फे: के.टी. ट्रेडर्स</div>
              <div>...............................</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- नवीन बदल: Stats Cards आणि Records Table --- */}
      <div style={{ marginTop: "40px", width: "100%", maxWidth: "1200px", margin: "40px auto" }}>
        <DayStatsCards records={records} dealerOrders={dealerOrders} />
        <div style={{ marginTop: "20px" }}>
          <InvoiceRecordsTable records={records} onRecordsChange={setRecords} onEditClick={handleEditClick} />
        </div>
      </div>
    </div>
  );
};

export default Invoice;//new