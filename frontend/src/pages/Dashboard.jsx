import React, { useState, useEffect } from "react";
import Invoice from "../components/dashboard/Invoice";
import { Zap } from "lucide-react";
import "../styles/modern.css";

const Dashboard = () => {
  const [liveBhav, setLiveBhav] = useState("ताजे बाजारभाव लोड होत आहेत, कृपया प्रतीक्षा करा...");

  useEffect(() => {
    const getLiveMarketData = async () => {
      try {
        const apiKey = "579b464db66ec23bdd000001dc6ef7663e8746615667305510709d20";
        const url = `https://api.data.gov.in/resource/9ef27131-652a-4a3a-a3a3-705074e767c7?api-key=${apiKey}&format=json&limit=20`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.records && data.records.length > 0) {
          const formattedData = data.records.map(item =>
            `${item.commodity} (${item.market}): ₹${item.modal_price}`
          ).join("   |   ");
          setLiveBhav(formattedData + "   |   के.टी. ट्रेडर्स Live Update   |   ");
        }
      } catch (error) {
        setLiveBhav("मका ₹२,३५० | सोयाबीन ₹४,८०० | कापूस ₹७,५०० | तूर ₹९,६०० | गहू ₹२,९०० | के.टी. ट्रेडर्स");
      }
    };

    getLiveMarketData();
    const interval = setInterval(getLiveMarketData, 900000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-header">
        <h2>चलन जनरेटर</h2>
      </div>

      <div className="dashboard-marquee" style={{
        margin: "16px 32px",
        display: "flex",
        alignItems: "center",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        height: "60px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div className="dashboard-marquee-label" style={{
          background: "linear-gradient(135deg, var(--blue), var(--blue-hover))",
          color: "white",
          padding: "0 20px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontWeight: "700",
          fontSize: "15px",
          whiteSpace: "nowrap",
          gap: "8px",
        }}>
          <Zap size={18} fill="white" />
          आजचे बाजारभाव
        </div>
        <div className="marquee-track">
          <div className="marquee-content">
            {liveBhav}
          </div>
        </div>
      </div>

      <div className="dashboard-invoice-wrap" style={{ padding: "0 32px 32px" }}>
        <Invoice />
      </div>
    </div>
  );
};

export default Dashboard;
