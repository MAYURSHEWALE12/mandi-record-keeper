import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const styles = {
  billSlipLeft: {
    flex: 1,
    padding: "10px",
    boxSizing: "border-box",
    background: "#fcfbf9",
    fontFamily: "sans-serif",
    color: "#000"
  },
  billSlipRight: {
    flex: 1,
    padding: "10px",
    boxSizing: "border-box",
    background: "#fcfbf9",
    fontFamily: "sans-serif",
    color: "#000"
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
  slipFieldLine: {
    borderBottom: "1px dotted #555",
    paddingBottom: "3px",
    marginBottom: "8px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center"
  },
  fieldValue: {
    marginLeft: "6px",
    fontWeight: "600",
    color: "#222"
  },
  receiptTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "10px",
  },
  receiptTableTh: {
    border: "1px solid #000",
    padding: "6px",
    background: "#e8e8e8",
    fontWeight: "bold"
  },
  receiptTableTd: {
    border: "1px solid #000",
    padding: "6px"
  }
};

const InvoicePreview = ({ show, selectedDispatchForPreview, currentOrderForPreview, onClose }) => {
  const invoiceRef = useRef();
  const leftSlipRef = useRef();
  const rightSlipRef = useRef();

  const downloadReceiptPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Truck_Loading_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  const downloadLeftSlipPDF = async () => {
    const element = leftSlipRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a5");
    const imgWidth = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Transport_Freight_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  const downloadRightSlipPDF = async () => {
    const element = rightSlipRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a5");
    const imgWidth = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Loading_Goods_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  if (!show || !selectedDispatchForPreview) return null;

  return (
    <div className="modal-overlay">
      <div className="card modal-content" style={{ maxWidth: "1100px", padding: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>पावती बिल प्रिव्ह्यू (Invoice Double Slip Preview)</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="primary-btn btn-success" onClick={downloadLeftSlipPDF}>वाहतूक पावती 📥 (Transport)</button>
            <button className="primary-btn btn-success" onClick={downloadRightSlipPDF}>माल पावती 📥 (Loading)</button>
            <button className="primary-btn btn-success" onClick={downloadReceiptPDF}>एकत्रित पावती 📥 (Combined)</button>
            <button className="primary-btn btn-ghost" onClick={onClose}>बंद करा (Close)</button>
          </div>
        </div>

        <div 
          ref={invoiceRef} 
          className="invoice-preview-slips"
          style={{
            display: "flex",
            background: "#fcfbf9",
            border: "1px solid #ddd",
            padding: "20px",
            fontFamily: "sans-serif",
            color: "#000",
            gap: "20px",
            width: "1050px",
            margin: "0 auto",
            boxSizing: "border-box"
          }}
        >
          {/* SLIP LEFT: TRANSPORT FREIGHT RECEIPT */}
          <div ref={leftSlipRef} style={styles.billSlipLeft}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
              <div style={styles.logoCircle}>KT</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#8B0000" }}>मे. के.टी. ट्रेडर्स</h2>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold" }}>K. T. TRADERS</h3>
                <p style={{ margin: 0, fontSize: "10px" }}>जनरल मर्चन्ट अॅन्ड कमिशन एजन्ट</p>
              </div>
            </div>

            <div style={{ fontSize: "9px", margin: "4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
              मार्केट यार्ड, श्री व्यंकटेश बँकच्या मागे, मालेगाव कॅम्प जि. नाशिक. मो. 9850291298, 9767128838
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", fontSize: "11px" }}>
              <div><strong>पावती नं:</strong> No. {selectedDispatchForPreview.billNo}</div>
              <div><strong>दिनांक:</strong> {selectedDispatchForPreview.date}</div>
            </div>

            <div style={styles.slipFieldLine}>
              <strong>बिल नं. / P.O. No:</strong> <span style={styles.fieldValue}>{currentOrderForPreview.poNo || "N/A"}</span>
            </div>
            <div style={styles.slipFieldLine}>
              <strong>श्रीमान:</strong> <span style={styles.fieldValue}>{currentOrderForPreview.dealerName}</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>ठिकाण:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.deliveryPlace || currentOrderForPreview.place}</span>
              </div>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>गांव:</strong> <span style={styles.fieldValue}>{currentOrderForPreview.village}</span>
              </div>
            </div>
            
            <div style={{ margin: "6px 0", fontSize: "10px", fontStyle: "italic" }}>
              सप्रेम नमस्कार, आपले ऑर्डर प्रमाणे -
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>मोटार नं:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.truckNo}</span>
              </div>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>मालकाचे नाव:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.ownerName || "-"}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ ...styles.slipFieldLine, flex: 1.5 }}>
                <strong>ड्रायव्हरचे नाव:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.driverName || "-"}</span>
              </div>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>ला. नं:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.driverLicense || "-"}</span>
              </div>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>गांव:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.driverVillage || "-"}</span>
              </div>
            </div>

            <div style={styles.slipFieldLine}>
              <strong>टिप:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.note || "-"}</span>
            </div>

            <table style={styles.receiptTable}>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>मालाचा तपशील</th>
                  <th>भाडे दर</th>
                  <th>एकूण भाडे</th>
                  <th>पैकी येथे दिले</th>
                  <th>भाडे देणे बाकी</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ height: "45px", verticalAlign: "top" }}>
                  <td>{selectedDispatchForPreview.cropType} (वजन: {selectedDispatchForPreview.weight} Tons, {selectedDispatchForPreview.bagsCount || 0} गोण्या)</td>
                  <td style={{ textAlign: "center" }}>₹{selectedDispatchForPreview.freightRate || "-"}</td>
                  <td style={{ textAlign: "center" }}>₹{selectedDispatchForPreview.totalFreight || "-"}</td>
                  <td style={{ textAlign: "center" }}>₹{selectedDispatchForPreview.paidFreight || "-"}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>
                    ₹{selectedDispatchForPreview.totalFreight && selectedDispatchForPreview.paidFreight 
                      ? (selectedDispatchForPreview.totalFreight - selectedDispatchForPreview.paidFreight).toFixed(2) 
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: "10px", margin: "10px 0 5px 0" }}>
              <strong>अक्षरी भाडे देणे रुपये:</strong> ............................................................................ देउन माल तपासून उतरवून घ्यावा.
            </div>
            <div style={{ fontSize: "8px", background: "#f2f2f2", padding: "4px", borderRadius: "3px", lineHeight: "1.3" }}>
              <strong>टिप:</strong> मालाची रस्त्यात आग - अपघात - वादळ अकस्मात कारणाने होणाऱ्या नुकसानीस आम्ही जबाबदार नाही.
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", fontSize: "10px" }}>
              <div>
                <div><strong>ड्रायव्हर मो. नं:</strong> {selectedDispatchForPreview.driverMobile || "-"}</div>
                <div style={{ marginTop: "15px" }}>मोटार लॉरी मालक / ड्रायव्हर</div>
              </div>
              <div style={{ textAlign: "right", marginTop: "25px" }}>
                <strong>तर्फे : के.टी. ट्रेडर्स</strong>
              </div>
            </div>
          </div>

          {/* PERFORATION DIVIDER LINE */}
          <div style={{ borderLeft: "2px dashed #999", height: "100%", margin: "0 5px" }}></div>

          {/* SLIP RIGHT: LOADING GOODS RECEIPT */}
          <div ref={rightSlipRef} style={styles.billSlipRight}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
              <div style={{ ...styles.logoCircle, background: "#2E8B57" }}>KT</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#2E8B57" }}>मे. के.टी. ट्रेडर्स</h2>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "bold" }}>K. T. TRADERS</h3>
                <p style={{ margin: 0, fontSize: "10px" }}>जनरल मर्चन्ट अॅन्ड कमिशन एजन्ट</p>
              </div>
            </div>

            <div style={{ fontSize: "9px", margin: "4px 0", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
              मार्केट यार्ड, श्री व्यंकटेश बँकच्या मागे, मालेगाव कॅम्प जि. नाशिक. मो. 9850291298, 9767128838
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", fontSize: "11px" }}>
              <div><strong>बिल नं:</strong> {selectedDispatchForPreview.billNo}</div>
              <div><strong>ता. (Date):</strong> {selectedDispatchForPreview.date}</div>
            </div>

            <div style={styles.slipFieldLine}>
              <strong>मे. (Company Name):</strong> <span style={styles.fieldValue}>{currentOrderForPreview.dealerName}</span>
            </div>
            <div style={styles.slipFieldLine}>
              <strong>डिलिव्हरी (Delivery):</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.deliveryPlace || currentOrderForPreview.place}</span>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ ...styles.slipFieldLine, flex: 1.2 }}>
                <strong>दलाल (Broker):</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.brokerName || "-"}</span>
              </div>
              <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                <strong>गाडी नं. (Truck No):</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.truckNo}</span>
              </div>
            </div>

            <div style={styles.slipFieldLine}>
              <strong>ट्रान्सपोर्ट (Transport):</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.transportAgent || "-"}</span>
            </div>

            <table style={styles.receiptTable}>
              <thead>
                <tr>
                  <th style={{ width: "45%" }}>मालाचा प्रकार</th>
                  <th>नग (Bags)</th>
                  <th>वजन (Tons)</th>
                  <th>भाव (Rate)</th>
                  <th>रक्कम (Amount)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ height: "60px", verticalAlign: "top" }}>
                  <td>{selectedDispatchForPreview.cropType}</td>
                  <td style={{ textAlign: "center" }}>{selectedDispatchForPreview.bagsCount || "-"}</td>
                  <td style={{ textAlign: "center" }}>{selectedDispatchForPreview.weight} T</td>
                  <td style={{ textAlign: "center" }}>₹{selectedDispatchForPreview.rate}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>₹{selectedDispatchForPreview.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ fontSize: "9px" }}>
                    <strong>P.O. NO:</strong> {currentOrderForPreview.poNo || "N/A"}<br />
                    <strong>Moisture:</strong> {selectedDispatchForPreview.moisture ? `${selectedDispatchForPreview.moisture}%` : "-"}
                  </td>
                  <td style={{ fontWeight: "bold", background: "#f9f9f9" }}>एकूण (Total)</td>
                  <td style={{ textAlign: "center", fontWeight: "bold", background: "#f9f9f9" }}>₹{selectedDispatchForPreview.amount.toFixed(2)}</td>
                </tr>
                {selectedDispatchForPreview.lossAmt !== undefined ? (
                  <>
                    <tr>
                      <td colSpan="3" style={{ fontSize: "9px" }}>
                        <strong>प्राप्त वजन:</strong> {selectedDispatchForPreview.compWeight} T (दर: ₹{selectedDispatchForPreview.compRate})
                      </td>
                      <td style={{ fontWeight: "bold", color: "red" }}>एकूण घट (Loss)</td>
                      <td style={{ textAlign: "center", fontWeight: "bold", color: "red" }}>-₹{selectedDispatchForPreview.lossAmt.toFixed(2)}</td>
                    </tr>
                    {selectedDispatchForPreview.compDamageCut > 0 || selectedDispatchForPreview.compMoistureCut > 0 || selectedDispatchForPreview.compOtherCut > 0 ? (
                      <tr>
                        <td colSpan="3" style={{ fontSize: "8.5px", color: "#555" }}>
                          <strong>कपात तपशील:</strong> {[
                            selectedDispatchForPreview.compDamageCut > 0 && `गुणवत्ता: ₹${selectedDispatchForPreview.compDamageCut}`,
                            selectedDispatchForPreview.compMoistureCut > 0 && `ओलावा: ₹${selectedDispatchForPreview.compMoistureCut}`,
                            selectedDispatchForPreview.compOtherCut > 0 && `इतर: ₹${selectedDispatchForPreview.compOtherCut}`
                          ].filter(Boolean).join(" | ")}
                        </td>
                        <td colSpan="2" style={{ border: "none" }}></td>
                      </tr>
                    ) : null}
                    <tr>
                      <td colSpan="3" style={{ border: "none" }}></td>
                      <td style={{ fontWeight: "bold", borderTop: "2px solid #000", background: "#f9f9f9" }}>मंजूर (Passed)</td>
                      <td style={{ textAlign: "center", fontWeight: "bold", borderTop: "2px solid #000", background: "#f9f9f9", color: "green" }}>₹{selectedDispatchForPreview.passedAmt.toFixed(2)}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td colSpan="3" style={{ border: "none" }}></td>
                      <td style={{ fontWeight: "bold" }}>अॅडव्हान्स</td>
                      <td style={{ textAlign: "center" }}>-</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ border: "none" }}></td>
                      <td style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>बाकी रु.</td>
                      <td style={{ textAlign: "center", fontWeight: "bold", borderTop: "2px solid #000" }}>₹{selectedDispatchForPreview.amount.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <div style={{ marginTop: "12px", border: "1px solid #ccc", padding: "6px", borderRadius: "4px", fontSize: "8.5px", background: "#fcfcfc" }}>
              <strong>K T TRADERS</strong> | Bank of Maharashtra, Nimgaon Br.<br />
              <strong>A/c No:</strong> 60484823811 | <strong>IFS Code:</strong> MAHB0000832
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "10px" }}>
              <div style={{ fontStyle: "italic", fontSize: "8.5px", alignSelf: "flex-end" }}>* संगणकीय प्रत</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "9px" }}>तर्फे: के.टी. ट्रेडर्स</div>
                <div style={{ borderTop: "1px solid #555", width: "80px", marginTop: "20px", display: "inline-block" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
