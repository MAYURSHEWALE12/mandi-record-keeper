import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import toast from "react-hot-toast";
import PageWrapper from "../components/layout/PageWrapper";
import { Truck, Plus, FileText, Trash2, ArrowLeft, ChevronDown } from "lucide-react";
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
      toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤•à¤‚à¤ªà¤¨à¥€à¤šà¥‡ à¤¨à¤¾à¤µ à¤­à¤°à¤¾.");
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
        toast.success("à¤¨à¤µà¥€à¤¨ à¤•à¤‚à¤ªà¤¨à¥€ à¤¯à¤¶à¤¸à¥à¤µà¥€à¤°à¤¿à¤¤à¥à¤¯à¤¾ à¤¨à¥‹à¤‚à¤¦à¤µà¤²à¥€ âœ…");
        setNewCompanyName("");
        setNewCompanyPlace("");
        setNewCompanyVillage("");
        fetchDealers();
      } else {
        toast.error(data.error || "à¤•à¤‚à¤ªà¤¨à¥€ à¤¸à¥‡à¤µà¥à¤¹ à¤•à¤°à¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
      }
    } catch (err) {
      console.error(err);
      setCompanyLoading(false);
      toast.error("à¤¸à¤°à¥à¤µà¥à¤¹à¤°à¤¶à¥€ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤¹à¥‹à¤Š à¤¶à¤•à¤²à¤¾ à¤¨à¤¾à¤¹à¥€.");
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤–à¤¾à¤¤à¥à¤°à¥€ à¤†à¤¹à¥‡ à¤•à¥€ à¤¹à¥€ à¤•à¤‚à¤ªà¤¨à¥€ à¤¯à¤¾à¤¦à¥€à¤¤à¥‚à¤¨ à¤¹à¤Ÿà¤µà¤¾à¤¯à¤šà¥€ à¤†à¤¹à¥‡?")) return;

    try {
      const res = await api.delete(`/api/dealers/${id}`);

      if (res.status === 200) {
        toast.success("à¤•à¤‚à¤ªà¤¨à¥€ à¤¯à¤¶à¤¸à¥à¤µà¥€à¤°à¤¿à¤¤à¥à¤¯à¤¾ à¤¹à¤Ÿà¤µà¤²à¥€ âœ…");
        fetchDealers();
      } else {
        toast.error("à¤•à¤‚à¤ªà¤¨à¥€ à¤¹à¤Ÿà¤µà¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
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
    if (!window.confirm("à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤–à¤¾à¤¤à¥à¤°à¥€ à¤†à¤¹à¥‡ à¤•à¥€ à¤¹à¥€ à¤¨à¥‹à¤‚à¤¦ à¤¹à¤Ÿà¤µà¤¾à¤¯à¤šà¥€ à¤†à¤¹à¥‡?")) return;

    try {
      const res = await api.delete(`/api/dealer-dispatches/${dispatchId}`);

      if (res.status === 200) {
        toast.success("à¤¨à¥‹à¤‚à¤¦ à¤¯à¤¶à¤¸à¥à¤µà¥€à¤°à¤¿à¤¤à¥à¤¯à¤¾ à¤¹à¤Ÿà¤µà¤²à¥€ âœ…");
        loadOrderDetails(selectedOrder.id);
        fetchOrders();
      } else {
        toast.error("à¤¨à¥‹à¤‚à¤¦ à¤¹à¤Ÿà¤µà¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤–à¤¾à¤¤à¥à¤°à¥€ à¤†à¤¹à¥‡ à¤•à¥€ à¤¹à¥€ à¤¸à¤‚à¤ªà¥‚à¤°à¥à¤£ à¤‘à¤°à¥à¤¡à¤° à¤†à¤£à¤¿ à¤¤à¥à¤¯à¤¾à¤µà¤°à¥€à¤² à¤¸à¤°à¥à¤µ à¤Ÿà¥à¤°à¤• à¤¨à¥‹à¤‚à¤¦à¥€ à¤¹à¤Ÿà¤µà¤¾à¤¯à¤šà¥à¤¯à¤¾ à¤†à¤¹à¥‡à¤¤?")) return;

    try {
      const res = await api.delete(`/api/dealer-orders/${orderId}`);

      if (res.status === 200) {
        toast.success("à¤‘à¤°à¥à¤¡à¤° à¤¯à¤¶à¤¸à¥à¤µà¥€à¤°à¤¿à¤¤à¥à¤¯à¤¾ à¤¹à¤Ÿà¤µà¤²à¥€ âœ…");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error("à¤‘à¤°à¥à¤¡à¤° à¤¹à¤Ÿà¤µà¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
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
    const isMakka = r.crop === "à¤®à¤•à¤¾" || (r.commodity && r.commodity.includes("à¤®à¤•à¤¾"));
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
    if (!window.confirm("à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤–à¤¾à¤¤à¥à¤°à¥€ à¤†à¤¹à¥‡ à¤•à¥€ à¤¹à¤¾ à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤° à¤¹à¤Ÿà¤µà¤¾à¤¯à¤šà¤¾ à¤†à¤¹à¥‡?")) return;

    try {
      const res = await api.delete(`/api/dealer-orders/${orderId}/payment/${paymentId}`);

      if (res.status === 200) {
        toast.success("à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤° à¤¯à¤¶à¤¸à¥à¤µà¥€à¤°à¤¿à¤¤à¥à¤¯à¤¾ à¤¹à¤Ÿà¤µà¤²à¤¾ à¤—à¥‡à¤²à¤¾ âœ…");
        refreshData();
      } else {
        toast.error("à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤¹à¤Ÿà¤µà¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
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
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>ðŸ’¸ à¤¸à¤°à¥à¤µ à¤œà¤®à¤¾ à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤° à¤¯à¤¾à¤¦à¥€ (All Payments Ledger)</h2>
        </div>

        <div className="card" style={{ padding: "20px", margin: 0 }}>
          {allPayments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
              à¤•à¥‹à¤£à¤¤à¤¾à¤¹à¥€ à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤° à¤¨à¥‹à¤‚à¤¦à¤µà¤²à¥‡à¤²à¤¾ à¤¨à¤¾à¤¹à¥€.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>à¤¤à¤¾à¤°à¥€à¤–</th>
                    <th>à¤•à¤‚à¤ªà¤¨à¥€ à¤¨à¤¾à¤µ</th>
                    <th>à¤‘à¤°à¥à¤¡à¤° PO à¤•à¥à¤°à¤®à¤¾à¤‚à¤•</th>
                    <th>à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤ªà¥à¤°à¤•à¤¾à¤°</th>
                    <th>à¤°à¥‡à¤«à¤°à¤¨à¥à¤¸ à¤¨à¤‚à¤¬à¤°</th>
                    <th>à¤®à¤¾à¤¹à¤¿à¤¤à¥€ / à¤¨à¥‹à¤‚à¤¦</th>
                    <th>à¤°à¤•à¥à¤•à¤®</th>
                    <th>à¤•à¥ƒà¤¤à¥€</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((p) => (
                    <tr key={p.id}>
                      <td data-label="à¤¤à¤¾à¤°à¥€à¤–">{p.date}</td>
                      <td data-label="à¤•à¤‚à¤ªà¤¨à¥€ à¤¨à¤¾à¤µ"><strong>{p.dealerName}</strong></td>
                      <td data-label="à¤‘à¤°à¥à¤¡à¤° PO à¤•à¥à¤°à¤®à¤¾à¤‚à¤•">{p.poNo || "N/A"}</td>
                      <td data-label="à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤ªà¥à¤°à¤•à¤¾à¤°">{p.mode}</td>
                      <td data-label="à¤°à¥‡à¤«à¤°à¤¨à¥à¤¸ à¤¨à¤‚à¤¬à¤°">{p.refNo || "-"}</td>
                      <td data-label="à¤®à¤¾à¤¹à¤¿à¤¤à¥€ / à¤¨à¥‹à¤‚à¤¦">{p.note || "-"}</td>
                      <td data-label="à¤°à¤•à¥à¤•à¤®" style={{ color: "#2e7d32", fontWeight: "700" }}>
                        â‚¹{Number(p.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td data-label="à¤•à¥ƒà¤¤à¥€">
                        <button 
                          className="primary-btn btn-danger btn-sm" 
                          style={{ padding: "4px 8px", background: "#C94A4A" }}
                          onClick={async () => {
                            if (!window.confirm("à¤¹à¥‡ à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤¨à¤•à¥à¤•à¥€ à¤¹à¤Ÿà¤µà¤¾à¤¯à¤šà¥‡ à¤†à¤¹à¥‡ à¤•à¤¾?")) return;
                            try {
                              const res = await api.delete(`/api/dealer-orders/${p.orderId}/payment/${p.id}`);
                              if (res.status === 200) {
                                refreshData();
                              } else {
                                toast.error("à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤¹à¤Ÿà¤µà¤¤à¤¾à¤¨à¤¾ à¤šà¥‚à¤• à¤à¤¾à¤²à¥€.");
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          <Trash2 size={14} /> à¤¹à¤Ÿà¤µà¤¾
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
    <PageWrapper title="ðŸšš à¤¡à¥€à¤²à¤° à¤‘à¤°à¥à¤¡à¤°à¥à¤¸ à¤µ à¤Ÿà¥à¤°à¤• à¤²à¥‹à¤¡à¤¿à¤‚à¤— à¤µà¥à¤¯à¤µà¤¸à¥à¤¥à¤¾à¤ªà¤¨">
      
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
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>à¤¡à¥€à¤²à¤° à¤‘à¤°à¥à¤¡à¤°à¥à¤¸ à¤¯à¤¾à¤¦à¥€ (Dealers)</h2>
                
                {/* Custom Premium Dropdown */}
                <div className="custom-dropdown-container" ref={companyDropdownRef}>
                  <div 
                    className="custom-dropdown-trigger" 
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  >
                    <span>{selectedCompanyFilter || "à¤¸à¤°à¥à¤µ à¤•à¤‚à¤ªà¤¨à¥à¤¯à¤¾ (All Companies)"}</span>
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
                        à¤¸à¤°à¥à¤µ à¤•à¤‚à¤ªà¤¨à¥à¤¯à¤¾ (All Companies)
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
                <Plus size={16} /> à¤¨à¤µà¥€à¤¨ à¤‘à¤°à¥à¤¡à¤° à¤¨à¥‹à¤‚à¤¦à¤µà¤¾ (Add Order)
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
                à¤¨à¥‹à¤‚à¤¦à¤µà¤²à¥‡à¤²à¥€ à¤•à¥‹à¤£à¤¤à¥€à¤¹à¥€ à¤¡à¥€à¤²à¤° à¤‘à¤°à¥à¤¡à¤° à¤¸à¤¾à¤ªà¤¡à¤²à¥€ à¤¨à¤¾à¤¹à¥€.
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
                            <span style={{ fontSize: "12px", color: "#828B7E", fontWeight: "600", textTransform: "uppercase" }}>P.O. à¤¨à¤‚: {o.poNo || "N/A"}</span>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#2B2F2A", margin: "2px 0 0 0" }}>{o.dealerName}</h3>
                          </div>
                          <span className={`badge ${o.status === "fulfilled" ? "badge-paid" : o.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                            {o.status === "fulfilled" ? "à¤ªà¥‚à¤°à¥à¤£" : o.status === "partially_fulfilled" ? "à¤…à¤‚à¤¶à¤¤à¤ƒ à¤ªà¥‚à¤°à¥à¤£" : "à¤¬à¤¾à¤•à¥€"}
                          </span>
                        </div>

                        <div style={{ fontSize: "14px", color: "#4A5148" }}>
                          ðŸ“ <strong>à¤ à¤¿à¤•à¤¾à¤£:</strong> {o.place || "-"}, {o.village || "-"}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginTop: "5px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#828B7E", marginBottom: "4px" }}>
                            <span>à¤ªà¥à¤°à¤—à¤¤à¥€ (Progress)</span>
                            <span>{fulfilledWt.toFixed(1)} / {orderedWt.toFixed(1)} Tons ({pct.toFixed(0)}%)</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "#F0EDE6", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: o.status === "fulfilled" ? "#2e7d32" : "#4E653C" }}></div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                          <button className="primary-btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleOrderSelect(o.id)}>
                            à¤¤à¤ªà¤¶à¥€à¤² & à¤Ÿà¥à¤°à¤• à¤¨à¥‹à¤‚à¤¦à¥€ ðŸ“œ
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
                ðŸ¢ à¤¨à¤µà¥€à¤¨ à¤•à¤‚à¤ªà¤¨à¥€ à¤¨à¥‹à¤‚à¤¦à¤£à¥€
              </h3>
              <form onSubmit={handleAddCompany} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label>à¤•à¤‚à¤ªà¤¨à¥€ / à¤¡à¥€à¤²à¤° à¤¨à¤¾à¤µ (Company Name) *</label>
                  <input 
                    type="text" 
                    placeholder="à¤‰à¤¦à¤¾. à¤®à¥‡. à¤•à¥‡.à¤Ÿà¥€. à¤¸à¤¿à¤®à¥‡à¤‚à¤Ÿà¥à¤¸" 
                    value={newCompanyName} 
                    onChange={(e) => setNewCompanyName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>à¤¶à¤¹à¤° / à¤¤à¤¾à¤²à¥à¤•à¤¾ (Place)</label>
                  <input 
                    type="text" 
                    placeholder="à¤‰à¤¦à¤¾. à¤®à¤¾à¤²à¥‡à¤—à¤¾à¤µ" 
                    value={newCompanyPlace} 
                    onChange={(e) => setNewCompanyPlace(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>à¤—à¤¾à¤‚à¤µ (Village)</label>
                  <input 
                    type="text" 
                    placeholder="à¤‰à¤¦à¤¾. à¤¨à¤¿à¤®à¤—à¤¾à¤µ" 
                    value={newCompanyVillage} 
                    onChange={(e) => setNewCompanyVillage(e.target.value)} 
                  />
                </div>
                <button type="submit" className="primary-btn" style={{ justifyContent: "center", marginTop: "10px" }} disabled={companyLoading}>
                  {companyLoading ? "à¤¨à¥‹à¤‚à¤¦à¤£à¥€ à¤¹à¥‹à¤¤ à¤†à¤¹à¥‡..." : "à¤•à¤‚à¤ªà¤¨à¥€ à¤œà¤¤à¤¨ à¤•à¤°à¤¾ (Register)"}
                </button>
              </form>
            </div>

            {/* Right Column: Registered Companies List */}
            <div className="card" style={{ flex: "2 1 500px", margin: 0, padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px", marginBottom: "15px" }}>
                à¤¨à¥‹à¤‚à¤¦à¤£à¥€à¤•à¥ƒà¤¤ à¤•à¤‚à¤ªà¤¨à¥à¤¯à¤¾à¤‚à¤šà¥€ à¤¯à¤¾à¤¦à¥€ ({dealers.length})
              </h3>
              {dealers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                  à¤…à¤œà¥‚à¤¨ à¤•à¥‹à¤£à¤¤à¥€à¤¹à¥€ à¤•à¤‚à¤ªà¤¨à¥€ à¤¨à¥‹à¤‚à¤¦à¤£à¥€à¤•à¥ƒà¤¤ à¤•à¥‡à¤²à¥‡à¤²à¥€ à¤¨à¤¾à¤¹à¥€.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>à¤•à¤‚à¤ªà¤¨à¥€à¤šà¥‡ à¤¨à¤¾à¤µ</th>
                        <th>à¤¶à¤¹à¤°/à¤¤à¤¾à¤²à¥à¤•à¤¾</th>
                        <th>à¤—à¤¾à¤‚à¤µ</th>
                        <th style={{ width: "20%" }}>à¤•à¥ƒà¤¤à¥€ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealers.map((d) => (
                        <tr key={d.id}>
                          <td data-label="à¤•à¤‚à¤ªà¤¨à¥€à¤šà¥‡ à¤¨à¤¾à¤µ" style={{ textAlign: "left" }}>
                            <button 
                              onClick={() => {
                                setSelectedCompany(d);
                              }}
                              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                              title="à¤¯à¤¾ à¤•à¤‚à¤ªà¤¨à¥€à¤šà¥‡ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² à¤µ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤° à¤ªà¤¹à¤¾"
                            >
                              {d.name}
                            </button>
                          </td>
                          <td data-label="à¤¶à¤¹à¤°/à¤¤à¤¾à¤²à¥à¤•à¤¾">{d.place || "-"}</td>
                          <td data-label="à¤—à¤¾à¤‚à¤µ">{d.village || "-"}</td>
                          <td data-label="à¤•à¥ƒà¤¤à¥€">
                            <button 
                              className="primary-btn btn-danger btn-sm" 
                              style={{ padding: "4px 8px", background: "#C94A4A", margin: "0 auto" }}
                              onClick={() => handleDeleteCompany(d.id)}
                            >
                              <Trash2 size={14} /> à¤¹à¤Ÿà¤µà¤¾
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
              <ArrowLeft size={16} /> à¤‘à¤°à¥à¤¡à¤°à¥à¤¸ à¤¯à¤¾à¤¦à¥€à¤•à¤¡à¥‡ à¤œà¤¾
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2B2F2A", margin: 0 }}>
              {selectedOrder.dealerName} â€” à¤‘à¤°à¥à¤¡à¤°à¥à¤¸ à¤µ à¤Ÿà¥à¤°à¤• à¤²à¥‹à¤¡à¤¿à¤‚à¤— à¤°à¥‡à¤•à¥‰à¤°à¥à¤¡à¥à¤¸
            </h2>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            
            {/* Left Column: Order stats & details */}
            <div className="card" style={{ flex: "1 1 300px", margin: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px" }}>à¤‘à¤°à¥à¤¡à¤° à¤¸à¤¾à¤°à¤¾à¤‚à¤¶</h3>
              <p style={{ margin: 0 }}><strong>P.O. à¤•à¥à¤°à¤®à¤¾à¤‚à¤•:</strong> {selectedOrder.poNo || "N/A"}</p>
              <p style={{ margin: 0 }}><strong>à¤¡à¥€à¤²à¤° à¤¨à¤¾à¤µ:</strong> {selectedOrder.dealerName}</p>
              <p style={{ margin: 0 }}><strong>à¤ªà¤¤à¥à¤¤à¤¾:</strong> {selectedOrder.place} / {selectedOrder.village}</p>
              <p style={{ margin: 0 }}><strong>à¤à¤•à¥‚à¤£ à¤‘à¤°à¥à¤¡à¤° à¤µà¤œà¤¨:</strong> {selectedOrder.totalOrderedWeight || 0} Tons</p>
              <p style={{ margin: 0 }}><strong>à¤ªà¤¾à¤ à¤µà¤²à¥‡à¤²à¥‡ à¤à¤•à¥‚à¤£ à¤µà¤œà¤¨:</strong> {selectedOrder.fulfilledWeight || 0} Tons</p>
              <p style={{ margin: 0 }}><strong>à¤¬à¤¾à¤•à¥€ à¤µà¤œà¤¨:</strong> {selectedOrder.remainingWeight || 0} Tons</p>
              <p style={{ margin: 0 }}>
                <strong>à¤¸à¥à¤¥à¤¿à¤¤à¥€:</strong> 
                <span style={{ marginLeft: "6px" }} className={`badge ${selectedOrder.status === "fulfilled" ? "badge-paid" : selectedOrder.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                  {selectedOrder.status === "fulfilled" ? "à¤ªà¥‚à¤°à¥à¤£" : selectedOrder.status === "partially_fulfilled" ? "à¤…à¤‚à¤¶à¤¤à¤ƒ à¤ªà¥‚à¤°à¥à¤£" : "à¤ªà¥à¤°à¤²à¤‚à¤¬à¤¿à¤¤"}
                </span>
              </p>

              {selectedOrder.status === "fulfilled" || Number(selectedOrder.remainingWeight || 0) <= 0 ? (
                <button 
                  className="primary-btn btn-ghost" 
                  style={{ marginTop: "10px", width: "100%", justifyContent: "center", cursor: "not-allowed", opacity: 0.6 }} 
                  disabled
                  title="à¤‘à¤°à¥à¤¡à¤° à¤ªà¥‚à¤°à¥à¤£ à¤à¤¾à¤²à¥€ à¤†à¤¹à¥‡, à¤¤à¥à¤¯à¤¾à¤®à¥à¤³à¥‡ à¤¨à¤µà¥€à¤¨ à¤Ÿà¥à¤°à¤• à¤²à¥‹à¤¡ à¤•à¤°à¤¤à¤¾ à¤¯à¥‡à¤£à¤¾à¤° à¤¨à¤¾à¤¹à¥€."
                >
                  <Truck size={16} /> à¤‘à¤°à¥à¤¡à¤° à¤ªà¥‚à¤°à¥à¤£ à¤à¤¾à¤²à¥€ (Order Fulfilled)
                </button>
              ) : (
                <button className="primary-btn" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} onClick={() => setShowDispatchForm(true)}>
                  <Truck size={16} /> à¤¨à¤µà¥€à¤¨ à¤Ÿà¥à¤°à¤• à¤²à¥‹à¤¡ à¤•à¤°à¤¾ (Dispatch Truck)
                </button>
              )}

              <button 
                className="primary-btn btn-danger" 
                style={{ marginTop: "10px", width: "100%", justifyContent: "center", background: "#C94A4A" }} 
                onClick={() => handleDeleteOrder(selectedOrder.id)}
              >
                <Trash2 size={16} /> à¤‘à¤°à¥à¤¡à¤° à¤¹à¤Ÿà¤µà¤¾ (Delete Order)
              </button>
            </div>

            {/* Right Column: Dispatch History list */}
            <div className="card" style={{ flex: "2 1 500px", margin: 0, padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #E6E1D8", paddingBottom: "8px", marginBottom: "15px" }}>
                à¤ªà¤¾à¤ à¤µà¤²à¥‡à¤²à¥à¤¯à¤¾ à¤Ÿà¥à¤°à¤•à¥à¤¸ à¤¨à¥‹à¤‚à¤¦à¥€ (Dispatch Log)
              </h3>

              {!selectedOrder.dispatches || selectedOrder.dispatches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#828B7E" }}>
                  à¤¯à¤¾ à¤‘à¤°à¥à¤¡à¤°à¤µà¤° à¤…à¤œà¥‚à¤¨ à¤•à¥‹à¤£à¤¤à¤¾à¤¹à¥€ à¤Ÿà¥à¤°à¤• à¤²à¥‹à¤¡ à¤•à¥‡à¤²à¤¾ à¤¨à¤¾à¤¹à¥€.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>à¤¬à¤¿à¤² à¤¨à¤‚.</th>
                        <th>à¤¤à¤¾à¤°à¥€à¤–</th>
                        <th>à¤—à¤¾à¤¡à¥€ à¤¨à¤‚à¤¬à¤°</th>
                        <th>à¤®à¤¾à¤² à¤ªà¥à¤°à¤•à¤¾à¤°</th>
                        <th>à¤µà¤œà¤¨ (Tons)</th>
                        <th>à¤­à¤¾à¤¡à¥‡</th>
                        <th>à¤•à¥ƒà¤¤à¥€ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.dispatches.map((d) => (
                        <tr key={d.id}>
                          <td data-label="à¤¬à¤¿à¤² à¤¨à¤‚.">{d.billNo}</td>
                          <td data-label="à¤¤à¤¾à¤°à¥€à¤–">{d.date}</td>
                          <td data-label="à¤—à¤¾à¤¡à¥€ à¤¨à¤‚à¤¬à¤°"><strong>{d.truckNo}</strong></td>
                          <td data-label="à¤®à¤¾à¤² à¤ªà¥à¤°à¤•à¤¾à¤°">{d.cropType}</td>
                          <td data-label="à¤µà¤œà¤¨">{d.weight} Tons</td>
                          <td data-label="à¤­à¤¾à¤¡à¥‡">
                            <span style={{ fontSize: "11px", color: "#828B7E" }}>
                              à¤à¤•à¥‚à¤£: â‚¹{d.totalFreight || 0}<br />
                              à¤¬à¤¾à¤•à¥€: <span style={{ color: d.due_freight > 0 ? "red" : "green" }}>â‚¹{d.due_freight || 0}</span>
                            </span>
                          </td>
                          <td data-label="à¤•à¥ƒà¤¤à¥€">
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button 
                                className="primary-btn btn-ghost btn-sm" 
                                style={{ padding: "4px 8px" }}
                                onClick={() => openCuttingModal(d, selectedOrder.id)}
                                title="à¤•à¤‚à¤ªà¤¨à¥€ à¤…à¤‚à¤¤à¤¿à¤® à¤˜à¤Ÿ/à¤¨à¥à¤•à¤¸à¤¾à¤¨ à¤¨à¥‹à¤‚à¤¦à¤µà¤¾"
                              >
                                âš–ï¸ à¤˜à¤Ÿ à¤¨à¥‹à¤‚à¤¦
                              </button>
                              <button 
                                className="primary-btn btn-ghost btn-sm" 
                                style={{ padding: "4px 8px" }}
                                onClick={() => {
                                  setSelectedDispatchForPreview(d);
                                  setShowInvoicePreview(true);
                                }}
                              >
                                <FileText size={14} /> à¤¬à¤¿à¤²
                              </button>
                              <button 
                                className="primary-btn btn-danger btn-sm" 
                                style={{ padding: "4px 8px", background: "#C94A4A" }}
                                onClick={() => handleDeleteDispatch(d.id)}
                              >
                                <Trash2 size={14} /> à¤¹à¤Ÿà¤µà¤¾
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

    </PageWrapper>
  );
};

export default DealerDashboard;
