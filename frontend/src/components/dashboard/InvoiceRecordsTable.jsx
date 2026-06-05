import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; 
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

const InvoiceRecordsTable = ({ records, onEditClick, onRecordsChange }) => {
  const [searchName, setSearchName] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  
  // आजची तारीख डिफॉल्ट सेट केली (format: YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState(today); 
  
  const [onlyDue, setOnlyDue] = useState(false);
  const [onlyPaid, setOnlyPaid] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoiceRef = useRef(null);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // फिल्टर लॉजिक
  const filteredRecords = (records || []).filter((rec) => {
    const matchName = rec.farmerName?.toLowerCase().includes(searchName.toLowerCase());
    const matchCrop = filterCrop ? rec.crop === filterCrop : true;
    
    // फक्त निवडलेल्या तारखेचा डेटा मॅच करणे
    const matchDate = filterDate ? rec.date === filterDate : true;
    
    const matchDue = onlyDue ? (rec.totalAmount - rec.paidAmount > 0) : true;
    const matchPaid = onlyPaid ? (rec.totalAmount - rec.paidAmount === 0) : true;
    
    return matchName && matchCrop && matchDate && matchDue && matchPaid;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Farmer Name", "Mobile", "Crop", "Quantity", "Rate", "Total Amount", "Paid Amount", "Due Amount"],
      ...filteredRecords.map((rec) => [
        rec.date, rec.farmerName, rec.mobile || "", rec.crop, rec.quantity, rec.rate, rec.totalAmount, rec.paidAmount, rec.totalAmount - rec.paidAmount,
      ]),
    ].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mandi_records.csv");
    link.click();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").slice(1);
      const importedRecords = rows.filter((row) => row.trim() !== "").map((row) => {
        const [date, farmerName, mobile, crop, quantity, rate, totalAmount, paidAmount] = row.split(",");
        return {
          _id: Math.random().toString(36).substr(2, 9),
          date, farmerName, mobile, crop,
          quantity: Number(quantity), rate: Number(rate),
          totalAmount: Number(totalAmount), paidAmount: Number(paidAmount),
        };
      });
      if (onRecordsChange) onRecordsChange(importedRecords);
      alert("डेटा यशस्वीरित्या इंपोर्ट झाला! ✅");
    };
    reader.readAsText(file);
  };

  const handleDownloadInvoicePDF = () => {
    const element = invoiceRef.current;
    html2canvas(element, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${selectedInvoice.farmerName}.pdf`);
    });
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ borderBottom: '2px solid #2196F3', display: 'inline-block', margin: 0 }}>रेकॉर्ड्स</h2>
        {filterDate === today && (
          <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
            ● आजचे रेकॉर्ड्स
          </span>
        )}
      </div>

      <div className="filters">
        <input className="filter-input" placeholder="नाव शोधा" value={searchName} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
        <CustomDropdown
          value={filterCrop}
          onChange={(val) => { setFilterCrop(val); setCurrentPage(1); }}
          options={[
            { value: "", label: "सर्व पिके" },
            { value: "मका", label: "मका" }
          ]}
          placeholder="सर्व पिके"
          style={{ minWidth: "160px", width: "160px" }}
        />
        
        {/* तारीख फिल्टर - सुरुवातीला आजची तारीख असेल */}
        <input type="date" className="filter-input" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }} />
        
        <label className="filter-checkbox">
          <input type="checkbox" checked={onlyDue} onChange={(e) => { setOnlyDue(e.target.checked); if (e.target.checked) setOnlyPaid(false); setCurrentPage(1); }} />फक्त बाकी
        </label>
        <label className="filter-checkbox">
          <input type="checkbox" checked={onlyPaid} onChange={(e) => { setOnlyPaid(e.target.checked); if (e.target.checked) setOnlyDue(false); setCurrentPage(1); }} />पूर्ण दिलेले
        </label>
      </div>

      <div className="table-responsive" style={{ width: '100%', overflowX: 'hidden' }}>
        <table className="records-table" style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--border-light)' }}>
              <th style={{ width: '12%', padding: '10px' }}>तारीख</th>
              <th style={{ width: '18%', padding: '10px' }}>शेतकरी</th>
              <th style={{ width: '12%', padding: '10px' }}>मोबाइल</th>
              <th style={{ width: '8%', padding: '10px' }}>पिक</th>
              <th style={{ width: '8%', padding: '10px' }}>प्रमाण</th>
              <th style={{ width: '8%', padding: '10px' }}>दर</th>
              <th style={{ width: '10%', padding: '10px' }}>एकूण</th>
              <th style={{ width: '10%', padding: '10px' }}>दिलेली</th>
              <th style={{ width: '10%', padding: '10px' }}>बाकी</th>
              <th style={{ width: '10%', padding: '10px' }}>इनव्हॉइस</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((rec, index) => {
                // ✅ डेटाबेस मधून बिल नंबर घेतला, नसेल तरच जुना फॉर्मेट वापरला
                const billNo = rec.billNo || String(indexOfFirstRecord + index + 1).padStart(4, '0');
                return (
                  <tr key={rec._id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td data-label="तारीख">{rec.date}</td>
                    <td data-label="शेतकरी" style={{ textAlign: 'left', paddingLeft: '5px' }}>
                      <button onClick={() => onEditClick && onEditClick(rec)} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontWeight: "bold", textAlign: 'left', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rec.farmerName}
                      </button>
                    </td>
                    <td data-label="मोबाइल">{rec.mobile}</td>
                    <td data-label="पिक">{rec.crop}</td>
                    <td data-label="प्रमाण">{rec.quantity}</td>
                    <td data-label="दर">₹{rec.rate}</td>
                    <td data-label="एकूण">₹{rec.totalAmount}</td>
                    <td data-label="दिलेली">₹{rec.paidAmount}</td>
                    <td data-label="बाकी" style={{ color: rec.totalAmount - rec.paidAmount > 0 ? "red" : "green", fontWeight: "bold" }}>
                      ₹{(rec.totalAmount - rec.paidAmount).toFixed(2)}
                    </td>
                    <td data-label="इनव्हॉइस">
                      <button onClick={() => setSelectedInvoice({ ...rec, displayBillNo: billNo })} style={{ backgroundColor: "#2196F3", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: '12px' }}>PDF 📄</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" style={{ padding: '20px', color: '#888' }}>निवडलेल्या तारखेसाठी कोणतेही रेकॉर्ड सापडले नाहीत.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <div className="invoice-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', gap: '15px' }}>
            <button onClick={handleDownloadInvoicePDF} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>PDF डाउनलोड 📥</button>
            <button onClick={() => setSelectedInvoice(null)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>बंद करा ✖</button>
          </div>

          <div ref={invoiceRef} style={slipStyles.container}>
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
              <div><strong>बिल क्रमांक:</strong> No. {selectedInvoice.billNo || selectedInvoice.displayBillNo}</div>
              <div><strong>तारीख:</strong> {selectedInvoice.date}</div>
            </div>

            <div style={slipStyles.fieldLine}>
              <span style={slipStyles.fieldLabel}>शेतकऱ्याचे नाव:</span>
              <span style={slipStyles.fieldValue}>{selectedInvoice.farmerName}</span>
            </div>

            <div style={slipStyles.fieldLine}>
              <span style={slipStyles.fieldLabel}>मोबाईल क्रमांक:</span>
              <span style={slipStyles.fieldValue}>{selectedInvoice.mobile}</span>
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
                  <td style={slipStyles.td}>{selectedInvoice.crop}</td>
                  <td style={slipStyles.td}>{selectedInvoice.quantity} क्विंटल</td>
                  <td style={slipStyles.td}>₹{selectedInvoice.rate}</td>
                  <td style={slipStyles.td}>₹{selectedInvoice.totalAmount}</td>
                  <td style={slipStyles.td}>₹{selectedInvoice.paidAmount}</td>
                </tr>
                <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                  <td colSpan="3" style={{ ...slipStyles.td, textAlign: "left" }}>एकूण</td>
                  <td style={slipStyles.td}>₹{selectedInvoice.totalAmount}</td>
                  <td style={slipStyles.td}>₹{selectedInvoice.paidAmount}</td>
                </tr>
              </tbody>
            </table>

            <div style={slipStyles.summaryArea}>
              <div style={slipStyles.fieldLine}>
                <span style={slipStyles.fieldLabel}>बाकी रक्कम:</span>
                <span style={{ ...slipStyles.fieldValue, ...slipStyles.balanceText }}>
                  ₹{(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}
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
      )}

      <div className="csv-actions" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="primary-btn" onClick={handleExportCSV} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>CSV एक्सपोर्ट 📤</button>
          <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportCSV} />
          <button className="primary-btn" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>CSV इंपोर्ट 📥</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#e3f2fd', padding: '5px 15px', borderRadius: '25px' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2196F3', fontSize: '18px' }}>◀</button>
          <span style={{ fontWeight: 'bold', color: '#2196F3' }}>पाने {currentPage} / {totalPages || 1}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2196F3', fontSize: '18px' }}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRecordsTable;