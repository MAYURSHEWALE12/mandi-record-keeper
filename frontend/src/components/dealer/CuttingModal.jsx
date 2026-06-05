import React, { useState, useEffect } from "react";
import api from "../../api";

const CuttingModal = ({ show, selectedDispatchForCutting, cuttingDispatchOrderId, onClose, onSaveSuccess }) => {
  const [compWeight, setCompWeight] = useState("");
  const [compRate, setCompRate] = useState("");
  const [compDamageCut, setCompDamageCut] = useState("");
  const [compMoistureCut, setCompMoistureCut] = useState("");
  const [compOtherCut, setCompOtherCut] = useState("");
  const [compNote, setCompNote] = useState("");

  useEffect(() => {
    if (selectedDispatchForCutting) {
      setCompWeight(selectedDispatchForCutting.compWeight !== undefined ? selectedDispatchForCutting.compWeight : selectedDispatchForCutting.weight);
      setCompRate(selectedDispatchForCutting.compRate !== undefined ? selectedDispatchForCutting.compRate : selectedDispatchForCutting.rate);
      setCompDamageCut(selectedDispatchForCutting.compDamageCut || "");
      setCompMoistureCut(selectedDispatchForCutting.compMoistureCut || "");
      setCompOtherCut(selectedDispatchForCutting.compOtherCut || "");
      setCompNote(selectedDispatchForCutting.compNote || "");
    }
  }, [selectedDispatchForCutting]);

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
      const res = await api.put(`/api/dealer-orders/${cuttingDispatchOrderId}/dispatch/${selectedDispatchForCutting.id}`, payload);

      if (res.status === 200) {
        alert("कंपनी अंतिम पावती & घट तपशील यशस्वीरित्या जतन केले ✅");
        onClose();
        const updatedDispatch = { ...selectedDispatchForCutting, ...payload };
        onSaveSuccess(updatedDispatch);
      } else {
        alert("माहिती जतन करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  if (!show || !selectedDispatchForCutting) return null;

  return (
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
            <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>रद्द करा (Cancel)</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CuttingModal;
