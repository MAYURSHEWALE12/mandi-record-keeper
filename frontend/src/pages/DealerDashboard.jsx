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
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("dealer_activeTab") || "orders";
  });
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
  const leftSlipRef = useRef();
  const rightSlipRef = useRef();
  const ledgerRef = useRef();

  // Company Profile Dashboard States
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [profileTab, setProfileTab] = useState("orders"); // orders, trucks, payments

  // Cutting Modal States
  const [showCuttingModal, setShowCuttingModal] = useState(false);
  const [selectedDispatchForCutting, setSelectedDispatchForCutting] = useState(null);
  const [cuttingDispatchOrderId, setCuttingDispatchOrderId] = useState("");
  const [compWeight, setCompWeight] = useState("");
  const [compRate, setCompRate] = useState("");
  const [compDamageCut, setCompDamageCut] = useState("");
  const [compMoistureCut, setCompMoistureCut] = useState("");
  const [compOtherCut, setCompOtherCut] = useState("");
  const [compNote, setCompNote] = useState("");

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState("Bank Transfer");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentOrderId, setPaymentOrderId] = useState("");

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem("dealer_activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("dealer_selectedCompanyId", selectedCompany.id);
    } else {
      localStorage.removeItem("dealer_selectedCompanyId");
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedOrder) {
      localStorage.setItem("dealer_selectedOrderId", selectedOrder.id);
    } else {
      localStorage.removeItem("dealer_selectedOrderId");
    }
  }, [selectedOrder]);

  // Load orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/dealer-orders`);
      const data = await res.json();
      const ordersList = Array.isArray(data) ? data : [];
      setOrders(ordersList);

      const savedOrderId = localStorage.getItem("dealer_selectedOrderId");
      if (savedOrderId) {
        try {
          const detailRes = await fetch(`${API_URL}/api/dealer-orders/${savedOrderId}`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            setSelectedOrder(detailData);
          }
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

  const fetchDealers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dealers`);
      const data = await res.json();
      const dealersList = Array.isArray(data) ? data : [];
      setDealers(dealersList);

      const savedCompanyId = localStorage.getItem("dealer_selectedCompanyId");
      if (savedCompanyId) {
        const found = dealersList.find(d => d.id === savedCompanyId);
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

  const refreshData = async () => {
    await fetchOrders();
    // If order view is active, reload order details
    if (selectedOrder) {
      loadOrderDetails(selectedOrder.id);
    }
  };

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

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की ही संपूर्ण ऑर्डर आणि त्यावरील सर्व ट्रक नोंदी हटवायच्या आहेत?")) return;

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
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

  // PDF Download for Left Slip (Transport Freight Receipt)
  const downloadLeftSlipPDF = async () => {
    const element = leftSlipRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF in A5 portrait format
    const pdf = new jsPDF("p", "mm", "a5");
    const imgWidth = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Transport_Freight_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  // PDF Download for Right Slip (Loading Goods Receipt)
  const downloadRightSlipPDF = async () => {
    const element = rightSlipRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF in A5 portrait format
    const pdf = new jsPDF("p", "mm", "a5");
    const imgWidth = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Loading_Goods_Receipt_Bill_${selectedDispatchForPreview.billNo}.pdf`);
  };

  // PDF Download for Company Account Ledger Statement
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

  // Total stats for dealer portal
  const totalOrdersCount = orders.length;
  const totalOrderedTons = orders.reduce((sum, o) => sum + (o.totalOrderedWeight || 0), 0);
  const totalFulfilledTons = orders.reduce((sum, o) => sum + (o.fulfilledWeight || 0), 0);
  const totalPendingTons = Math.max(0, totalOrderedTons - totalFulfilledTons);

  const currentOrderForPreview = selectedDispatchForPreview 
    ? (orders.find(o => o.id === selectedDispatchForPreview.orderId) || selectedOrder || {}) 
    : {};

  const openCuttingModal = (dispatch, orderId) => {
    setSelectedDispatchForCutting(dispatch);
    setCuttingDispatchOrderId(orderId);
    setCompWeight(dispatch.compWeight !== undefined ? dispatch.compWeight : dispatch.weight);
    setCompRate(dispatch.compRate !== undefined ? dispatch.compRate : dispatch.rate);
    setCompDamageCut(dispatch.compDamageCut || "");
    setCompMoistureCut(dispatch.compMoistureCut || "");
    setCompOtherCut(dispatch.compOtherCut || "");
    setCompNote(dispatch.compNote || "");
    setShowCuttingModal(true);
  };

  const handleSaveCutting = async (e) => {
    e.preventDefault();
    if (!selectedDispatchForCutting) return;

    const sentAmt = Number(selectedDispatchForCutting.amount || 0);
    const receivedBaseVal = Number(compWeight || 0) * Number(compRate || 0) * 10;
    const cuts = Number(compDamageCut || 0) + Number(compMoistureCut || 0) + Number(compOtherCut || 0);
    const passedAmount = receivedBaseVal - cuts;
    const lossAmount = sentAmt - passedAmount;

    const payload = {
      compWeight: Number(compWeight),
      compRate: Number(compRate),
      compDamageCut: Number(compDamageCut || 0),
      compMoistureCut: Number(compMoistureCut || 0),
      compOtherCut: Number(compOtherCut || 0),
      passedAmt: passedAmount,
      lossAmt: lossAmount,
      compNote: compNote
    };

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${cuttingDispatchOrderId}/dispatch/${selectedDispatchForCutting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("कंपनी अंतिम पावती & घट तपशील यशस्वीरित्या जतन केले ✅");
        setShowCuttingModal(false);
        refreshData();
      } else {
        alert("माहिती जतन करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!paymentOrderId || !paymentAmount) {
      alert("कृपया आवश्यक माहिती भरा.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${paymentOrderId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          date: paymentDate,
          mode: paymentMode,
          refNo: paymentRefNo,
          note: paymentNote
        })
      });

      if (res.ok) {
        alert("कंपनी पेमेंट व्यवहार यशस्वीरित्या जोडला गेला ✅");
        setPaymentAmount("");
        setPaymentRefNo("");
        setPaymentNote("");
        setShowPaymentModal(false);
        refreshData();
      } else {
        alert("पेमेंट जतन करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  const handleDeletePayment = async (orderId, paymentId) => {
    if (!window.confirm("तुम्हाला खात्री आहे की हा पेमेंट व्यवहार हटवायचा आहे?")) return;

    try {
      const res = await fetch(`${API_URL}/api/dealer-orders/${orderId}/payment/${paymentId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("पेमेंट व्यवहार यशस्वीरित्या हटवला गेला ✅");
        refreshData();
      } else {
        alert("पेमेंट हटवताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderCompanyProfile = () => {
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

    // Financial Tally
    const totalSent = companyDispatches.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const totalCuts = companyDispatches.reduce((sum, d) => sum + Number(d.lossAmt || 0), 0);
    const totalPassed = totalSent - totalCuts;
    const totalPaid = companyPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const totalBalance = totalPassed - totalPaid;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Back and Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="back-btn" onClick={() => setSelectedCompany(null)}>
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
              setPaymentOrderId(companyOrders[0].id);
              setShowPaymentModal(true);
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
            onClick={() => setProfileTab("orders")}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            📄 ऑर्डर्स यादी ({companyOrders.length})
          </button>
          <button 
            className={`primary-btn ${profileTab === "trucks" ? "" : "btn-ghost"}`}
            onClick={() => setProfileTab("trucks")}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            🚚 ट्रान्सपोर्ट & ट्रक्स ({companyDispatches.length})
          </button>
          <button 
            className={`primary-btn ${profileTab === "payments" ? "" : "btn-ghost"}`}
            onClick={() => setProfileTab("payments")}
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
                        <th>एकूण वजन (T)</th>
                        <th>लोड केलेले (T)</th>
                        <th>बाकी वजन (T)</th>
                        <th>स्थिती</th>
                        <th>कृती</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyOrders.map(o => (
                        <tr key={o.id}>
                          <td data-label="P.O. नं.">{o.poNo || "N/A"}</td>
                          <td data-label="तारीख">{o.orderDate}</td>
                          <td data-label="एकूण वजन">{o.totalOrderedWeight} T</td>
                          <td data-label="लोड केलेले">{o.fulfilledWeight.toFixed(2)} T</td>
                          <td data-label="बाकी वजन">{o.remainingWeight.toFixed(2)} T</td>
                          <td data-label="स्थिती">
                            <span className={`badge ${o.status === "fulfilled" ? "badge-paid" : o.status === "partially_fulfilled" ? "badge-pending" : "badge-due"}`}>
                              {o.status === "fulfilled" ? "पूर्ण" : o.status === "partially_fulfilled" ? "अंशतः पूर्ण" : "बाकी"}
                            </span>
                          </td>
                          <td data-label="कृती">
                            <button 
                              className="primary-btn btn-ghost btn-sm" 
                              onClick={() => {
                                setSelectedOrder(o);
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
                                  onClick={() => openCuttingModal(d, d.orderId)}
                                  title="कंपनी अंतिम घट/नुकसान नोंदवा"
                                >
                                  ⚖️ घट नोंद
                                </button>
                                <button 
                                  className="primary-btn btn-sm btn-success" 
                                  style={{ padding: "4px 8px" }}
                                  onClick={() => {
                                    setSelectedDispatchForPreview(d);
                                    setShowInvoicePreview(true);
                                  }}
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
                              onClick={() => handleDeletePayment(p.orderId, p.id)}
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
      </div>
    );
  };

  return (
    <PageWrapper title="🚚 डीलर ऑर्डर्स व ट्रक लोडिंग व्यवस्थापन">
      
      {/* Analytics Grid */}
      {!selectedOrder && !selectedCompany && (
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
      )}

      {/* Tab Navigation */}
      {!selectedOrder && !selectedCompany && (
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

      {/* Conditional Rendering: Main Dashboard, Company Profile Dashboard or Selected Order Details */}
      {selectedCompany ? (
        renderCompanyProfile()
      ) : !selectedOrder ? (
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
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button className="primary-btn btn-success" onClick={downloadLeftSlipPDF}>वाहतूक पावती 📥 (Transport)</button>
                <button className="primary-btn btn-success" onClick={downloadRightSlipPDF}>माल पावती 📥 (Loading)</button>
                <button className="primary-btn btn-success" onClick={downloadReceiptPDF}>एकत्रित पावती 📥 (Combined)</button>
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
              <div ref={leftSlipRef} style={styles.billSlipLeft}>
                
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
              <div ref={rightSlipRef} style={styles.billSlipRight}>
                
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
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="card modal-content" style={styles.modalContent}>
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
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="card modal-content" style={styles.modalContent}>
            <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
              💰 नवीन कंपनी पेमेंट व्यवहार
            </h2>
            <form onSubmit={handleAddPayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              <div className="form-group">
                <label>निवडलेली ऑर्डर (Linked P.O. Number) *</label>
                <select 
                  value={paymentOrderId} 
                  onChange={(e) => setPaymentOrderId(e.target.value)} 
                  required
                >
                  {orders
                    .filter(o => o.dealerName === selectedCompany?.name)
                    .map(o => (
                      <option key={o.id} value={o.id}>P.O. {o.poNo || "N/A"} ({o.orderDate})</option>
                    ))}
                </select>
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
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                    <option>Bank Transfer</option>
                    <option>RTGS / NEFT</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                    <option>UPI</option>
                  </select>
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
