const BUSINESS_INFO = {
  name: "मे. के.टी. ट्रेडर्स",
  nameEn: "K. T. TRADERS",
  address: "मार्केट यार्ड, श्री व्यंकटेश बँकच्या मागे, मालेगाव कॅम्प जि. नाशिक.",
  addressEn: "Market Yard, Behind Shri Venkatesh Bank, Malegaon Camp, Dist. Nashik",
  phone1: "9850291298",
  phone2: "9767128838",
  supportPhone: "+91 98502 92298",
  bankAccount: "60484823811",
  bankIfsc: "MAHB0000832",
  bankName: "Bank of Maharashtra",
};

export const SLIP_STYLES = {
  container: {
    width: "100%",
    maxWidth: "500px",
    background: "#fcfbf9",
    border: "1.5px solid #000",
    padding: "24px",
    fontFamily: "sans-serif",
    color: "#000",
    boxSizing: "border-box",
    margin: "0 auto",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "2px solid #000",
    paddingBottom: "10px"
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
  titleArea: {
    flex: 1
  },
  mainTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
    color: "#8B0000"
  },
  subTitle: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#555"
  },
  addressLine: {
    fontSize: "9px",
    margin: "4px 0",
    borderBottom: "1px solid #000",
    paddingBottom: "2px",
    color: "#444"
  },
  metaLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
    fontSize: "11px"
  },
  fieldLine: {
    borderBottom: "1px dotted #555",
    paddingBottom: "3px",
    marginBottom: "8px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center"
  },
  fieldLabel: {
    fontWeight: "bold"
  },
  fieldValue: {
    marginLeft: "6px",
    fontWeight: "600",
    color: "#222"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "11px"
  },
  th: {
    border: "1px solid #000",
    padding: "6px",
    background: "#e8e8e8",
    fontWeight: "bold",
    textAlign: "center"
  },
  td: {
    border: "1px solid #000",
    padding: "6px",
    textAlign: "center"
  },
  summaryArea: {
    marginTop: "15px",
    fontSize: "11px"
  },
  balanceText: {
    color: "#C94A4A",
    fontWeight: "bold",
    fontSize: "13px"
  },
  footerSignatures: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "35px",
    fontSize: "11px"
  }
};

export default BUSINESS_INFO;
