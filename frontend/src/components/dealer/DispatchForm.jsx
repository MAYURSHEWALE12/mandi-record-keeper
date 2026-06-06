import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api";
import CustomDropdown from "../common/CustomDropdown";

const DispatchForm = ({ show, selectedOrder, physicalStockTons, onClose, onDispatchAdded }) => {
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

  const handleAddDispatch = async (e) => {
    e.preventDefault();
    if (!truckNo || !weight || !rate) {
      toast.error("कृपया ट्रक नंबर, वजन आणि भाव भरा.");
      return;
    }

    const maxAllowed = physicalStockTons;

    if (Number(weight) > maxAllowed + 0.0001) {
      toast.error(`चूक: आपण उपलब्ध भौतिक साठ्यापेक्षा (${maxAllowed.toFixed(2)} Tons) जास्त वजन लोड करू शकत नाही!`);
      return;
    }

    const calculatedAmount = Number(weight) * Number(rate) * 10;
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
      const res = await api.post(`/api/dealer-orders/${selectedOrder.id}/dispatch`, dispatchData);

      if (res.status === 200 || res.status === 201) {
        toast.success("ट्रक लोडिंग नोंद यशस्वी झाली ✅");
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
        onClose();
        onDispatchAdded();
      } else {
        toast.error("लोडिंग नोंद सेव्ह करताना चूक झाली.");
      }
    } catch (err) {
      console.error(err);
      toast.error("सर्व्हरशी संपर्क साधू शकला नाही.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="card modal-content" style={{ maxWidth: "750px" }}>
        <h2 style={{ borderBottom: "1px solid #E6E1D8", paddingBottom: "10px", marginBottom: "15px" }}>
          🚚 नवीन गाडी (ट्रक) लोडिंग नोंदणी
        </h2>
        <form onSubmit={handleAddDispatch} style={{ display: "flex", flexDirection: "column", gap: "14px", paddingRight: "10px" }}>
          
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
              <CustomDropdown
                value={cropType}
                onChange={setCropType}
                options={["मका"]}
                placeholder="मालाचा प्रकार निवडा"
              />
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
              <label>
                निव्वळ वजन (Tons मध्ये) *
                {selectedOrder && (
                  <span style={{ color: "#E5A93C", fontWeight: "bold", marginLeft: "8px" }}>
                    (कमाल उपलब्ध साठा: {physicalStockTons.toFixed(2)} Tons)
                  </span>
                )}
              </label>
              <input type="number" step="any" placeholder={`उदा. कमाल ${physicalStockTons.toFixed(2)} Tons`} value={weight} onChange={(e) => setWeight(e.target.value)} required />
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
            <button type="button" className="primary-btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>रद्द करा</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchForm;
