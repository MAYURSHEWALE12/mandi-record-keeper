import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API_URL from "../config";
import PageWrapper from "../components/layout/PageWrapper";
import { Truck, Plus, FileText, Trash2, ArrowLeft } from "lucide-react";

const DealerDashboard = () => {
  // States
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedDispatchForPreview, setSelectedDispatchForPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Order Form States
  const [poNo, setPoNo] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [place, setPlace] = useState("");
  const [village, setVillage] = useState("");
  const [totalOrderedWeight, setTotalOrderedWeight] = useState("");

  // Registered Companies States
  const [dealers, setDealers] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // orders, companies
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyPlace, setNewCompanyPlace] = useState("");
  const [newCompanyVillage, setNewCompanyVillage] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);

  // New Dispatch Form States
  const [dispatchBillNo, setDispatchBillNo] = useState("");
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [transportAgent, setTransportAgent] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [driverVillage, setDriverVillage] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [cropType, setCropType] = useState("मका");
  const [bagsCount, setBagsCount] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState("");
  const [moisture, setMoisture] = useState("");
  const [freightRate, setFreightRate] = useState("");
  const [paidFreight, setPaidFreight] = useState("");
  const [note, setNote] = useState("");

  const invoiceRef = useRef();

  // Load orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/dealer-orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dealer orders:", err);
      setLoading(false);
    }
  };

  const fetchDealers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dealers`);
      const data = await res.json();
      setDealers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching dealers:", err);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName) {
      alert("कृपया कंपनीचे नाव भरा.");
      return;
    }

    try {
      setCompanyLoading(true);
      const res = await fetch(`${API_URL}/api/dealers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCompanyName,
          place: newCompanyPlace,
          village: newCompanyVillage,
        }),
      });

      const data = await res.json();
      setCompanyLoading(false);

      if (res.ok) {
        alert("नवीन कंपनी यशस्वीरित्या नोंदवली ✅");
        setNewCompanyName("");
        setNewCompanyPlace("");
        setNewCompanyVillage("");
        fetchDealers();
      } else {
        alert(data.error || "कंपनी सेव्ह करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      setCompanyLoading(false);
      alert("सर्व्हरशी संपर्क होऊ शकला नाही.");
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही कंपनी यादीतून हटवायची आहे?")) return;

    try {
      const res = await fetch(`${API_URL}/api/dealers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("कंपनी यशस्वीरित्या हटवली ✅");
        fetchDealers();
      } else {
        alert("कंपनी हटवताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDealers();
  }, []);

  // Fetch full details of selected order (including dispatches)
  const loadOrderDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${id}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  const handleOrderSelect = (orderId) => {
    loadOrderDetails(orderId);
  };

  // Submit New Order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    if (!dealerName || !totalOrderedWeight) {
      alert("कृपया आवश्यक माहिती भरा.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poNo,
          dealerName,
          place,
          village,
          totalOrderedWeight: Number(totalOrderedWeight),
        }),
      });

      if (res.ok) {
        alert("डीलर ऑर्डर यशस्वीरित्या तयार केली ✅");
        setPoNo("");
        setDealerName("");
        setPlace("");
        setVillage("");
        setTotalOrderedWeight("");
        setShowOrderForm(false);
        fetchOrders();
      } else {
        alert("ऑर्डर सेव्ह करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क होऊ शकला नाही.");
    }
  };

  // Submit New Dispatch
  const handleAddDispatch = async (e) => {
    e.preventDefault();
    if (!truckNo || !weight || !rate) {
      alert("कृपया ट्रक नंबर, वजन आणि भाव भरा.");
      return;
    }

    const calculatedAmount = Number(weight) * Number(rate);
    const calculatedTotalFreight = bagsCount && freightRate ? Number(bagsCount) * Number(freightRate) : 0;
    const calculatedDueFreight = calculatedTotalFreight - Number(paidFreight || 0);

    const dispatchData = {
      billNo: dispatchBillNo ? Number(dispatchBillNo) : undefined,
      date: dispatchDate,
      deliveryPlace,
      brokerName,
      transportAgent,
      truckNo,
      ownerName,
      driverName,
      driverLicense,
      driverVillage,
      driverMobile,
      cropType,
      bagsCount: bagsCount ? Number(bagsCount) : undefined,
      weight: Number(weight),
      rate: Number(rate),
      amount: calculatedAmount,
      moisture: moisture ? Number(moisture) : undefined,
      freightRate: freightRate ? Number(freightRate) : undefined,
      totalFreight: calculatedTotalFreight || undefined,
      paidFreight: paidFreight ? Number(paidFreight) : undefined,
      dueFreight: calculatedDueFreight || undefined,
      note,
    };

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${selectedOrder.id}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dispatchData),
      });

      if (res.ok) {
        alert("ट्रक लोडिंग नोंद यशस्वी झाली ✅");
        // Reset form
        setDispatchBillNo("");
        setDeliveryPlace("");
        setBrokerName("");
        setTransportAgent("");
        setTruckNo("");
        setOwnerName("");
        setDriverName("");
        setDriverLicense("");
        setDriverVillage("");
        setDriverMobile("");
        setBagsCount("");
        setWeight("");
        setRate("");
        setMoisture("");
        setFreightRate("");
        setPaidFreight("");
        setNote("");
        setShowDispatchForm(false);
        // Refresh Order dispatches
        loadOrderDetails(selectedOrder.id);
        fetchOrders();
      } else {
        alert("लोडिंग नोंद सेव्ह करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Dispatch
  const handleDeleteDispatch = async (dispatchId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही नोंद हटवायची आहे?")) return;

    try {
      const res = await fetch(`${API_URL}/api/dealer-dispatches/${dispatchId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("नोंद यशस्वीरित्या हटवली ✅");
        loadOrderDetails(selectedOrder.id);
        fetchOrders();
      } else {
        alert("नोंद हटवताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PDF Download for Bill
  const downloadReceiptPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF in A4 landscape format as it holds two vertical slips side-by-side
    const pdf = new jsPDF("l", "mm", "a4");
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Truck_Loading_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  // Total stats for dealer portal
  const totalOrdersCount = orders.length;
  const totalOrderedTons = orders.reduce((sum, o) => sum + (o.totalOrderedWeight || 0), 0);
  const totalFulfilledTons = orders.reduce((sum, o) => sum + (o.fulfilledWeight || 0), 0);
  const totalPendingTons = Math.max(0, totalOrderedTons - totalFulfilledTons);

  return (
    <PageWrapper title="🚚 डीलर ऑर्डर्स व ट्रक लोडिंग व्यवस्थापन">
      
      {/* Analytics Grid */}
      <div className="stats-grid" style={{ marginBottom: "30px" }}>
        <div className="stat-card" style={{ borderLeft: "4px solid #4E653C" }}>
          <h3>एकूण डीलर ऑर्डर्स</h3>
          <p>{totalOrdersCount}</p>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #D49A2E" }}>
          <h3>एकूण ऑर्डर वजन (Tons)</h3>
          <p>{totalOrderedTons.toFixed(2)} T</p>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #2e7d32" }}>
          <h3>पूर्ण झालेले वजन (Tons)</h3>
          <p style={{ color: "#2e7d32" }}>{totalFulfilledTons.toFixed(2)} T</p>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid #C94A4A" }}>
          <h3>बाकी वजन (Tons)</h3>
          <p style={{ color: "#C94A4A" }}>{totalPendingTons.toFixed(2)} T</p>
        </div>
      </div>

      {/* Tab Navigation */}
      {!selectedOrder && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "2px solid #E6E1D8", paddingBottom: "10px" }}>
          <button 
            className={`primary-btn ${activeTab === "orders" ? "" : "btn-ghost"}`}
            onClick={() => { setActiveTab("orders"); setSelectedCompanyFilter(""); }}
            style={{ padding: "8px 16px" }}
          >
            📄 डीलर ऑर्डर्स
          </button>
          <button 
            className={`primary-btn ${activeTab === "companies" ? "" : "btn-ghost"}`}
            onClick={() => setActiveTab("companies")}
            style={{ padding: "8px 16px" }}
          >
            🏢 कंपनी नोंदणी / यादी
          </button>
        </div>
      )}

      {/* Conditional Rendering: Main Dashboard or Selected Order Details */}
      {!selectedOrder ? (
        activeTab === "orders" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Header Action & Filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>डीलर ऑर्डर्स यादी (Dealers)</h2>
                
                {/* Company Filter Dropdown */}
                <select 
                  className="filter-input" 
                  value={selectedCompanyFilter} 
                  onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                  style={{ margin: 0, height: "38px" }}
                >
                  <option value="">सर्व कंपन्या (All Companies)</option>
                  {dealers.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <button className="primary-btn" onClick={() => setShowOrderForm(true)}>
                <Plus size={16} /> नवीन ऑर्डर नोंदवा (Add Order)
              </button>
            </div>

            {/* Orders List Layout */}
            {loading ? (
              <div style={{ padding: "50px", textAlign: "center", color: "#828B7E" }}>🔄 ऑर्डर्स लोड होत आहेत...</div>
            ) : orders.filter(o => !selectedCompanyFilter || o.dealerName === selectedCompanyFilter).length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                नोंदवलेली कोणतीही डीलर ऑर्डर सापडली नाही.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {orders
                  .filter(o => !selectedCompanyFilter || o.dealerName === selectedCompanyFilter)
                  .map((o) => {
                    const fulfilledWt = o.fulfilledWeight || 0;
                    const orderedWt = o.totalOrderedWeight || 0;
                    const pct = orderedWt > 0 ? (fulfilledWt / orderedWt) * 100 : 0;
                    return (
                      <div key={o.id} className="card" style={{ margin: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid #E6E1D8", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span style={{ fontSize: "12px", color: "#828B7E", fontWeight: "600", textTransform: "uppercase" }}>P.O. नं: {o.poNo || "N/A"}</span>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#2B2F2A", margin: "2px 0 0 0" }}>{o.dealerName}</h3>
                          </div>
                          <span className={`badge ${o.status === "fulfilled" ? "badge-paid" : o.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                            {o.status === "fulfilled" ? "पूर्ण" : o.status === "partially_fulfilled" ? "अंशतः पूर्ण" : "बाकी"}
                          </span>
                        </div>

                        <div style={{ fontSize: "14px", color: "#4A5148" }}>
                          📍 <strong>ठिकाण:</strong> {o.place || "-"}, {o.village || "-"}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginTop: "5px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#828B7E", marginBottom: "4px" }}>
                            <span>प्रगती (Progress)</span>
                            <span>{fulfilledWt.toFixed(1)} / {orderedWt.toFixed(1)} Tons ({pct.toFixed(0)}%)</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "#F0EDE6", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: o.status === "fulfilled" ? "#2e7d32" : "#4E653C" }}></div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                          <button className="primary-btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleOrderSelect(o.id)}>
                            तपशील & ट्रक नोंदी 📜
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          /* COMPANY REGISTRATION & MANAGEMENT TAB */
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {/* Left Column: Register New Company */}
            <div className="card" style={{ flex: "1 1 320px", margin: 0, padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px", marginBottom: "15px" }}>
                🏢 नवीन कंपनी नोंदणी
              </h3>
              <form onSubmit={handleAddCompany} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label>कंपनी / डीलर नाव (Company Name) *</label>
                  <input 
                    type="text" 
                    placeholder="उदा. मे. के.टी. सिमेंट्स" 
                    value={newCompanyName} 
                    onChange={(e) => setNewCompanyName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>शहर / तालुका (Place)</label>
                  <input 
                    type="text" 
                    placeholder="उदा. मालेगाव" 
                    value={newCompanyPlace} 
                    onChange={(e) => setNewCompanyPlace(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>गांव (Village)</label>
                  <input 
                    type="text" 
                    placeholder="उदा. निमगाव" 
                    value={newCompanyVillage} 
                    onChange={(e) => setNewCompanyVillage(e.target.value)} 
                  />
                </div>
                <button type="submit" className="primary-btn" style={{ justifyContent: "center", marginTop: "10px" }} disabled={companyLoading}>
                  {companyLoading ? "नोंदणी होत आहे..." : "कंपनी जतन करा (Register)"}
                </button>
              </form>
            </div>

            {/* Right Column: Registered Companies List */}
            <div className="card" style={{ flex: "2 1 500px", margin: 0, padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px", marginBottom: "15px" }}>
                नोंदणीकृत कंपन्यांची यादी ({dealers.length})
              </h3>
              {dealers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                  अजून कोणतीही कंपनी नोंदणीकृत केलेली नाही.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>कंपनीचे नाव</th>
                        <th>शहर/तालुका</th>
                        <th>गांव</th>
                        <th style={{ width: "20%" }}>कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealers.map((d) => (
                        <tr key={d.id}>
                          <td data-label="कंपनीचे नाव" style={{ textAlign: "left" }}>
                            <button 
                              onClick={() => {
                                setSelectedCompanyFilter(d.name);
                                setActiveTab("orders");
                              }}
                              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                              title="या कंपनीच्या ऑर्डर्स पहा"
                            >
                              {d.name}
                            </button>
                          </td>
                          <td data-label="शहर/तालुका">{d.place || "-"}</td>
                          <td data-label="गांव">{d.village || "-"}</td>
                          <td data-label="कृती">
                            <button 
                              className="primary-btn btn-danger btn-sm" 
                              style={{ padding: "4px 8px", background: "#C94A4A", margin: "0 auto" }}
                              onClick={() => handleDeleteCompany(d.id)}
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
          </div>
        )
      ) : (
        /* Selected Order Details Portal */
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Back button and title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="back-btn" onClick={() => setSelectedOrder(null)}>
              <ArrowLeft size={16} /> ऑर्डर्स यादीकडे जा
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>
              {selectedOrder.dealerName} — ऑर्डर्स व ट्रक लोडिंग रेकॉर्ड्स
            </h2>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            
            {/* Left Column: Order stats & details */}
            <div className="card" style={{ flex: "1 1 300px", margin: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px" }}>ऑर्डर सारांश</h3>
              <p style={{ margin: 0 }}><strong>P.O. क्रमांक:</strong> {selectedOrder.poNo || "N/A"}</p>
              <p style={{ margin: 0 }}><strong>डीलर नाव:</strong> {selectedOrder.dealerName}</p>
              <p style={{ margin: 0 }}><strong>पत्ता:</strong> {selectedOrder.place} / {selectedOrder.village}</p>
              <p style={{ margin: 0 }}><strong>एकूण ऑर्डर वजन:</strong> {selectedOrder.totalOrderedWeight || 0} Tons</p>
              <p style={{ margin: 0 }}><strong>पाठवलेले एकूण वजन:</strong> {selectedOrder.fulfilledWeight || 0} Tons</p>
              <p style={{ margin: 0 }}><strong>बाकी वजन:</strong> {selectedOrder.remainingWeight || 0} Tons</p>
              <p style={{ margin: 0 }}>
                <strong>स्थिती:</strong> 
                <span style={{ marginLeft: "6px" }} className={`badge ${selectedOrder.status === "fulfilled" ? "badge-paid" : selectedOrder.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                  {selectedOrder.status === "fulfilled" ? "पूर्ण" : selectedOrder.status === "partially_fulfilled" ? "अंशतः पूर्ण" : "प्रलंबित"}
                </span>
              </p>

              <button className="primary-btn" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} onClick={() => setShowDispatchForm(true)}>
                <Truck size={16} /> नवीन ट्रक लोड करा (Dispatch Truck)
              </button>
            </div>

            {/* Right Column: Dispatch History list */}
            <div className="card" style={{ flex: "2 1 500px", margin: 0, padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px", marginBottom: "15px" }}>
                पाठवलेल्या ट्रक्स नोंदी (Dispatch Log)
              </h3>

              {!selectedOrder.dispatches || selectedOrder.dispatches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                  या ऑर्डरवर अजून कोणताही ट्रक लोड केला नाही.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>बिल नं.</th>
                        <th>तारीख</th>
                        <th>गाडी नंबर</th>
                        <th>माल प्रकार</th>
                        <th>वजन (Tons)</th>
                        <th>भाडे</th>
                        <th>कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.dispatches.map((d) => (
                        <tr key={d.id}>
                          <td data-label="बिल नं.">{d.billNo}</td>
                          <td data-label="तारीख">{d.date}</td>
                          <td data-label="गाडी नंबर"><strong>{d.truckNo}</strong></td>
                          <td data-label="माल प्रकार">{d.cropType}</td>
                          <td data-label="वजन">{d.weight} Tons</td>
                          <td data-label="भाडे">
                            <span style={{ fontSize: "11px", color: "#828B7E" }}>
                              एकूण: ₹{d.totalFreight || 0}<br />
                              बाकी: <span style={{ color: d.due_freight > 0 ? "red" : "green" }}>₹{d.due_freight || 0}</span>
                            </span>
                          </td>
                          <td data-label="कृती">
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button 
                                className="primary-btn btn-ghost btn-sm" 
                                style={{ padding: "4px 8px" }}
                                onClick={() => {
                                  setSelectedDispatchForPreview(d);
                                  setShowInvoicePreview(true);
                                }}
                              >
                                <FileText size={14} /> बिल
                              </button>
                              <button 
                                className="primary-btn btn-danger btn-sm" 
                                style={{ padding: "4px 8px", background: "#C94A4A" }}
                                onClick={() => handleDeleteDispatch(d.id)}
                              >
                                <Trash2 size={14} /> हटवा
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW ORDER FORM */}
      {showOrderForm && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="card modal-content" style={styles.modalContent}>
            <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px" }}>नवीन डीलर ऑर्डर नोंदणी</h2>
            <form onSubmit={handleAddOrder} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label>P.O. क्रमांक (P.O. Number)</label>
                <input type="text" placeholder="उदा. PO-12345" value={poNo} onChange={(e) => setPoNo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>डीलर / कंपनीचे नाव (Company Name) *</label>
                <select
                  value={dealerName}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    setDealerName(selectedName);
                    const found = dealers.find(d => d.name === selectedName);
                    if (found) {
                      setPlace(found.place || "");
                      setVillage(found.village || "");
                    } else {
                      setPlace("");
                      setVillage("");
                    }
                  }}
                  required
                >
                  <option value="">कंपनी निवडा (Select Registered Company)</option>
                  {dealers.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: "11px", color: "#828B7E", marginTop: "4px" }}>
                  (नवीन कंपनी जोडण्यासाठी 'कंपनी नोंदणी / यादी' टॅब वापरा)
                </span>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>ठिकाण (City/Taluka)</label>
                  <input type="text" placeholder="उदा. मालेगाव" value={place} onChange={(e) => setPlace(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>गांव (Village)</label>
                  <input type="text" placeholder="उदा. निमगाव" value={village} onChange={(e) => setVillage(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>एकूण वजन ऑर्डर (Tons मध्ये)</label>
                <input type="number" step="any" placeholder="उदा. 200" value={totalOrderedWeight} onChange={(e) => setTotalOrderedWeight(e.target.value)} required />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: "center" }}>ऑर्डर जतन करा</button>
                <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowOrderForm(false)}>रद्द करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW TRUCK DISPATCH (TRUCK LOADING) FORM */}
      {showDispatchForm && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="card modal-content" style={{ ...styles.modalContent, maxWidth: "750px" }}>
            <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
              🚚 नवीन गाडी (ट्रक) लोडिंग नोंदणी
            </h2>
            <form onSubmit={handleAddDispatch} style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "80vh", overflowY: "auto", paddingRight: "10px" }}>
              
              <h4 style={{ color: "#4E653C", borderBottom: "1px dashed #E6E1D8", paddingBottom: "4px" }}>१. पावती & वाहतूक तपशील</h4>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>बिल क्रमांक (Bill No. - optional)</label>
                  <input type="number" placeholder="रिकामे ठेवल्यास ऑटो-जनरेट होईल" value={dispatchBillNo} onChange={(e) => setDispatchBillNo(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>दिनांक (Date)</label>
                  <input type="date" value={dispatchDate} onChange={(e) => setDispatchDate(e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>डिलिव्हरी ठिकाण (Delivery Place)</label>
                  <input type="text" placeholder="उदा. निमगाव ब्र." value={deliveryPlace} onChange={(e) => setDeliveryPlace(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>दलाल नाव (Broker Name)</label>
                  <input type="text" placeholder="उदा. शामकांत" value={brokerName} onChange={(e) => setBrokerName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>ट्रान्सपोर्ट एजंट (Transport Agent)</label>
                  <input type="text" placeholder="उदा. के.टी. ट्रान्सपोर्ट" value={transportAgent} onChange={(e) => setTransportAgent(e.target.value)} />
                </div>
              </div>

              <h4 style={{ color: "#4E653C", borderBottom: "1px dashed #E6E1D8", paddingBottom: "4px", marginTop: "10px" }}>२. वाहन व ड्रायव्हर माहिती</h4>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>गाडी नंबर (Truck No.)</label>
                  <input type="text" placeholder="MH-41-AB-1234" value={truckNo} onChange={(e) => setTruckNo(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>मालकाचे नाव (Owner Name)</label>
                  <input type="text" placeholder="उदा. राहुल पाटील" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>ड्रायव्हर नाव (Driver Name)</label>
                  <input type="text" placeholder="उदा. सोपान देवरे" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>ड्रायव्हर मो. नंबर (Driver Mobile)</label>
                  <input type="text" maxLength="10" placeholder="१० अंकी नंबर" value={driverMobile} onChange={(e) => setDriverMobile(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>लायसन्स नं. (License No.)</label>
                  <input type="text" placeholder="DL-123456" value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>ड्रायव्हरचे गांव (Driver Village)</label>
                  <input type="text" placeholder="उदा. नांदगाव" value={driverVillage} onChange={(e) => setDriverVillage(e.target.value)} />
                </div>
              </div>

              <h4 style={{ color: "#4E653C", borderBottom: "1px dashed #E6E1D8", paddingBottom: "4px", marginTop: "10px" }}>३. मालाचा तपशील व रक्कम</h4>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>मालाचा प्रकार (Crop Type)</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
                    <option>मका</option>
                    <option>गहू</option>
                    <option>कांदा</option>
                    <option>ज्वारी</option>
                    <option>बाजरी</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>नग / गोण्या (Bags)</label>
                  <input type="number" placeholder="उदा. 400" value={bagsCount} onChange={(e) => setBagsCount(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Moisture %</label>
                  <input type="number" step="any" placeholder="उदा. 14" value={moisture} onChange={(e) => setMoisture(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>निव्वळ वजन (Tons मध्ये)</label>
                  <input type="number" step="any" placeholder="उदा. 25.4" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>भाव (₹ / क्विंटल किंवा टन)</label>
                  <input type="number" placeholder="उदा. 2200" value={rate} onChange={(e) => setRate(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>मालाची रक्कम (₹ - ऑटो)</label>
                  <input type="number" value={weight && rate ? (Number(weight) * Number(rate) * 10).toFixed(2) : 0} readOnly style={{ background: "#f7f5ef" }} />
                </div>
              </div>

              <h4 style={{ color: "#4E653C", borderBottom: "1px dashed #E6E1D8", paddingBottom: "4px", marginTop: "10px" }}>४. भाडे हिशोब (Freight details)</h4>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>भाडे दर (₹ / गोणी किंवा टन)</label>
                  <input type="number" placeholder="उदा. 80" value={freightRate} onChange={(e) => setFreightRate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>पैकी येथे दिले / ॲडव्हान्स (₹)</label>
                  <input type="number" placeholder="उदा. 5000" value={paidFreight} onChange={(e) => setPaidFreight(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>भाडे देणे बाकी (₹ - ऑटो)</label>
                  <input 
                    type="number" 
                    value={bagsCount && freightRate ? (Number(bagsCount) * Number(freightRate) - Number(paidFreight || 0)).toFixed(2) : 0} 
                    readOnly 
                    style={{ background: "#f7f5ef" }} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>टिप / नोट (Note)</label>
                <input type="text" placeholder="उदा. रस्त्यात वजन तपासून घ्यावे." value={note} onChange={(e) => setNote(e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: "center" }}>लोडिंग जतन करा</button>
                <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowDispatchForm(false)}>रद्द करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DOUBLE BILL PREVIEW MODAL */}
      {showInvoicePreview && selectedDispatchForPreview && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="card modal-content" style={{ ...styles.modalContent, maxWidth: "1100px", padding: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>पावती बिल प्रिव्ह्यू (Invoice Double Slip Preview)</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="primary-btn btn-success" onClick={downloadReceiptPDF}>पीडीएफ डाउनलोड (Download PDF)</button>
                <button className="primary-btn btn-ghost" onClick={() => setShowInvoicePreview(false)}>बंद करा (Close)</button>
              </div>
            </div>

            {/* Visual Double Slip Layout matching the uploaded bill image */}
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
                width: "1050px", // A4 Landscape ratio-friendly width
                margin: "0 auto",
                boxSizing: "border-box"
              }}
            >
              
              {/* SLIP LEFT: TRANSPORT FREIGHT RECEIPT */}
              <div style={styles.billSlipLeft}>
                
                {/* Header */}
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
                  <strong>बिल नं. / P.O. No:</strong> <span style={styles.fieldValue}>{selectedOrder.poNo || "N/A"}</span>
                </div>
                <div style={styles.slipFieldLine}>
                  <strong>श्रीमान:</strong> <span style={styles.fieldValue}>{selectedOrder.dealerName}</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                    <strong>ठिकाण:</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.deliveryPlace || selectedOrder.place}</span>
                  </div>
                  <div style={{ ...styles.slipFieldLine, flex: 1 }}>
                    <strong>गांव:</strong> <span style={styles.fieldValue}>{selectedOrder.village}</span>
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

                {/* Table for Left Slip */}
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
              <div style={styles.billSlipRight}>
                
                {/* Header */}
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
                  <strong>मे. (Company Name):</strong> <span style={styles.fieldValue}>{selectedOrder.dealerName}</span>
                </div>
                <div style={styles.slipFieldLine}>
                  <strong>डिलिव्हरी (Delivery):</strong> <span style={styles.fieldValue}>{selectedDispatchForPreview.deliveryPlace || selectedOrder.place}</span>
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

                {/* Table for Right Slip */}
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
                        <strong>P.O. NO:</strong> {selectedOrder.poNo || "N/A"}<br />
                        <strong>Moisture:</strong> {selectedDispatchForPreview.moisture ? `${selectedDispatchForPreview.moisture}%` : "-"}
                      </td>
                      <td style={{ fontWeight: "bold", background: "#f9f9f9" }}>एकूण (Total)</td>
                      <td style={{ textAlign: "center", fontWeight: "bold", background: "#f9f9f9" }}>₹{selectedDispatchForPreview.amount.toFixed(2)}</td>
                    </tr>
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
                  </tbody>
                </table>

                {/* Bank Details */}
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
      )}

    </PageWrapper>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(44, 53, 36, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
  },
  modalContent: {
    width: "100%",
    maxWidth: "500px",
    background: "#ffffff",
    maxHeight: "95vh",
    overflowY: "auto",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
    margin: 0,
  },
  billSlipLeft: {
    flex: 1,
    padding: "10px",
    boxSizing: "border-box"
  },
  billSlipRight: {
    flex: 1,
    padding: "10px",
    boxSizing: "border-box"
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

// Add standard inline CSS styles to inject direct table styling on receiptTable
const injectStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .receipt-table-style table {
      width: 100%;
      border-collapse: collapse;
    }
    table {
      border-collapse: collapse;
    }
  `;
  document.head.appendChild(style);
};
injectStyles();

export default DealerDashboard;
