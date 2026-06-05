import React, { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import PageWrapper from "../components/layout/PageWrapper";
import { Plus, Trash2, ArrowLeft, Truck, FileText } from "lucide-react";

import DealerStatsCards from "../components/dealer/DealerStatsCards";
import DealerOrderForm from "../components/dealer/DealerOrderForm";
import DispatchForm from "../components/dealer/DispatchForm";
import CompanyProfile from "../components/dealer/CompanyProfile";
import CuttingModal from "../components/dealer/CuttingModal";
import PaymentModal from "../components/dealer/PaymentModal";
import InvoicePreview from "../components/dealer/InvoicePreview";
import AllTrucksLog from "../components/dealer/AllTrucksLog";

const DealerDashboard = () => {
  // Navigation / Tabs State
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("dealer_activeTab") || "orders";
  });

  // Data States
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDealers, setLoadingDealers] = useState(true);

  // Selected entities for drill-down views
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [profileTab, setProfileTab] = useState("orders");

  // Stock States
  const [availableStockTons, setAvailableStockTons] = useState(0);
  const [availableStockQuintals, setAvailableStockQuintals] = useState(0);

  // Form States for Registering Company
  const [newName, setNewName] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [savingDealer, setSavingDealer] = useState(false);

  // Modal Visibility States
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showCuttingModal, setShowCuttingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Modal Specific Data States
  const [selectedDispatchForPreview, setSelectedDispatchForPreview] = useState(null);
  const [selectedDispatchForCutting, setSelectedDispatchForCutting] = useState(null);
  const [cuttingDispatchOrderId, setCuttingDispatchOrderId] = useState(null);
  const [paymentOrderId, setPaymentOrderId] = useState("");

  // Fetching Data
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get(`/api/dealer-orders`);
      const data = res.data;
      setOrders(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching dealer orders:", err);
      toast.error("ऑर्डर्स लोड करताना एरर आला.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchDealers = async () => {
    try {
      setLoadingDealers(true);
      const res = await api.get("/api/dealers");
      const data = res.data;
      setDealers(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching dealers:", err);
    } finally {
      setLoadingDealers(false);
    }
  };

  const fetchAvailableStock = async () => {
    try {
      const res = await api.get("/api/dealer-orders/available-stock");
      if (res.data) {
        setAvailableStockTons(res.data.availableStockTons || 0);
        setAvailableStockQuintals(res.data.availableStockQuintals || 0);
      }
    } catch (err) {
      console.error("Error fetching available stock:", err);
    }
  };

  const loadOrderDetails = async (id) => {
    try {
      const res = await api.get(`/api/dealer-orders/${id}`);
      const data = res.data?.data || res.data;
      setSelectedOrder(data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  // Lifecycle Hooks
  useEffect(() => {
    fetchOrders();
    fetchDealers();
    fetchAvailableStock();
  }, []);

  // Listen to sidebar & layout navigation changes
  useEffect(() => {
    const handleTabChange = () => {
      const tab = localStorage.getItem("dealer_activeTab") || "orders";
      setActiveTab(tab);

      // Check if another component requested showing an order
      const savedOrder = localStorage.getItem("dealer_selectedOrder");
      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          setSelectedOrder(parsed);
          localStorage.removeItem("dealer_selectedOrder");
        } catch (e) {
          console.error(e);
        }
      } else {
        const savedCompany = localStorage.getItem("dealer_selectedCompany");
        if (savedCompany) {
          try {
            setSelectedCompany(JSON.parse(savedCompany));
            localStorage.removeItem("dealer_selectedCompany");
          } catch (e) {
            console.error(e);
          }
        } else {
          // Reset internal views when switching base tabs
          setSelectedOrder(null);
          setSelectedCompany(null);
        }
      }
    };

    window.addEventListener("dealer-tab-changed", handleTabChange);
    return () => window.removeEventListener("dealer-tab-changed", handleTabChange);
  }, []);

  // Action Handlers
  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("कंपनीचे नाव भरा.");
      return;
    }
    try {
      setSavingDealer(true);
      await api.post("/api/dealers", { name: newName, place: newPlace, village: newVillage });
      toast.success("नवीन कंपनी नोंदवली ✅");
      setNewName("");
      setNewPlace("");
      setNewVillage("");
      fetchDealers();
    } catch (err) {
      toast.error("कंपनी नोंदणी अयशस्वी झाली.");
    } finally {
      setSavingDealer(false);
    }
  };

  const handleDeleteDealer = async (id) => {
    if (!window.confirm("ही कंपनी कायमची हटवायची आहे?")) return;
    try {
      await api.delete(`/api/dealers/${id}`);
      toast.success("कंपनी हटवली ✅");
      fetchDealers();
    } catch (err) {
      toast.error("कंपनी हटवताना चूक झाली.");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("ही ऑर्डर कायमची हटवायची आहे?")) return;
    try {
      await api.delete(`/api/dealer-orders/${id}`);
      toast.success("ऑर्डर यशस्वीरित्या हटवली ✅");
      setSelectedOrder(null);
      fetchOrders();
      fetchAvailableStock();
    } catch (err) {
      toast.error("ऑर्डर हटवताना एरर आला.");
    }
  };

  const handleDeleteDispatch = async (dispatchId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही नोंद हटवायची आहे?")) return;
    try {
      const res = await api.delete(`/api/dealer-dispatches/${dispatchId}`);
      if (res.status === 200) {
        toast.success("वाहतूक नोंद यशस्वीरित्या हटवली ✅");
        if (selectedOrder) {
          loadOrderDetails(selectedOrder.id);
        }
        fetchOrders();
        fetchAvailableStock();
      }
    } catch (err) {
      console.error(err);
      toast.error("नोंद हटवताना चूक झाली.");
    }
  };

  const handleDeletePayment = async (orderId, paymentId) => {
    if (!window.confirm("हा पेमेंट व्यवहार हटवायचा आहे?")) return;
    try {
      const res = await api.delete(`/api/dealer-orders/${orderId}/payment/${paymentId}`);
      if (res.status === 200) {
        toast.success("पेमेंट व्यवहार हटवला ✅");
        fetchOrders();
        // If we are looking at a company profile, let it refresh
      }
    } catch (err) {
      console.error(err);
      toast.error("पेमेंट हटवताना एरर आला.");
    }
  };

  // Calculations for Stats
  const totalOrdersCount = orders.length;
  const totalOrderedTons = orders.reduce((sum, o) => sum + (o.totalOrderedWeight || 0), 0);
  const totalFulfilledTons = orders.reduce((sum, o) => sum + (o.fulfilledWeight || 0), 0);
  const totalPendingTons = Math.max(0, totalOrderedTons - totalFulfilledTons);

  // All Payments computation for "सर्व पेमेंट्स" tab
  const allPayments = orders.flatMap(o =>
    (o.payments || []).map(p => ({
      ...p,
      orderId: o.id,
      dealerName: o.dealerName,
      poNo: o.poNo
    }))
  );
  allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <PageWrapper title="🚚 डीलर ऑर्डर्स व ट्रक लोडिंग व्यवस्थापन">
      
      {/* ── TAB: All Trucks Log ── */}
      {activeTab === "all_trucks" && (
        <AllTrucksLog 
          orders={orders}
          onShowInvoice={(d) => {
            setSelectedDispatchForPreview(d);
            setShowInvoicePreview(true);
          }}
          onSelectOrder={(o) => {
            setSelectedOrder(o);
          }}
        />
      )}

      {/* ── TAB: All Payments ── */}
      {activeTab === "all_payments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E6E1D8", paddingBottom: "14px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>💰 सर्व जमा पेमेंट्स रेकॉर्ड्स (All Payments Log)</h2>
          </div>
          <div className="card" style={{ padding: "20px", margin: 0 }}>
            {allPayments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>कोणताही पेमेंट व्यवहार व्यवहार नोंदवलेला नाही.</div>
            ) : (
              <div className="table-responsive">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>दिनांक (Date)</th>
                      <th>कंपनीचे नाव (Company Name)</th>
                      <th>P.O. नं. (PO)</th>
                      <th>पेमेंट प्रकार (Mode)</th>
                      <th>रेफरन्स (Ref No)</th>
                      <th>तपशील / नोट (Note)</th>
                      <th>रक्कम (Amount)</th>
                      <th>कृती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayments.map(p => (
                      <tr key={p.id}>
                        <td data-label="दिनांक">{p.date}</td>
                        <td data-label="कंपनी"><strong>{p.dealerName}</strong></td>
                        <td data-label="P.O.">{p.poNo || "N/A"}</td>
                        <td data-label="प्रकार">{p.mode}</td>
                        <td data-label="रेफरन्स">{p.refNo || "-"}</td>
                        <td data-label="नोट">{p.note || "-"}</td>
                        <td data-label="रक्कम" style={{ fontWeight: "bold", color: "#2e7d32" }}>
                          ₹{Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td data-label="कृती">
                          <button
                            className="primary-btn btn-danger btn-sm"
                            style={{ padding: "4px 8px", background: "#C94A4A" }}
                            onClick={() => handleDeletePayment(p.orderId, p.id)}
                          >
                            <Trash2 size={13} /> हटवा
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
      )}

      {/* ── TAB: Companies ── */}
      {activeTab === "companies" && (
        selectedCompany ? (
          <CompanyProfile 
            selectedCompany={selectedCompany}
            orders={orders}
            profileTab={profileTab}
            onSetProfileTab={setProfileTab}
            onBack={() => setSelectedCompany(null)}
            onOpenCuttingModal={(d, orderId) => {
              setSelectedDispatchForCutting(d);
              setCuttingDispatchOrderId(orderId);
              setShowCuttingModal(true);
            }}
            onShowInvoice={(d) => {
              setSelectedDispatchForPreview(d);
              setShowInvoicePreview(true);
            }}
            onOpenPayment={(orderId) => {
              setPaymentOrderId(orderId);
              setShowPaymentModal(true);
            }}
            onDeletePayment={handleDeletePayment}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Register Form */}
            <div className="card">
              <h3 style={{ marginBottom: "16px" }}>नवीन कंपनी / डीलर नोंदणी</h3>
              <form onSubmit={handleRegisterCompany} style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 200px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>कंपनीचे नाव (Company Name) *</label>
                  <input className="filter-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="नाव टाका" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 180px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>शहर / तालुका (Place)</label>
                  <input className="filter-input" value={newPlace} onChange={e => setNewPlace(e.target.value)} placeholder="ठिकाण एन्टर करा" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 180px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>गाव (Village)</label>
                  <input className="filter-input" value={newVillage} onChange={e => setNewVillage(e.target.value)} placeholder="गाव एन्टर करा" />
                </div>
                <button type="submit" className="primary-btn" disabled={savingDealer}>
                  {savingDealer ? "नोंदवत आहे..." : "नोंदवा (Register)"}
                </button>
              </form>
            </div>

            {/* Companies Table */}
            <div className="card">
              <h3 style={{ margin: "0 0 16px 0" }}>नोंदवलेल्या कंपन्या / डीलर्स ({dealers.length})</h3>
              {loadingDealers ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>🔄 लोड होत आहे...</div>
              ) : dealers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#828B7E" }}>कोणतीही कंपनी नोंदवलेली नाही.</div>
              ) : (
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>कंपनीचे नाव (Company Name)</th>
                        <th>ठिकाण (Place)</th>
                        <th>गाव (Village)</th>
                        <th>कृती (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealers.map(d => (
                        <tr key={d.id}>
                          <td data-label="नाव">
                            <button
                              style={{ background: "none", border: "none", color: "#007bff", fontWeight: "bold", cursor: "pointer", textAlign: "left", fontSize: "14px" }}
                              onClick={() => { setSelectedCompany(d); setProfileTab("orders"); }}
                            >
                              {d.name} &rarr;
                            </button>
                          </td>
                          <td data-label="ठिकाण">{d.place || "-"}</td>
                          <td data-label="गाव">{d.village || "-"}</td>
                          <td data-label="कृती">
                            <button
                              className="primary-btn btn-sm"
                              style={{ background: "#C94A4A", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}
                              onClick={() => handleDeleteDealer(d.id)}
                            >
                              <Trash2 size={13} /> हटवा
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
      )}

      {/* ── TAB: Orders (default) ── */}
      {activeTab === "orders" && (
        selectedOrder ? (
          /* Order Details View */
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button className="back-btn" onClick={() => setSelectedOrder(null)}>
                  <ArrowLeft size={16} /> ऑर्डर्स यादीकडे जा
                </button>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>
                  {selectedOrder.dealerName} — ऑर्डर्स व ट्रक लोडिंग रेकॉर्ड्स
                </h2>
              </div>
              <button className="primary-btn btn-danger" style={{ background: "#C94A4A" }} onClick={() => handleDeleteOrder(selectedOrder.id)}>
                <Trash2 size={16} /> ही ऑर्डर हटवा (Delete Order)
              </button>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* Order Stats */}
              <div className="card" style={{ flex: "1 1 300px", margin: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px" }}>ऑर्डर सारांश</h3>
                <p style={{ margin: 0 }}><strong>P.O. क्रमांक:</strong> {selectedOrder.poNo || "N/A"}</p>
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
                {selectedOrder.note && <p style={{ margin: 0 }}><strong>टिप:</strong> {selectedOrder.note}</p>}
                
                <button 
                  className="primary-btn" 
                  style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} 
                  onClick={() => setShowDispatchForm(true)}
                  disabled={selectedOrder.remainingWeight <= 0}
                >
                  <Truck size={16} /> नवीन ट्रक लोड करा (Dispatch Truck)
                </button>
              </div>

              {/* Order Dispatches */}
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
                          <th>कृती (Actions)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.dispatches.map((d) => (
                          <tr key={d.id}>
                            <td data-label="बिल नं.">#{d.billNo}</td>
                            <td data-label="तारीख">{d.date}</td>
                            <td data-label="गाडी नंबर"><strong>{d.truckNo}</strong></td>
                            <td data-label="माल प्रकार">{d.cropType}</td>
                            <td data-label="वजन">{d.weight} Tons</td>
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
        ) : (
          /* Main Dashboard: Stats + Orders Grid */
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <DealerStatsCards 
              totalOrdersCount={totalOrdersCount}
              totalOrderedTons={totalOrderedTons}
              totalFulfilledTons={totalFulfilledTons}
              totalPendingTons={totalPendingTons}
              availableStockTons={availableStockTons}
              availableStockQuintals={availableStockQuintals}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>डीलर ऑर्डर्स यादी</h2>
              <button className="primary-btn" onClick={() => setShowOrderForm(true)}>
                <Plus size={16} /> नवीन ऑर्डर नोंदवा (Add Order)
              </button>
            </div>

            {loadingOrders ? (
              <div style={{ padding: "50px", textAlign: "center", color: "#828B7E" }}>🔄 ऑर्डर्स लोड होत आहेत...</div>
            ) : orders.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                नोंदवलेली कोणतीही डीलर ऑर्डर सापडली नाही. नवीन ऑर्डर जोडण्यासाठी वरील बटणावर क्लिक करा.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {orders.map((o) => {
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

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#828B7E", marginBottom: "4px" }}>
                          <span>प्रगती (Progress)</span>
                          <span>{fulfilledWt.toFixed(1)} / {orderedWt.toFixed(1)} Tons ({pct.toFixed(0)}%)</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", background: "#F0EDE6", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: o.status === "fulfilled" ? "#2e7d32" : "#4E653C" }}></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button className="primary-btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => loadOrderDetails(o.id)}>
                          तपशील & ट्रक नोंदी 📜
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {/* ── MODALS ── */}

      <DealerOrderForm 
        show={showOrderForm}
        dealers={dealers}
        availableStockTons={availableStockTons}
        onClose={() => setShowOrderForm(false)}
        onOrderAdded={() => {
          fetchOrders();
          fetchAvailableStock();
        }}
      />

      <DispatchForm 
        show={showDispatchForm}
        selectedOrder={selectedOrder}
        physicalStockTons={availableStockTons}
        onClose={() => setShowDispatchForm(false)}
        onDispatchAdded={() => {
          if (selectedOrder) {
            loadOrderDetails(selectedOrder.id);
          }
          fetchOrders();
          fetchAvailableStock();
        }}
      />

      <InvoicePreview 
        show={showInvoicePreview}
        selectedDispatchForPreview={selectedDispatchForPreview}
        currentOrderForPreview={orders.find(o => o.id === selectedDispatchForPreview?.orderId) || selectedOrder}
        onClose={() => setShowInvoicePreview(false)}
      />

      <CuttingModal 
        show={showCuttingModal}
        selectedDispatchForCutting={selectedDispatchForCutting}
        cuttingDispatchOrderId={cuttingDispatchOrderId}
        onClose={() => setShowCuttingModal(false)}
        onSaveSuccess={(updatedDispatch) => {
          // If viewing details, reload order
          if (selectedOrder) {
            loadOrderDetails(selectedOrder.id);
          }
          fetchOrders();
          fetchAvailableStock();
        }}
      />

      <PaymentModal 
        show={showPaymentModal}
        orders={orders}
        selectedCompany={selectedCompany}
        paymentOrderId={paymentOrderId}
        onSetPaymentOrderId={setPaymentOrderId}
        onClose={() => setShowPaymentModal(false)}
        onPaymentAdded={() => {
          fetchOrders();
        }}
      />

    </PageWrapper>
  );
};

export default DealerDashboard;
