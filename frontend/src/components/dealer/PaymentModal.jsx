import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api";
import CustomDropdown from "../common/CustomDropdown";

const PaymentModal = ({ show, orders = [], selectedCompany, paymentOrderId, onSetPaymentOrderId, onClose, onPaymentAdded }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState("Bank Transfer");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!paymentOrderId || !paymentAmount) {
      toast.error("कृपया आवश्यक माहिती भरा.");
      return;
    }

    try {
      const res = await api.post(`/api/dealer-orders/${paymentOrderId}/payment`, {
        amount: Number(paymentAmount),
        date: paymentDate,
        mode: paymentMode,
        refNo: paymentRefNo,
        note: paymentNote
      });

      if (res.status === 201) {
        toast.success("कंपनी पेमेंट व्यवहार यशस्वीरित्या जोडला गेला ✅");
        setPaymentAmount("");
        setPaymentRefNo("");
        setPaymentNote("");
        onClose();
        onPaymentAdded();
      } else {
        toast.error("पेमेंट जतन करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      toast.error("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="card modal-content">
        <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
          💰 नवीन कंपनी पेमेंट व्यवहार
        </h2>
        <form onSubmit={handleAddPayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <div className="form-group">
            <label>निवडलेली ऑर्डर (Linked P.O. Number) *</label>
            <CustomDropdown
              value={paymentOrderId}
              onChange={onSetPaymentOrderId}
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
            <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>रद्द करा</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
