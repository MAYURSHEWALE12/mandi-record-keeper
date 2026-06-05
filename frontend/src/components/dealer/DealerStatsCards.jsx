import React from "react";

const DealerStatsCards = ({ totalOrdersCount, totalOrderedTons, totalFulfilledTons, totalPendingTons, availableStockTons, availableStockQuintals }) => {
  return (
    <div className="stats-grid" style={{ marginBottom: "30px" }}>
      <div className="stat-card" style={{ borderLeft: "4px solid #4E653C" }}>
        <h3>एकूण डीलर ऑर्डर्स</h3>
        <p>{totalOrdersCount}</p>
      </div>
      <div className="stat-card" style={{ borderLeft: "4px solid #D49A2E" }}>
        <h3>एकूण ऑर्डर वजन (Tons)</h3>
        <p>{totalOrderedTons.toFixed(2)} Tons</p>
      </div>
      <div className="stat-card" style={{ borderLeft: "4px solid #1C1C1C" }}>
        <h3>पूर्ण झालेले वजन (Tons)</h3>
        <p style={{ color: "#1C1C1C" }}>{totalFulfilledTons.toFixed(2)} Tons</p>
      </div>
      <div className="stat-card" style={{ borderLeft: "4px solid #C94A4A" }}>
        <h3>बाकी वजन (Tons)</h3>
        <p style={{ color: "#C94A4A" }}>{totalPendingTons.toFixed(2)} Tons</p>
      </div>
      <div className="stat-card" style={{ borderLeft: "4px solid #E5A93C" }}>
        <h3>मका शिल्लक साठा</h3>
        <p style={{ color: "#E5A93C" }}>
          {availableStockTons.toFixed(2)} Tons 
          <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "6px", fontWeight: "normal" }}>
            ({availableStockQuintals.toFixed(0)} क्विंटल)
          </span>
        </p>
      </div>
    </div>
  );
};

export default DealerStatsCards;
