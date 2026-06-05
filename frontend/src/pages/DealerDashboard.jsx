import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import PageWrapper from "../components/layout/PageWrapper";
import { Truck, Plus, FileText, Trash2, ArrowLeft, ChevronDown } from "lucide-react";
import CustomDropdown from "../components/common/CustomDropdown";
import DealerOrderForm from "../components/dealer/DealerOrderForm";
import DispatchForm from "../components/dealer/DispatchForm";
import CompanyProfile from "../components/dealer/CompanyProfile";
import AllTrucksLog from "../components/dealer/AllTrucksLog";
import CuttingModal from "../components/dealer/CuttingModal";
import PaymentModal from "../components/dealer/PaymentModal";
import InvoicePreview from "../components/dealer/InvoicePreview";
import DealerStatsCards from "../components/dealer/DealerStatsCards";

const DealerDashboard = () => {
  // States
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedDispatchForPreview, setSelectedDispatchForPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmerRecords, setFarmerRecords] = useState([]);

  // Registered Companies States
  const [dealers, setDealers] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("dealer_activeTab") || "orders";
  });
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyPlace, setNewCompanyPlace] = useState("");
  const [newCompanyVillage, setNewCompanyVillage] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);

  // Company Profile Dashboard States
  const [selectedCompany, setSelectedCompany] = useState(() => {
    const saved = localStorage.getItem("dealer_selectedCompany");
    return saved ? JSON.parse(saved) : null;
  });
  const [profileTab, setProfileTab] = useState(() => {
    return localStorage.getItem("dealer_profileTab") || "orders";
  });

  // Cutting Modal States
  const [showCuttingModal, setShowCuttingModal] = useState(false);
  const [selectedDispatchForCutting, setSelectedDispatchForCutting] = useState(null);
  const [cuttingDispatchOrderId, setCuttingDispatchOrderId] = useState("");

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(() => {
    const saved = localStorage.getItem("dealer_selectedOrder");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync states to localStorage & dispatch sidebar state events
  useEffect(() => {
    localStorage.setItem("dealer_activeTab", activeTab);
    window.dispatchEvent(new Event("dealer-tab-changed"));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("dealer_profileTab", profileTab);
  }, [profileTab]);

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("dealer_selectedCompany", JSON.stringify(selectedCompany));
    } else {
      localStorage.removeItem("dealer_selectedCompany");
    }
    window.dispatchEvent(new Event("dealer-tab-changed"));
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedOrder) {
      localStorage.setItem("dealer_selectedOrder", JSON.stringify(selectedOrder));
    } else {
      localStorage.removeItem("dealer_selectedOrder");
    }
    window.dispatchEvent(new Event("dealer-tab-changed"));
  }, [selectedOrder]);

  // Listen for sidebar updates
  useEffect(() => {
    const handleTabChange = () => {
      const savedTab = localStorage.getItem("dealer_activeTab") || "orders";
      if (savedTab !== activeTab) {
        setActiveTab(savedTab);
      }
      
      const savedCompany = localStorage.getItem("dealer_selectedCompany");
      const parsedCompany = savedCompany ? JSON.parse(savedCompany) : null;
      // Simple shallow check
      if ((parsedCompany ? parsedCompany.id : null) !== (selectedCompany ? selectedCompany.id : null)) {
        setSelectedCompany(parsedCompany);
      }
      
      const savedOrder = localStorage.getItem("dealer_selectedOrder");
      const parsedOrder = savedOrder ? JSON.parse(savedOrder) : null;
      if ((parsedOrder ? parsedOrder.id : null) !== (selectedOrder ? selectedOrder.id : null)) {
        setSelectedOrder(parsedOrder);
      }
    };
    window.addEventListener("dealer-tab-changed", handleTabChange);
    return () => window.removeEventListener("dealer-tab-changed", handleTabChange);
  }, [activeTab, selectedCompany, selectedOrder]);

  // Load orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/dealer-orders");
      const ordersList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setOrders(ordersList);

      // If we have a selected order, reload detail from database to get fresh dispatches/payments
      if (selectedOrder) {
        try {
          const detailRes = await api.get(`/api/dealer-orders/${selectedOrder.id}`);
          setSelectedOrder(detailRes.data);
        } catch (e) {
          console.error("Error reloading order detail on refresh:", e);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dealer orders:", err);
      setLoading(false);
    }
  };
  
  const fetchFarmerRecords = async () => {
    try {
      const res = await api.get("/api/records");
      setFarmerRecords(Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error("Error fetching farmer records:", err);
    }
  };

  const fetchDealers = async () => {
    try {
      const res = await api.get("/api/dealers");
      const dealersList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setDealers(dealersList);

      // If we have a selected company, refresh it from the new list
      if (selectedCompany) {
        const found = dealersList.find(d => d.id === selectedCompany.id);
        if (found) {
          setSelectedCompany(found);
        }
      }
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
      const res = await api.post("/api/dealers", {
        name: newCompanyName,
        place: newCompanyPlace,
        village: newCompanyVillage,
      });

      const data = res.data;
      setCompanyLoading(false);

      if (res.status === 201) {
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
      const res = await api.delete(`/api/dealers/${id}`);

      if (res.status === 200) {
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
    fetchFarmerRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = async () => {
    await fetchOrders();
    await fetchFarmerRecords();
    // If order view is active, reload order details
    if (selectedOrder) {
      loadOrderDetails(selectedOrder.id);
    }
  };

  // Fetch full details of selected order (including dispatches)
  const loadOrderDetails = async (id) => {
    try {
      const res = await api.get(`/api/dealer-orders/${id}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  const handleOrderSelect = (orderId) => {
    loadOrderDetails(orderId);
  };

  // Stays in parent - used by order details view

  // Delete Dispatch
  const handleDeleteDispatch = async (dispatchId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही नोंद हटवायची आहे?")) return;

    try {
      const res = await api.delete(`/api/dealer-dispatches/${dispatchId}`);

      if (res.status === 200) {
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

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही संपूर्ण ऑर्डर आणि त्यावरील सर्व ट्रक नोंदी हटवायच्या आहेत?")) return;

    try {
      const res = await api.delete(`/api/dealer-orders/${orderId}`);

      if (res.status === 200) {
        alert("ऑर्डर यशस्वीरित्या हटवली ✅");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        alert("ऑर्डर हटवताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };



  // Total stats for dealer portal
  const totalOrdersCount = orders.length;
  const totalOrderedTons = orders.reduce((sum, o) => sum + (o.totalOrderedWeight || 0), 0);
  const totalFulfilledTons = orders.reduce((sum, o) => sum + (o.fulfilledWeight || 0), 0);
  const totalPendingTons = Math.max(0, totalOrderedTons - totalFulfilledTons);

  // Total stock calculations (1 Ton = 10 Quintals)
  const totalInwardTons = farmerRecords.reduce((sum, r) => {
    const isMakka = r.crop === "मका" || (r.commodity && r.commodity.includes("मका"));
    if (isMakka) {
      return sum + Number(r.weight || r.quantity || 0) / 10;
    }
    return sum;
  }, 0);
  const totalOutwardTons = orders.reduce((sum, o) => sum + Math.max(o.totalOrderedWeight || 0, o.fulfilledWeight || 0), 0);
  const availableStockTons = Math.max(0, totalInwardTons - totalOutwardTons);
  const availableStockQuintals = availableStockTons * 10;
  const totalAlreadyDispatchedTons = orders.reduce((sum, o) => sum + (o.fulfilledWeight || 0), 0);
  const physicalStockTons = Math.max(0, totalInwardTons - totalAlreadyDispatchedTons);

  const currentOrderForPreview = selectedDispatchForPreview 
    ? (orders.find(o => o.id === selectedDispatchForPreview.orderId) || selectedOrder || {}) 
    : {};

  const openCuttingModal = (dispatch, orderId) => {
    setSelectedDispatchForCutting(dispatch);
    setCuttingDispatchOrderId(orderId);
    setShowCuttingModal(true);
  };

  const handleDeletePayment = async (orderId, paymentId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की हा पेमेंट व्यवहार हटवायचा आहे?")) return;

    try {
      const res = await api.delete(`/api/dealer-orders/${orderId}/payment/${paymentId}`);

      if (res.status === 200) {
        alert("पेमेंट व्यवहार यशस्वीरित्या हटवला गेला ✅");
        refreshData();
      } else {
        alert("पेमेंट हटवताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderAllPaymentsLedger = () => {
    const allPayments = orders.flatMap(o => 
      (o.payments || []).map(p => ({
        ...p,
        dealerName: o.dealerName,
        orderId: o.id,
        poNo: o.poNo
      }))
    );
    allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>💸 सर्व जमा पेमेंट व्यवहार यादी (All Payments Ledger)</h2>
        </div>

        <div className="card" style={{ padding: "20px", margin: 0 }}>
          {allPayments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
              कोणताही पेमेंट व्यवहार नोंदवलेला नाही.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>तारीख</th>
                    <th>कंपनी नाव</th>
                    <th>ऑर्डर PO क्रमांक</th>
                    <th>पेमेंट प्रकार</th>
                    <th>रेफरन्स नंबर</th>
                    <th>माहिती / नोंद</th>
                    <th>रक्कम</th>
                    <th>कृती</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((p) => (
                    <tr key={p.id}>
                      <td data-label="तारीख">{p.date}</td>
                      <td data-label="कंपनी नाव"><strong>{p.dealerName}</strong></td>
                      <td data-label="ऑर्डर PO क्रमांक">{p.poNo || "N/A"}</td>
                      <td data-label="पेमेंट प्रकार">{p.mode}</td>
                      <td data-label="रेफरन्स नंबर">{p.refNo || "-"}</td>
                      <td data-label="माहिती / नोंद">{p.note || "-"}</td>
                      <td data-label="रक्कम" style={{ color: "#2e7d32", fontWeight: "700" }}>
                        ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td data-label="कृती">
                        <button 
                          className="primary-btn btn-danger btn-sm" 
                          style={{ padding: "4px 8px", background: "#C94A4A" }}
                          onClick={async () => {
                            if (!window.confirm("हे पेमेंट नक्की हटवायचे आहे का?")) return;
                            try {
                              const res = await api.delete(`/api/dealer-orders/${p.orderId}/payment/${p.id}`);
                              if (res.status === 200) {
                                refreshData();
                              } else {
                                alert("पेमेंट हटवताना चूक झाली.");
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
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
    );
  };

  return (
    <PageWrapper title="🚚 डीलर ऑर्डर्स व ट्रक लोडिंग व्यवस्थापन">
      
      {/* Analytics Grid */}
      {!selectedOrder && !selectedCompany && (
        <DealerStatsCards
          totalOrdersCount={totalOrdersCount}
          totalOrderedTons={totalOrderedTons}
          totalFulfilledTons={totalFulfilledTons}
          totalPendingTons={totalPendingTons}
          availableStockTons={availableStockTons}
          availableStockQuintals={availableStockQuintals}
        />
      )}


      {/* Conditional Rendering: Main Dashboard, Company Profile Dashboard or Selected Order Details */}
      {selectedCompany && !selectedOrder ? (
        <CompanyProfile
          selectedCompany={selectedCompany}
          orders={orders}
          profileTab={profileTab}
          onSetProfileTab={setProfileTab}
          onBack={() => setSelectedCompany(null)}
          onOpenCuttingModal={openCuttingModal}
          onShowInvoice={(dispatch) => {
            setSelectedDispatchForPreview(dispatch);
            setShowInvoicePreview(true);
          }}
          onOpenPayment={(orderId) => {
            setPaymentOrderId(orderId);
            setShowPaymentModal(true);
          }}
          onDeletePayment={handleDeletePayment}
        />
      ) : !selectedOrder ? (
        activeTab === "orders" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Header Action & Filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>डीलर ऑर्डर्स यादी (Dealers)</h2>
                
                {/* Custom Premium Dropdown */}
                <div className="custom-dropdown-container" ref={companyDropdownRef}>
                  <div 
                    className="custom-dropdown-trigger" 
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  >
                    <span>{selectedCompanyFilter || "सर्व कंपन्या (All Companies)"}</span>
                    <ChevronDown size={16} style={{ transition: "transform 150ms ease", transform: isCompanyDropdownOpen ? "rotate(180deg)" : "rotate(0)" }} />
                  </div>
                  {isCompanyDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <div 
                        className={`custom-dropdown-item ${!selectedCompanyFilter ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedCompanyFilter("");
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        सर्व कंपन्या (All Companies)
                      </div>
                      {dealers.map(d => (
                        <div 
                          key={d.id} 
                          className={`custom-dropdown-item ${selectedCompanyFilter === d.name ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedCompanyFilter(d.name);
                            setIsCompanyDropdownOpen(false);
                          }}
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className="primary-btn" onClick={() => setShowOrderForm(true)}>
                <Plus size={16} /> नवीन ऑर्डर नोंदवा (Add Order)
              </button>
            </div>

            {/* Orders List Layout */}
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-line title skeleton-shimmer"></div>
                    <div className="skeleton-line subtitle skeleton-shimmer"></div>
                    <div style={{ margin: "8px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div className="skeleton-line text skeleton-shimmer" style={{ width: "95%" }}></div>
                      <div className="skeleton-line text skeleton-shimmer" style={{ width: "85%" }}></div>
                      <div className="skeleton-line text skeleton-shimmer" style={{ width: "75%" }}></div>
                    </div>
                    <div className="skeleton-shimmer" style={{ height: "36px", width: "100%", borderRadius: "8px", marginTop: "4px" }}></div>
                  </div>
                ))}
              </div>
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
        ) : activeTab === "companies" ? (
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
                                setSelectedCompany(d);
                              }}
                              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                              title="या कंपनीचे प्रोफाइल व व्यवहार पहा"
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
        ) : activeTab === "all_trucks" ? (
          <AllTrucksLog
            orders={orders}
            onShowInvoice={(dispatch) => {
              setSelectedDispatchForPreview(dispatch);
              setShowInvoicePreview(true);
            }}
            onSelectOrder={setSelectedOrder}
          />
        ) : activeTab === "all_payments" ? (
          renderAllPaymentsLedger()
        ) : null
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

              {selectedOrder.status === "fulfilled" || Number(selectedOrder.remainingWeight || 0) <= 0 ? (
                <button 
                  className="primary-btn btn-ghost" 
                  style={{ marginTop: "10px", width: "100%", justifyContent: "center", cursor: "not-allowed", opacity: 0.6 }} 
                  disabled
                  title="ऑर्डर पूर्ण झाली आहे, त्यामुळे नवीन ट्रक लोड करता येणार नाही."
                >
                  <Truck size={16} /> ऑर्डर पूर्ण झाली (Order Fulfilled)
                </button>
              ) : (
                <button className="primary-btn" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} onClick={() => setShowDispatchForm(true)}>
                  <Truck size={16} /> नवीन ट्रक लोड करा (Dispatch Truck)
                </button>
              )}

              <button 
                className="primary-btn btn-danger" 
                style={{ marginTop: "10px", width: "100%", justifyContent: "center", background: "#C94A4A" }} 
                onClick={() => handleDeleteOrder(selectedOrder.id)}
              >
                <Trash2 size={16} /> ऑर्डर हटवा (Delete Order)
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
                                onClick={() => openCuttingModal(d, selectedOrder.id)}
                                title="कंपनी अंतिम घट/नुकसान नोंदवा"
                              >
                                ⚖️ घट नोंद
                              </button>
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
      <DealerOrderForm
        show={showOrderForm}
        dealers={dealers}
        availableStockTons={availableStockTons}
        onClose={() => setShowOrderForm(false)}
        onOrderAdded={() => { fetchOrders(); fetchFarmerRecords(); }}
      />

      {/* MODAL 2: ADD NEW TRUCK DISPATCH (TRUCK LOADING) FORM */}
      <DispatchForm
        show={showDispatchForm}
        selectedOrder={selectedOrder}
        physicalStockTons={physicalStockTons}
        onClose={() => setShowDispatchForm(false)}
        onDispatchAdded={() => { loadOrderDetails(selectedOrder.id); fetchOrders(); }}
      />

      {/* MODAL 3: DOUBLE BILL PREVIEW MODAL */}
      <InvoicePreview
        show={showInvoicePreview}
        selectedDispatchForPreview={selectedDispatchForPreview}
        currentOrderForPreview={currentOrderForPreview}
        onClose={() => setShowInvoicePreview(false)}
      />

      {/* MODAL 4: COMPANY LOSS / CUTTING MODAL */}
      <CuttingModal
        show={showCuttingModal}
        selectedDispatchForCutting={selectedDispatchForCutting}
        cuttingDispatchOrderId={cuttingDispatchOrderId}
        onClose={() => setShowCuttingModal(false)}
        onSaveSuccess={(updatedDispatch) => {
          refreshData();
          setSelectedDispatchForPreview(updatedDispatch);
          setShowInvoicePreview(true);
        }}
      />

      {/* MODAL 5: COMPANY PAYMENT MODAL */}
      <PaymentModal
        show={showPaymentModal}
        orders={orders}
        selectedCompany={selectedCompany}
        paymentOrderId={paymentOrderId}
        onSetPaymentOrderId={setPaymentOrderId}
        onClose={() => setShowPaymentModal(false)}
        onPaymentAdded={refreshData}
      />
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

      {/* MODAL 4: COMPANY LOSS / CUTTING MODAL */}
      {showCuttingModal && selectedDispatchForCutting && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
              ⚖️ कंपनी अंतिम पावती & घट (Loss/Cutting) नोंदवा
            </h2>
            <form onSubmit={handleSaveCutting} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px", fontSize: "13px" }}>
                <strong>मूळ गाडी लोडिंग माहिती:</strong><br />
                • वजन: {selectedDispatchForCutting.weight} T | भाव: ₹{selectedDispatchForCutting.rate}<br />
                • पाठवलेली रक्कम (Loaded Value): <strong>₹{selectedDispatchForCutting.amount.toFixed(2)}</strong>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>कंपनी अंतिम वजन (Tons) *</label>
                  <input 
                    type="number" 
                    step="any" 
                    value={compWeight} 
                    onChange={(e) => setCompWeight(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>कंपनी अंतिम भाव *</label>
                  <input 
                    type="number" 
                    step="any" 
                    value={compRate} 
                    onChange={(e) => setCompRate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Fungal / Quality कपात (₹)</label>
                  <input 
                    type="number" 
                    value={compDamageCut} 
                    onChange={(e) => setCompDamageCut(e.target.value)} 
                    placeholder="0"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Moisture कपात (₹)</label>
                  <input 
                    type="number" 
                    value={compMoistureCut} 
                    onChange={(e) => setCompMoistureCut(e.target.value)} 
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>इतर घट/कपात (₹)</label>
                  <input 
                    type="number" 
                    value={compOtherCut} 
                    onChange={(e) => setCompOtherCut(e.target.value)} 
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Calculations Display */}
              <div style={{ background: "#f2f7f2", padding: "10px", borderRadius: "5px", fontSize: "13px" }}>
                <strong>अंदाजित ताळमेळ (Preview):</strong><br />
                • कंपनी पास रक्कम: <strong>₹{((Number(compWeight || 0) * Number(compRate || 0) * 10) - (Number(compDamageCut || 0) + Number(compMoistureCut || 0) + Number(compOtherCut || 0))).toFixed(2)}</strong><br />
                • कपात/नुकसान (Net Loss): <strong style={{ color: "red" }}>₹{(Number(selectedDispatchForCutting.amount || 0) - ((Number(compWeight || 0) * Number(compRate || 0) * 10) - (Number(compDamageCut || 0) + Number(compMoistureCut || 0) + Number(compOtherCut || 0)))).toFixed(2)}</strong>
              </div>

              <div className="form-group">
                <label>तपशील / टिप (Note)</label>
                <input 
                  type="text" 
                  value={compNote} 
                  onChange={(e) => setCompNote(e.target.value)} 
                  placeholder="उदा. बुरशी लागल्याने कपात झाली"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: "center" }}>जतन करा (Save)</button>
                <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowCuttingModal(false)}>रद्द करा (Cancel)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: COMPANY PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
              💰 नवीन कंपनी पेमेंट व्यवहार
            </h2>
            <form onSubmit={handleAddPayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              <div className="form-group">
                <label>निवडलेली ऑर्डर (Linked P.O. Number) *</label>
                <CustomDropdown
                  value={paymentOrderId}
                  onChange={setPaymentOrderId}
                  options={orders
                    .filter(o => o.dealerName === selectedCompany?.name)
                    .map(o => ({
                      value: o.id,
                      label: `P.O. ${o.poNo || "N/A"} (${o.orderDate})`
                    }))}
                  placeholder="ऑर्डर निवडा (Select Order)"
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>तारीख (Date) *</label>
                  <input 
                    type="date" 
                    value={paymentDate} 
                    onChange={(e) => setPaymentDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>रक्कम (Amount in ₹) *</label>
                  <input 
                    type="number" 
                    placeholder="उदा. 50000" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>पेमेंट प्रकार (Payment Mode) *</label>
                  <CustomDropdown
                    value={paymentMode}
                    onChange={setPaymentMode}
                    options={["Bank Transfer", "RTGS / NEFT", "Cheque", "Cash", "UPI"]}
                    placeholder="पेमेंट प्रकार निवडा"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>रेफरन्स नं. (Cheque/Ref No)</label>
                  <input 
                    type="text" 
                    placeholder="उदा. TXN123456" 
                    value={paymentRefNo} 
                    onChange={(e) => setPaymentRefNo(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>तपशील / टिप (Note)</label>
                <input 
                  type="text" 
                  placeholder="उदा. बँक ट्रान्सफर द्वारे जमा" 
                  value={paymentNote} 
                  onChange={(e) => setPaymentNote(e.target.value)} 
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: "center" }}>पेमेंट जोडा (Save)</button>
                <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowPaymentModal(false)}>रद्द करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HIDDEN PRINTABLE LEDGER CONTAINER */}
      {selectedCompany && (
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
          {/* Statement Header */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "15px", marginBottom: "20px" }}>
            <h1 style={{ margin: 0, fontSize: "24px", color: "#8B0000" }}>मे. के.टी. ट्रेडर्स</h1>
            <h3 style={{ margin: "2px 0 0 0", fontSize: "16px" }}>K. T. TRADERS</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>मार्केट यार्ड, मालेगाव कॅम्प जि. नाशिक | मो. 9850291298, 9767128838</p>
            <h2 style={{ marginTop: "15px", marginBottom: 0, fontSize: "18px", borderTop: "1px solid #ddd", paddingTop: "10px", fontWeight: "bold" }}>
              लेजर खाते उतारा (Account Statement)
            </h2>
          </div>

          {/* Company Info Block */}
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

          {/* Account Summary Stats */}
          {(() => {
            const companyOrders = orders.filter(o => o.dealerName === selectedCompany.name);
            const companyDispatches = companyOrders.flatMap(o => (o.dispatches || []).map(d => ({ ...d, poNo: o.poNo })));
            const companyPayments = companyOrders.flatMap(o => (o.payments || []).map(p => ({ ...p, poNo: o.poNo })));

            const totalSent = companyDispatches.reduce((sum, d) => sum + Number(d.amount || 0), 0);
            const totalCuts = companyDispatches.reduce((sum, d) => sum + Number(d.lossAmt || 0), 0);
            const totalPassed = totalSent - totalCuts;
            const totalPaid = companyPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
            const totalBalance = totalPassed - totalPaid;

            // Compile transactions
            const txs = [
              ...companyDispatches.map(d => ({
                date: d.date,
                timestamp: new Date(d.date).getTime(),
                details: `गाडी नं: ${d.truckNo} (${d.cropType})`,
                weight: d.weight,
                sentAmt: d.amount,
                cuts: d.lossAmt || 0,
                passedAmt: d.passedAmt || d.amount,
                paidAmt: 0
              })),
              ...companyPayments.map(p => ({
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
                    <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px" }}>₹{totalSent.toFixed(2)}</div>
                  </div>
                  <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                    <span style={{ fontSize: "9px", color: "#666" }}>एकूण घट (Cuts)</span>
                    <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "red" }}>₹{totalCuts.toFixed(2)}</div>
                  </div>
                  <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                    <span style={{ fontSize: "9px", color: "#666" }}>कंपनी मंजूर</span>
                    <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "green" }}>₹{totalPassed.toFixed(2)}</div>
                  </div>
                  <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
                    <span style={{ fontSize: "9px", color: "#666" }}>एकूण जमा (Paid)</span>
                    <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: "blue" }}>₹{totalPaid.toFixed(2)}</div>
                  </div>
                  <div style={{ border: "1px solid #ddd", padding: "8px", borderRadius: "4px", background: "#f2f7f2" }}>
                    <span style={{ fontSize: "9px", color: "#666" }}>बाकी (Outstanding)</span>
                    <div style={{ fontWeight: "bold", fontSize: "11px", marginTop: "3px", color: totalBalance > 0 ? "orange" : "green" }}>₹{totalBalance.toFixed(2)}</div>
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

          {/* Signature Area */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px", fontSize: "11px" }}>
            <div>* खातेदाराची स्वाक्षरी</div>
            <div style={{ textAlign: "right" }}>
              <strong>तर्फे : के.टी. ट्रेडर्स</strong><br /><br /><br />
              <span>अधिकृत सही</span>
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
