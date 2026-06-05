import React, { useRef } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CompanyProfile = ({ selectedCompany, orders = [], profileTab, onSetProfileTab, onBack, onOpenCuttingModal, onShowInvoice, onOpenPayment, onDeletePayment }) => {
  const ledgerRef = useRef();

  const companyOrders = orders.filter(o => o.dealerName === selectedCompany.name);
  
  const companyDispatches = companyOrders.flatMap(o => 
    (o.dispatches || []).map(d => ({
      ...d,
      orderId: o.id,
      poNo: o.poNo
    }))
  );

  const companyPayments = companyOrders.flatMap(o => 
    (o.payments || []).map(p => ({
      ...p,
      orderId: o.id,
      poNo: o.poNo
    }))
  );

  const totalSent = companyDispatches.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalCuts = companyDispatches.reduce((sum, d) => sum + Number(d.lossAmt || 0), 0);
  const totalPassed = totalSent - totalCuts;
  const totalPaid = companyPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalBalance = totalPassed - totalPaid;

  const downloadLedgerPDF = async () => {
    const element = ledgerRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${selectedCompany.name}_Ledger_Statement.pdf`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Back and Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> कंपन्या यादीकडे जा
          </button>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>
            🏢 {selectedCompany.name} — प्रोफाइल & व्यवहार सारांश
          </h2>
        </div>
        <button 
          className="primary-btn" 
          onClick={() => {
            if (companyOrders.length === 0) {
              alert("पेमेंट जोडण्यासाठी कंपनीची किमान एक ऑर्डर असणे आवश्यक आहे.");
              return;
            }
            onOpenPayment(companyOrders[0].id);
          }}
        >
          💰 नवीन पेमेंट व्यवहार (Add Payment)
        </button>
      </div>

      {/* Info Card & Tally Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        
        <div className="card" style={{ borderLeft: "4px solid #4E653C", margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>ठिकाण & संपर्क</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "16px", fontWeight: "700" }}>{selectedCompany.place || "-"}, {selectedCompany.village || "-"}</h3>
          <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#828B7E" }}>एकूण ऑर्डर्स: {companyOrders.length} | एकूण ट्रक्स: {companyDispatches.length}</p>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #007bff", margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>एकूण माल पाठवला (Trade Value)</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "700", color: "#007bff" }}>₹{totalSent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #C94A4A", margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>एकूण कपात / घट (Total Cutting)</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "700", color: "#C94A4A" }}>₹{totalCuts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #2e7d32", margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>कंपनी मंजूर रक्कम (Passed Value)</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "700", color: "#2e7d32" }}>₹{totalPassed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #D49A2E", margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>एकूण जमा पेमेंट (Received)</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "700", color: "#D49A2E" }}>₹{totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="card" style={{ borderLeft: `4px solid ${totalBalance > 0 ? "#ff9800" : "#2e7d32"}`, margin: 0, padding: "15px" }}>
          <span style={{ fontSize: "12px", color: "#828B7E" }}>येणे बाकी रक्कम (Outstanding)</span>
          <h3 style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "700", color: totalBalance > 0 ? "#ff9800" : "#2e7d32" }}>
            ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h3>
        </div>

      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "2px solid #E6E1D8", paddingBottom: "10px" }}>
        <button 
          className={`primary-btn ${profileTab === "orders" ? "" : "btn-ghost"}`}
          onClick={() => onSetProfileTab("orders")}
          style={{ padding: "6px 12px", fontSize: "13px" }}
        >
          📄 ऑर्डर्स यादी ({companyOrders.length})
        </button>
        <button 
          className={`primary-btn ${profileTab === "trucks" ? "" : "btn-ghost"}`}
          onClick={() => onSetProfileTab("trucks")}
          style={{ padding: "6px 12px", fontSize: "13px" }}
        >
          🚚 ट्रान्सपोर्ट & ट्रक्स ({companyDispatches.length})
        </button>
        <button 
          className={`primary-btn ${profileTab === "payments" ? "" : "btn-ghost"}`}
          onClick={() => onSetProfileTab("payments")}
          style={{ padding: "6px 12px", fontSize: "13px" }}
        >
          💰 जमा व्यवहार / लेजर ({companyPayments.length})
        </button>
      </div>

      {/* Sub-tab Rendering */}
      <div className="card" style={{ margin: 0, padding: "20px" }}>
        
        {profileTab === "orders" && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>कंपनीच्या ऑर्डर्स</h3>
            {companyOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>कोणतीही ऑर्डर नोंदवलेली नाही.</div>
            ) : (
              <div className="table-responsive">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>P.O. नं.</th>
                      <th>तारीख</th>
                      <th>एकूण वजन (Tons)</th>
                      <th>लोड केलेले (Tons)</th>
                      <th>बाकी वजन (Tons)</th>
                      <th>स्थिती</th>
                      <th>कृती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyOrders.map(o => (
                      <tr key={o.id}>
                        <td data-label="P.O. नं.">{o.poNo || "N/A"}</td>
                        <td data-label="तारीख">{o.orderDate}</td>
                        <td data-label="एकूण वजन">{o.totalOrderedWeight} Tons</td>
                        <td data-label="लोड केलेले">{o.fulfilledWeight.toFixed(2)} Tons</td>
                        <td data-label="बाकी वजन">{o.remainingWeight.toFixed(2)} Tons</td>
                        <td data-label="स्थिती">
                          <span className={`badge ${o.status === "fulfilled" ? "badge-paid" : o.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                            {o.status === "fulfilled" ? "पूर्ण" : o.status === "partially_fulfilled" ? "अंशतः पूर्ण" : "बाकी"}
                          </span>
                        </td>
                        <td data-label="कृती">
                          <button 
                            className="primary-btn btn-ghost btn-sm" 
                            onClick={() => {
                              onBack();
                              // Parent will set selected order via onSelectOrder callback
                              // This is handled by setting localStorage and dispatching event
                              localStorage.setItem("dealer_selectedOrder", JSON.stringify(o));
                              window.dispatchEvent(new Event("dealer-tab-changed"));
                            }}
                          >
                            तपशील पहा 📜
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {profileTab === "trucks" && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>वाहतूक व ट्रक नोंदी (Trades)</h3>
            {companyDispatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>कोणतीही वाहतूक नोंद सापडली नाही.</div>
            ) : (
              <div className="table-responsive">
                <table className="records-table" style={{ fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th>बिल / तारीख</th>
                      <th>गाडी नंबर / वाहतूक</th>
                      <th>माल प्रकार (गोण्या)</th>
                      <th>पाठवले वजन -> मिळाले</th>
                      <th>माल किंमत (Sent)</th>
                      <th>कपात / घट (Cuts)</th>
                      <th>कंपनी मंजूर (Passed)</th>
                      <th>कृती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyDispatches.map(d => {
                      const hasCutting = d.lossAmt !== undefined;
                      return (
                        <tr key={d.id}>
                          <td data-label="बिल / तारीख">
                            <strong>बिल: {d.billNo}</strong><br />
                            <span style={{ fontSize: "11px", color: "#828B7E" }}>{d.date}</span>
                          </td>
                          <td data-label="गाडी / वाहतूक">
                            <strong>{d.truckNo}</strong><br />
                            <span style={{ fontSize: "11px", color: "#828B7E" }}>{d.transportAgent || "-"} (दलाल: {d.brokerName || "-"})</span>
                          </td>
                          <td data-label="माल प्रकार">
                            {d.cropType}<br />
                            <span style={{ fontSize: "11px", color: "#828B7E" }}>{d.bagsCount || 0} गोण्या (Moist: {d.moisture || "-"}%)</span>
                          </td>
                          <td data-label="वजन (Tons)">
                            {d.weight} T &rarr; <span style={{ fontWeight: "bold" }}>{d.compWeight !== undefined ? `${d.compWeight} T` : "प्रलंबित"}</span>
                          </td>
                          <td data-label="किंमत">₹{d.amount.toFixed(2)}</td>
                          <td data-label="कपात">
                            {hasCutting ? (
                              <span style={{ color: "red", fontWeight: "bold" }}>
                                ₹{d.lossAmt.toFixed(2)}
                              </span>
                            ) : (
                              <span style={{ color: "#828B7E" }}>-</span>
                            )}
                          </td>
                          <td data-label="मंजूर">
                            {hasCutting ? (
                              <strong>₹{d.passedAmt.toFixed(2)}</strong>
                            ) : (
                              <span style={{ color: "#ff9800" }}>तपासणी बाकी</span>
                            )}
                          </td>
                          <td data-label="कृती">
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button 
                                className="primary-btn btn-sm btn-ghost" 
                                style={{ padding: "4px 8px" }}
                                onClick={() => onOpenCuttingModal(d, d.orderId)}
                                title="कंपनी अंतिम घट/नुकसान नोंदवा"
                              >
                                ⚖️ घट नोंद
                              </button>
                              <button 
                                className="primary-btn btn-sm btn-success" 
                                style={{ padding: "4px 8px" }}
                                onClick={() => onShowInvoice(d)}
                                title="पावती बिल प्रिट"
                              >
                                📄 बिल
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {profileTab === "payments" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>कंपनीकडून जमा पेमेंट व्यवहार (Ledger)</h3>
              <button className="primary-btn btn-success btn-sm" onClick={downloadLedgerPDF}>
                📄 खाते उतारा (Download Statement)
              </button>
            </div>
            {companyPayments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>कोणताही पेमेंट व्यवहार नोंदवला नाही.</div>
            ) : (
              <div className="table-responsive">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>दिनांक</th>
                      <th>P.O. नं.</th>
                      <th>पेमेंट प्रकार</th>
                      <th>रेफरन्स नं.</th>
                      <th>तपशील / नोट</th>
                      <th>रक्कम</th>
                      <th>कृती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyPayments.map(p => (
                      <tr key={p.id}>
                        <td data-label="दिनांक">{p.date}</td>
                        <td data-label="P.O. नं.">{p.poNo || "N/A"}</td>
                        <td data-label="पेमेंट प्रकार">{p.mode}</td>
                        <td data-label="रेफरन्स नं.">{p.refNo || "-"}</td>
                        <td data-label="तपशील / नोट">{p.note || "-"}</td>
                        <td data-label="रक्कम" style={{ fontWeight: "bold", color: "#2e7d32" }}>
                          ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td data-label="कृती">
                          <button 
                            className="primary-btn btn-danger btn-sm" 
                            style={{ padding: "4px 8px", background: "#C94A4A" }}
                            onClick={() => onDeletePayment(p.orderId, p.id)}
                          >
                            <Trash2 size={14} /> हटवा
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* HIDDEN PRINTABLE LEDGER CONTAINER */}
      <div 
        ref={ledgerRef} 
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "790px",
          padding: "35px",
          background: "#ffffff",
          color: "#000000",
          fontFamily: "sans-serif",
          boxSizing: "border-box"
        }}
      >
        <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "15px", marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#8B0000" }}>मे. के.टी. ट्रेडर्स</h1>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>K. T. TRADERS</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>मार्केट यार्ड, मालेगाव कॅम्प जि. नाशिक | मो. 9850291298, 9767128838</p>
          <h2 style={{ marginTop: "15px", marginBottom: 0, fontSize: "18px", borderTop: "1px solid #ddd", paddingTop: "10px", fontWeight: "bold" }}>
            लेजर खाते उतारा (Account Statement)
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "12px", background: "#f9f9f9", padding: "12px", borderRadius: "5px", border: "1px solid #eee" }}>
          <div>
            <strong>कंपनीचे नाव:</strong> {selectedCompany.name}<br />
            <strong>पत्ता:</strong> {selectedCompany.place} / {selectedCompany.village}
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>तारीख:</strong> {new Date().toLocaleDateString("en-IN")}<br />
            <strong>प्रत:</strong> खातेदार प्रत
          </div>
        </div>

        {(() => {
          const ledgerOrders = orders.filter(o => o.dealerName === selectedCompany.name);
          const ledgerDispatches = ledgerOrders.flatMap(o => (o.dispatches || []).map(d => ({ ...d, poNo: o.poNo })));
          const ledgerPayments = ledgerOrders.flatMap(o => (o.payments || []).map(p => ({ ...p, poNo: o.poNo })));

          const ledgerTotalSent = ledgerDispatches.reduce((sum, d) => sum + Number(d.amount || 0), 0);
          const ledgerTotalCuts = ledgerDispatches.reduce((sum, d) => sum + Number(d.lossAmt || 0), 0);
          const ledgerTotalPassed = ledgerTotalSent - ledgerTotalCuts;
          const ledgerTotalPaid = ledgerPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
          const ledgerTotalBalance = ledgerTotalPassed - ledgerTotalPaid;

          const txs = [
            ...ledgerDispatches.map(d => ({
              date: d.date,
              timestamp: new Date(d.date).getTime(),
              details: `गाडी नं: ${d.truckNo} (${d.cropType})`,
              weight: d.weight,
              sentAmt: d.amount,
              cuts: d.lossAmt || 0,
              passedAmt: d.passedAmt || d.amount,
              paidAmt: 0
            })),
            ...ledgerPayments.map(p => ({
              date: p.date,
              timestamp: new Date(p.date).getTime(),
              details: `पेमेंट जमा (${p.mode}) ${p.refNo ? "Ref: "+p.refNo : ""}`,
              weight: 0,
              sentAmt: 0,
              cuts: 0,
              passedAmt: 0,
              paidAmt: p.amount
            }))
          ];
          txs.sort((a, b) => a.timestamp - b.timestamp);

          let runningBal = 0;

          return (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "25px", textAlign: "center" }}>
                <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#666" }}>एकूण माल (Sent)</span>
                  <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px" }}>₹{ledgerTotalSent.toFixed(2)}</div>
                </div>
                <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#666" }}>एकूण घट (Cuts)</span>
                  <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "red" }}>₹{ledgerTotalCuts.toFixed(2)}</div>
                </div>
                <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#666" }}>कंपनी मंजूर</span>
                  <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "green" }}>₹{ledgerTotalPassed.toFixed(2)}</div>
                </div>
                <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#666" }}>एकूण जमा (Paid)</span>
                  <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "blue" }}>₹{ledgerTotalPaid.toFixed(2)}</div>
                </div>
                <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px", background: "#f2f7f2" }}>
                  <span style={{ fontSize: "9px", color: "#666" }}>बाकी (Outstanding)</span>
                  <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: ledgerTotalBalance > 0 ? "orange" : "green" }}>₹{ledgerTotalBalance.toFixed(2)}</div>
                </div>
              </div>

              <h3 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "5px", marginBottom: "10px" }}>व्यवहार तपशील (Transaction Ledger)</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
                <thead>
                  <tr style={{ background: "#eaeaea", borderBottom: "2px solid #000" }}>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "left" }}>दिनांक</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "left" }}>तपशील / गाडी नंबर</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "center" }}>वजन (T)</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>मूळ माल (₹)</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>घट (₹)</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>मंजूर (₹)</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>जमा (₹)</th>
                    <th style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>बाकी (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx, idx) => {
                    runningBal = runningBal + tx.passedAmt - tx.paidAmt;
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ border: "1px solid #ddd", padding: "6px" }}>{tx.date}</td>
                        <td style={{ border: "1px solid #ddd", padding: "6px" }}>{tx.details}</td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "center" }}>
                          {tx.weight > 0 ? `${tx.weight} T` : "-"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>
                          {tx.sentAmt > 0 ? `₹${tx.sentAmt.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right", color: tx.cuts > 0 ? "red" : "black" }}>
                          {tx.cuts > 0 ? `₹${tx.cuts.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>
                          {tx.passedAmt > 0 ? `₹${tx.passedAmt.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right", color: "green", fontWeight: tx.paidAmt > 0 ? "bold" : "normal" }}>
                          {tx.paidAmt > 0 ? `₹${tx.paidAmt.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right", fontWeight: "bold" }}>
                          ₹{runningBal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          );
        })()}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px", fontSize: "11px" }}>
          <div>* खातेदाराची स्वाक्षरी</div>
          <div style={{ textAlign: "right" }}>
            <strong>तर्फे : के.टी. ट्रेडर्स</strong><br /><br /><br />
            <span>अधिकृत सही</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
