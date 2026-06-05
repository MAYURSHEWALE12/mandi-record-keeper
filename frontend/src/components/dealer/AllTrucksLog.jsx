import React, { useState } from "react";
import { FileText } from "lucide-react";
import CustomDropdown from "../common/CustomDropdown";

const AllTrucksLog = ({ orders = [], onShowInvoice, onSelectOrder }) => {
  const [truckFilterInterval, setTruckFilterInterval] = useState("all");
  const [truckFilterStartDate, setTruckFilterStartDate] = useState("");
  const [truckFilterEndDate, setTruckFilterEndDate] = useState("");

  const allDispatches = orders.flatMap(o => 
    (o.dispatches || []).map(d => ({
      ...d,
      dealerName: o.dealerName,
      orderId: o.id,
      poNo: o.poNo
    }))
  );
  allDispatches.sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredDispatches = allDispatches.filter(d => {
    if (!d.date) return true;
    const dDate = new Date(d.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (truckFilterInterval === "7days") {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      pastDate.setHours(0, 0, 0, 0);
      return dDate >= pastDate && dDate <= today;
    }
    if (truckFilterInterval === "30days") {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      pastDate.setHours(0, 0, 0, 0);
      return dDate >= pastDate && dDate <= today;
    }
    if (truckFilterInterval === "custom") {
      const start = truckFilterStartDate ? new Date(truckFilterStartDate) : null;
      const end = truckFilterEndDate ? new Date(truckFilterEndDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      
      if (start && end) {
        return dDate >= start && dDate <= end;
      } else if (start) {
        return dDate >= start;
      } else if (end) {
        return dDate <= end;
      }
    }
    return true;
  });

  const handleExportTrucksExcel = () => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Truck Loading Log</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Calibri, sans-serif; width: 100%; }
          th { background-color: #4E653C; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #c9c7c1; padding: 10px; font-size: 13px; }
          td { border: 1px solid #e8e6e0; padding: 8px; text-align: center; font-size: 12px; }
          tr:nth-child(even) { background-color: #fdfcf9; }
          .text-left { text-align: left; }
          .num-right { text-align: right; }
          .date-col { mso-number-format: "\\@"; text-align: center; }
        </style>
      </head>
      <body>
        <h2 style="color: #4E653C; font-family: sans-serif; margin-bottom: 15px;">🚚 ट्रक्स व वाहतूक लॉग (Truck Loading Statement)</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bill No</th>
              <th>Company Name</th>
              <th>PO No</th>
              <th>Truck No</th>
              <th>Crop Type</th>
              <th>Bags Count</th>
              <th>Loaded Weight (Tons)</th>
              <th>Received Weight (Tons)</th>
              <th>Rate</th>
              <th>Total Freight (₹)</th>
              <th>Paid Freight (₹)</th>
              <th>Due Freight (₹)</th>
              <th>Total Cutting (₹)</th>
              <th>Passed Amount (₹)</th>
              <th>Driver Name</th>
              <th>Driver Mobile</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredDispatches.forEach((d) => {
      const dueFreight = d.totalFreight && d.paidFreight ? (Number(d.totalFreight) - Number(d.paidFreight)).toFixed(2) : "";
      html += `
        <tr>
          <td class="date-col">${formatDate(d.date)}</td>
          <td>${d.billNo || d.bill_no || ""}</td>
          <td class="text-left" style="font-weight: bold; color: #2B2F2A;">${d.dealerName || ""}</td>
          <td>${d.poNo || ""}</td>
          <td style="font-weight: bold;">${d.truckNo || ""}</td>
          <td>${d.cropType || ""}</td>
          <td class="num-right">${d.bagsCount || ""}</td>
          <td class="num-right">${d.weight || ""}</td>
          <td class="num-right">${d.compWeight || ""}</td>
          <td class="num-right">₹${d.rate || ""}</td>
          <td class="num-right">₹${d.totalFreight || ""}</td>
          <td class="num-right">₹${d.paidFreight || ""}</td>
          <td class="num-right" style="color: ${Number(dueFreight) > 0 ? '#C94A4A' : '#2e7d32'}; font-weight: bold;">₹${dueFreight || "0.00"}</td>
          <td class="num-right" style="color: #C94A4A;">${d.lossAmt ? '₹' + d.lossAmt.toFixed(2) : ""}</td>
          <td class="num-right" style="font-weight: bold; color: #2e7d32;">${d.passedAmt || d.passedAmount ? '₹' + Number(d.passedAmt || d.passedAmount).toLocaleString("en-IN") : ""}</td>
          <td class="text-left">${d.driverName || ""}</td>
          <td class="date-col">${d.driverMobile || ""}</td>
          <td class="text-left">${d.note || ""}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `trucks_loading_log_${truckFilterInterval}.xls`;
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", borderBottom: "1px solid #E6E1D8", paddingBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>🚚 सर्व ट्रक्स व वाहतूक लॉग (All Trucks Log)</h2>
        <button className="primary-btn btn-success btn-sm" onClick={handleExportTrucksExcel} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          📥 एक्सेल डाउनलोड करा (Download Excel)
        </button>
      </div>

      <div className="card" style={{ padding: "14px 20px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", background: "#fcfbfa", border: "1px solid #e8e6e0", margin: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", color: "#4E653C" }}>कालावधी (Interval):</label>
          <CustomDropdown
            value={truckFilterInterval}
            onChange={(val) => {
              setTruckFilterInterval(val);
            }}
            options={[
              { value: "all", label: "सर्व लॉग (All)" },
              { value: "7days", label: "मागील ७ दिवस (Last 7 Days)" },
              { value: "30days", label: "मागील महिना (Last Month)" },
              { value: "custom", label: "सानुकूल तारीख (Custom)" }
            ]}
            style={{ minWidth: "210px", width: "210px" }}
          />
        </div>

        {truckFilterInterval === "custom" && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input 
              type="date" 
              className="filter-input" 
              value={truckFilterStartDate} 
              onChange={(e) => setTruckFilterStartDate(e.target.value)} 
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #c9c7c1", fontSize: "13px" }}
            />
            <span style={{ fontSize: "13px", color: "#828B7E" }}>ते</span>
            <input 
              type="date" 
              className="filter-input" 
              value={truckFilterEndDate} 
              onChange={(e) => setTruckFilterEndDate(e.target.value)} 
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #c9c7c1", fontSize: "13px" }}
            />
          </div>
        )}
      </div>

      <div className="card" style={{ padding: "20px", margin: 0 }}>
        {filteredDispatches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
            कोणताही ट्रक लोड केलेला नाही किंवा फिल्टर जुळला नाही.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="records-table" style={{ fontSize: "13px" }}>
              <thead>
                <tr>
                  <th>तारीख</th>
                  <th>कंपनी नाव</th>
                  <th>गाडी नंबर</th>
                  <th>माल प्रकार</th>
                  <th>लोड वजन (Tons)</th>
                  <th>मिळालेले वजन (Tons)</th>
                  <th>कटती / वजाती</th>
                  <th>Passed Value</th>
                  <th>कृती</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map((d) => {
                  const loadedWeight = Number(d.weight || 0);
                  const receivedWeight = d.compWeight ? Number(d.compWeight) : null;
                  const totalCuts = Number(d.compDamageCut || 0) + Number(d.compMoistureCut || 0) + Number(d.compOtherCut || 0);
                  
                  return (
                    <tr key={d.id}>
                      <td data-label="तारीख">{d.date}</td>
                      <td data-label="कंपनी नाव">
                        <strong>{d.dealerName}</strong>
                        {d.poNo && <span style={{ display: "block", fontSize: "11px", color: "#828B7E" }}>PO: {d.poNo}</span>}
                      </td>
                      <td data-label="गाडी नंबर"><strong>{d.truckNo}</strong></td>
                      <td data-label="माल प्रकार">{d.cropType}</td>
                      <td data-label="लोड वजन">{loadedWeight.toFixed(2)} Tons</td>
                      <td data-label="मिळालेले वजन">
                        {receivedWeight !== null ? `${receivedWeight.toFixed(2)} Tons` : <span style={{ color: "#828B7E" }}>प्रलंबित</span>}
                      </td>
                      <td data-label="कटती / वजाती">
                        {receivedWeight !== null ? (
                          <span style={{ fontSize: "11px", color: totalCuts > 0 ? "red" : "green" }}>
                            नुकसानी: ₹{d.compDamageCut || 0}<br />
                            ओलावा: ₹{d.compMoistureCut || 0}<br />
                            इतर: ₹{d.compOtherCut || 0}
                          </span>
                        ) : (
                          <span style={{ color: "#828B7E" }}>-</span>
                        )}
                      </td>
                      <td data-label="Passed Value">
                        {d.passedAmount ? (
                          <strong>₹{Number(d.passedAmount).toLocaleString("en-IN")}</strong>
                        ) : (
                          <span style={{ color: "#828B7E" }}>अंदाजे: ₹{(loadedWeight * Number(d.rate || 0)).toLocaleString("en-IN")}</span>
                        )}
                      </td>
                      <td data-label="कृती">
                        <button 
                          className="primary-btn btn-ghost btn-sm" 
                          style={{ padding: "4px 8px" }}
                          onClick={() => {
                            const o = orders.find(ord => ord.id === d.orderId);
                            if (o) {
                              onSelectOrder(o);
                              onShowInvoice(d);
                            } else {
                              alert("ऑर्डर सापडली नाही.");
                            }
                          }}
                        >
                          <FileText size={14} /> बिल
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTrucksLog;
