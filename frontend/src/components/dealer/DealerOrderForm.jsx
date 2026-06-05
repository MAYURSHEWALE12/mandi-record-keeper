import React, { useState } from "react";
import api from "../../api";
import CustomDropdown from "../common/CustomDropdown";

const DealerOrderForm = ({ show, dealers, availableStockTons, onClose, onOrderAdded }) => {
  const [poNo, setPoNo] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [place, setPlace] = useState("");
  const [village, setVillage] = useState("");
  const [totalOrderedWeight, setTotalOrderedWeight] = useState("");

  const handleAddOrder = async (e) => {
    e.preventDefault();
    if (!dealerName || !totalOrderedWeight) {
      alert("कृपया आवश्यक माहिती भरा.");
      return;
    }

    if (Number(totalOrderedWeight) > availableStockTons) {
      alert(`चूक: शिल्लक मका साठ्यापेक्षा (${availableStockTons.toFixed(2)} Tons) जास्त ऑर्डर वजन नोंदवू शकत नाही!`);
      return;
    }

    try {
      const res = await api.post("/api/dealer-orders", {
        poNo,
        dealerName,
        place,
        village,
        totalOrderedWeight: Number(totalOrderedWeight),
      });

      if (res.status === 201) {
        alert("डीलर ऑर्डर यशस्वीरित्या तयार केली ✅");
        setPoNo("");
        setDealerName("");
        setPlace("");
        setVillage("");
        setTotalOrderedWeight("");
        onClose();
        onOrderAdded();
      } else {
        alert("ऑर्डर सेव्ह करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      alert("सर्व्हरशी संपर्क होऊ शकला नाही.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="card modal-content">
        <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px" }}>नवीन डीलर ऑर्डर नोंदणी</h2>
        <form onSubmit={handleAddOrder} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label>P.O. क्रमांक (P.O. Number)</label>
            <input type="text" placeholder="उदा. PO-12345" value={poNo} onChange={(e) => setPoNo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>डीलर / कंपनीचे नाव (Company Name) *</label>
            <CustomDropdown
              value={dealerName}
              onChange={(selectedName) => {
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
              options={[
                { value: "", label: "कंपनी निवडा (Select Registered Company)" },
                ...dealers.map((d) => ({ value: d.name, label: d.name }))
              ]}
              placeholder="कंपनी निवडा (Select Registered Company)"
            />
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
            <label>
              एकूण वजन ऑर्डर (Tons मध्ये) *
              <span style={{ color: "#E5A93C", fontWeight: "bold", marginLeft: "8px" }}>
                (शिल्लक साठा: {availableStockTons.toFixed(2)} Tons)
              </span>
            </label>
            <input type="number" step="any" placeholder={`उदा. कमाल ${availableStockTons.toFixed(2)} Tons`} value={totalOrderedWeight} onChange={(e) => setTotalOrderedWeight(e.target.value)} required />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: "center" }}>ऑर्डर जतन करा</button>
            <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>रद्द करा</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealerOrderForm;
