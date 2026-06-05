# 🌽 के.टी. ट्रेडर्स — व्यवस्थापन प्रणाली / KT Traders Management System

> **कृषी व्यापार व्यवस्थापन — शेतकरी खरेदी नोंदी, डीलर ऑर्डर्स, ट्रक डिस्पॅच, पेमेंट लेजर व अहवाल**
>
> **Agricultural Trading Management — Farmer Purchase Records, Dealer Orders, Truck Dispatch, Payment Ledger & Reports**

---

## 📋 विषयसूची / Table of Contents

- [मराठी माहिती](#-मराठी-माहिती)
  - [प्रकल्पाचे वर्णन](#प्रकल्पाचे-वर्णन)
  - [मुख्य वैशिष्ट्ये](#मुख्य-वैशिष्ट्ये)
  - [प्रणाली आवश्यकता](#प्रणाली-आवश्यकता)
  - [स्थापना सूचना](#स्थापना-सूचना)
  - [वापर मार्गदर्शक](#वापर-मार्गदर्शक)
    - [प्रशासक / शेतकरी पोर्टल](#१-प्रशासक--शेतकरी-पोर्टल-डॅशबोर्ड)
    - [डीलर पोर्टल](#२-डीलर-पोर्टल)
- [English Guide](#-english-guide)
  - [Project Description](#project-description)
  - [Key Features](#key-features)
  - [System Requirements](#system-requirements)
  - [Installation Guide](#installation-guide)
  - [User Manual](#user-manual)
    - [Admin / Farmer Portal](#1-admin--farmer-portal)
    - [Dealer Portal](#2-dealer-portal)

---

## 🌐 मराठी माहिती

### प्रकल्पाचे वर्णन

**के.टी. ट्रेडर्स व्यवस्थापन प्रणाली** ही एक वेब-आधारित अनुप्रयोग आहे जी मालेगाव कॅम्प, जि. नाशिक येथील मे. के.टी. ट्रेडर्स या धान्य व्यापार संस्थेसाठी विकसित केली गेली आहे. ही प्रणाली शेतकऱ्यांकडून धान्य खरेदी, डीलर्सना माल पाठवणे, ट्रक डिस्पॅच व्यवस्थापन, पेमेंट ट्रॅकिंग आणि सर्व व्यवहारांचे अहवाल यांचे संपूर्ण व्यवस्थापन करते.

**प्रमुख उद्दिष्टे:**
- शेतकरी खरेदी नोंदी (मंडी बिले) व्यवस्थापित करणे
- डीलर (कंपनी) ऑर्डर व्यवस्थापन व ट्रक डिस्पॅच लॉजिस्टिक्स
- पेमेंट ट्रॅकिंग व लेजर व्यवस्थापन
- रिअल-टाइम मार्केट रेट प्रदर्शन
- पीडीएफ इन्व्हॉइस/रसीद निर्मिती

### मुख्य वैशिष्ट्ये

#### 🧑‍🌾 प्रशासक / शेतकरी पोर्टल
| वैशिष्ट्य | वर्णन |
|---|---|
| **इन्व्हॉइस जनरेटर** | तारीख, शेतकरी नाव, मोबाईल, पीक, दर/प्रमाण एंटर करून तत्काळ बिल तयार करा |
| **लाइव्ह मार्केट रेट्स** | data.gov.in वरून लाइव्ह मार्केट रेट दाखवतो (दर १५ मिनिटांनी रिफ्रेश) |
| **रिअल-टाइम बिल प्रिव्ह्यू** | बिल तयार करताना लगेच प्रिंट प्रिव्ह्यू बघा |
| **पीडीएफ डाउनलोड** | A5 आकारात इन्व्हॉइसचे पीडीएफ डाउनलोड करा |
| **रेकॉर्ड्स टेबल** | सर्व नोंदी सर्च, फिल्टर, पॅजिनेशनसह बघा |
| **CSV एक्सपोर्ट/इंपोर्ट** | डेटा CSV मध्ये एक्सपोर्ट किंवा इंपोर्ट करा |
| **स्टॅट्स कार्ड्स** | एकूण नोंदी, एकूण रक्कम, पेड, बाकी यांचे आकडे |
| **पेमेंट हिस्ट्री** | शेतकरी-निहाय पेमेंट लेजर प्रिंटसह |
| **बाकी व्यवहार** | फक्त बाकी असलेल्या नोंदी |
| **पूर्ण व्यवहार** | फक्त पूर्ण पेड केलेल्या नोंदी |
| **अहवाल** | तारीख श्रेणीनुसार फिल्टर केलेले अहवाल (आज, ७ दिवस, १ महिना, ६ महिने, सानुकूल) |

#### 🚚 डीलर पोर्टल
| वैशिष्ट्य | वर्णन |
|---|---|
| **ऑर्डर्स व्यवस्थापन** | नवीन ऑर्डर तयार करा, सर्व ऑर्डर्सचे कार्ड व्ह्यू |
| **ट्रक डिस्पॅच** | प्रत्येक ऑर्डरसाठी ट्रक डिस्पॅच नोंदवा (बिल नंबर, ट्रक नंबर, ड्रायव्हर माहिती, माल तपशील, भाडे) |
| **स्टॉक व्हॅलिडेशन** | उपलब्ध स्टॉकपेक्षा जास्त डिस्पॅच करू शकत नाही |
| **कंपनी प्रोफाइल** | प्रत्येक कंपनीचे तपशील, खरेदी-विक्रीचे आकडे, कटिंग/लॉस |
| **कटिंग मोडल** | कंपनीकडून मिळालेले वजन, दर, दर्जा कट यांची नोंद |
| **पेमेंट मोडल** | डीलरकडून मिळालेले पेमेंट नोंदवा (RTGS/Cheque/Cash/UPI) |
| **सर्व ट्रक लॉग** | सर्व ऑर्डर्समधील सर्व डिस्पॅच एकाच ठिकाणी, एक्सेल डाउनलोड |
| **इन्व्हॉइस प्रिव्ह्यू** | डबल-स्लिप बिल प्रिंट (ट्रान्सपोर्ट रसीद + लोडिंग रसीद) |
| **लेजर प्रिंट** | संपूर्ण कंपनी लेजर स्टेटमेंट पीडीएफ |

### प्रणाली आवश्यकता

- **वेब ब्राउजर**: Chrome, Firefox, Edge, Safari (शेवटची २ आवृत्ती)
- **इंटरनेट**: API कॉल्स आणि डेटाबेससाठी आवश्यक
- **स्क्रीन**: डेस्कटॉप / लॅपटॉप (मोबाइलवरही वापरता येईल)
- **प्रिंटर**: बिल प्रिंट करण्यासाठी (पर्यायी)

### स्थापना सूचना

#### स्थानिक विकास (Local Development)

```bash
# 1. रिपॉझिटरी क्लोन करा
git clone https://github.com/MAYURSHEWALE12/mandi-record-keeper.git
cd mandi-record-keeper

# 2. फ्रंटएंड डिपेंडन्सीज इंस्टॉल करा
cd frontend
npm install

# 3. बॅकएंड डिपेंडन्सीज इंस्टॉल करा
cd ../Backend-Node
npm install

# 4. एन्व्हायर्नमेंट व्हेरिएबल्स सेट करा
# Backend-Node/.env फाइल तयार करा:
#   SUPABASE_URL=your_supabase_url
#   SUPABASE_SERVICE_KEY=your_supabase_service_key
#   JWT_SECRET=your_jwt_secret
#   ADMIN_EMAIL=admin@example.com
#   ADMIN_PASSWORD=your_password

# 5. सर्व्हर सुरू करा
cd ../Backend-Node
npm start    # पोर्ट 8000 वर

# 6. फ्रंटएंड सुरू करा (नवीन टर्मिनल)
cd ../frontend
npm start    # पोर्ट 3000 वर

# 7. ब्राउजरमध्ये http://localhost:3000 ला जा
```

#### Supabase डेटाबेस सेटअप

तुमच्या Supabase प्रोजेक्टमध्ये खालील SQL चालवा:

```sql
-- bill_counters table
CREATE TABLE IF NOT EXISTS bill_counters (
  id INTEGER PRIMARY KEY DEFAULT 1,
  seq INTEGER NOT NULL DEFAULT 1000
);
INSERT INTO bill_counters (id, seq) VALUES (1, 1000) ON CONFLICT (id) DO NOTHING;

-- admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- records table (farmer purchase records)
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_no INTEGER,
  farmer_name TEXT,
  farmer_number TEXT,
  commodity JSONB,
  weight NUMERIC,
  weight_details TEXT,
  total_amount NUMERIC,
  paid_amount NUMERIC DEFAULT 0,
  due_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  payments JSONB DEFAULT '[]',
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dealer_orders table
CREATE TABLE IF NOT EXISTS dealer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_no TEXT,
  dealer_name TEXT,
  dealer_phone TEXT,
  place TEXT,
  village TEXT,
  total_ordered_weight NUMERIC,
  order_date DATE,
  expected_delivery DATE,
  status TEXT DEFAULT 'pending',
  dispatches JSONB DEFAULT '[]',
  payments JSONB DEFAULT '[]',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dealers table (registered companies)
CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  place TEXT,
  village TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC function for bill number auto-increment
CREATE OR REPLACE FUNCTION increment_bill_sequence()
RETURNS INTEGER AS $$
DECLARE
  new_seq INTEGER;
BEGIN
  UPDATE bill_counters SET seq = seq + 1 WHERE id = 1 RETURNING seq INTO new_seq;
  RETURN new_seq;
END;
$$ LANGUAGE plpgsql;
```

### वापर मार्गदर्शक

#### १. प्रशासक / शेतकरी पोर्टल (डॅशबोर्ड)

##### लॉगिन
1. `https://mandi-record-keeper.vercel.app` ला जा
2. तुमचा **ईमेल** आणि **पासवर्ड** टाका
3. "Sign In" बटण क्लिक करा
4. यशस्वी लॉगिननंतर **पोर्टल निवड** पेज उघडेल

##### पोर्टल निवड
- **🧑‍🌾 Farmer Invoice Generator** — शेतकरी खरेदी नोंदी व बिल जनरेशनसाठी
- **🚚 Dealer Dashboard** — डीलर ऑर्डर्स, ट्रक डिस्पॅच, पेमेंटसाठी

##### इन्व्हॉइस तयार करणे (Farmer Invoice Generator)
1. `/dashboard` वर जा (किंवा Farmer Invoice Generator निवडा)
2. **तारीख** निवडा (आजची तारीख प्री-फिल्ड आहे)
3. **शेतकरी नाव** टाका
4. **मोबाईल नंबर** टाका (१० आकडी)
5. **पीक** निवडा (ड्रॉपडाउनमधून)
6. **दर** (₹ प्रति क्विंटल) आणि **प्रमाण** (क्विंटल) टाका — एकूण रक्कम आपोआप कॅल्क्युलेट होईल
7. **पेड रक्कम** टाका (किती रक्कम आजच दिली)
8. बिल प्रिव्ह्यू उजवीकडे लाइव्ह दिसेल
9. **📥 PDF म्हणून डाउनलोड** — A5 PDF इन्व्हॉइस डाउनलोड
10. **✅ सेव्ह** — रेकॉर्ड सेव्ह करा. सबमिट केल्यानंतर नवीन फॉर्म क्लियर होईल आणि टेबल रिफ्रेश होईल

##### आजचे आकडे (Day Stats)
- इन्व्हॉइस फॉर्मच्या खाली तुम्हाला आजचे स्टॅट्स दिसतील:
  - आजच्या नोंदी, एकूण रक्कम, पेड, बाकी
  - कॉर्न स्टॉक: उपलब्ध स्टॉकची माहिती

##### रेकॉर्ड्स टेबल
- सर्व नोंदी सर्च, फिल्टर आणि पॅजिनेशनसह बघा
- प्रत्येक रेकॉर्डवर: पीडीएफ इन्व्हॉइस, एडिट, डिलीट
- CSV एक्सपोर्ट/इंपोर्ट बटणे

##### अ‍ॅडमिन पॅनल (`/admin`)
- **एकूण आकडे**: सर्व नोंदी, एकूण रक्कम, पेड, बाकी
- **आजचे आकडे**: आजच्या नोंदींचे स्टॅट्स
- **नवीन नोंद फॉर्म**: नवीन शेतकरी नोंद तयार करा किंवा एडिट करा
- **रेकॉर्ड्स टेबल**: सर्च, फिल्टर, CSV, पीडीएफ
- **डेंजर झोन**: "Reset Data" — सर्व डेटा क्लियर करा (प्रशासक पासवर्ड आवश्यक)

##### बाकी व्यवहार (`/pending`)
- फक्त बाकी रक्कम असलेल्या नोंदी
- शेतकरी नाव क्लिक केल्यास त्याच्या पेमेंट हिस्ट्रीकडे जाईल

##### पूर्ण व्यवहार (`/completed`)
- फक्त पूर्ण पेड केलेल्या नोंदी

##### पेमेंट हिस्ट्री (`/payment-history`)
1. शेतकरी सर्च बॉक्समध्ये नाव किंवा मोबाईल टाका
2. शेतकरी निवडल्यास त्याचे सर्व बिले दिसतील
3. प्रत्येक बिलात: पीक, प्रमाण, दर, एकूण, पेड, बाकी
4. पेमेंट टेबलमध्ये रनिंग बॅलन्ससह सर्व पेमेंटचा इतिहास
5. **🖨️ प्रिंट** बटण — प्रिंट फ्रेंडली लेजर

##### अहवाल (`/report`)
1. तारीख श्रेणी निवडा: आज / ७ दिवस / १ महिना / ६ महिने / सानुकूल
2. नावाने सर्च करा, पीक फिल्टर करा
3. पॅजिनेटेड टेबलमध्ये नोंदी बघा

---

#### २. डीलर पोर्टल

##### ऑर्डर्स व्यवस्थापन (डिफॉल्ट टॅब)

**नवीन ऑर्डर तयार करणे:**
1. **📦 + नवीन ऑर्डर** बटण क्लिक करा
2. **PO Number** — खरेदी ऑर्डर नंबर टाका
3. **कंपनीचे नाव** — ड्रॉपडाउनमधून कंपनी निवडा (किंवा नवीन कंपनी रजिस्टर करा)
4. **ठिकाण व गाव** टाका
5. **एकूण वजन** (टन मध्ये) टाका
6. **सेव्ह** करा

**ऑर्डरचे तपशील बघणे:**
- कोणत्याही ऑर्डर कार्डवर क्लिक करा
- तपशील पॅनेलमध्ये दिसेल:
  - **ऑर्डर सारांश**: PO#, डीलर नाव, पत्ता, ऑर्डर केलेले वजन, पूर्ण केलेले वजन, स्टेटस
  - **डिस्पॅच लॉग**: सर्व ट्रक डिस्पॅचची टेबल
  - **नवीन डिस्पॅच**: ट्रक एंट्री फॉर्म

**ट्रक डिस्पॅच नोंदवणे:**
1. **🚛 + नवीन डिस्पॅच** बटण क्लिक करा
2. **विभाग १ — रसीद व वाहतूक:**
   - बिल नंबर, तारीख, डिलिव्हरी ठिकाण, ब्रोकर नाव, ट्रान्सपोर्ट एजंट
3. **विभाग २ — वाहन व चालक:**
   - ट्रक नंबर, मालक नाव, चालक नाव/मोबाईल/लायसन्स/गाव
4. **विभाग ३ — माल तपशील:**
   - पीक (कॉर्न/गहू/कांदा/ज्वारी/बाजरी), पोती, ओलावा %, निव्वळ वजन (टन), दर — रक्कम आपोआप कॅल्क्युलेट
5. **विभाग ४ — भाडे गणना:**
   - भाडेदर प्रति पोते, अग्रिम भाडे — बाकी भाडे आपोआप
6. **स्टॉक चेक**: उपलब्ध स्टॉकपेक्षा जास्त डिस्पॅच करू शकत नाही
7. **✅ सेव्ह** करा

**इन्व्हॉइस प्रिव्ह्यू (डबल-स्लिप बिल):**
- कोणत्याही डिस्पॅचच्या "📄 बिल" बटणावर क्लिक करा
- दोन स्लिप्सचे बिल दिसेल:
  - **डावी स्लिप**: ट्रान्सपोर्ट फ्रेट रसीद (ट्रक, भाडे माहिती)
  - **उजवी स्लिप**: लोडिंग गुड्स रसीद (माल तपशील, रक्कम, बँक तपशील)
  - दोन्ही स्लिप्समध्ये छिद्र पाडलेल्या रेषेसारखी विभागणी
- **पर्याय**: फक्त ट्रान्सपोर्ट स्लिप / फक्त लोडिंग स्लिप / एकत्रित A4 PDF

##### कंपनीज टॅब

**नवीन कंपनी रजिस्टर:**
1. "Companies" टॅबवर जा
2. कंपनीचे नाव, ठिकाण, गाव टाका
3. **✅ सेव्ह** करा

**कंपनी प्रोफाइल:**
- कोणत्याही कंपनीच्या नावावर क्लिक करा
- **टॅली कार्ड्स**: ठिकाण, एकूण व्यापार मूल्य, एकूण कटिंग, पास केलेली रक्कम, मिळालेले पेमेंट, थकबाकी
- **ऑर्डर्स टॅब**: कंपनीच्या सर्व ऑर्डर्स
- **ट्रक्स टॅब**: डिस्पॅच रेकॉर्ड्स कटिंग/लॉससह
- **पेमेंट्स टॅब**: पेमेंट लेजर डिलीटसह

**कटिंग (कंपनी व्हेरिफिकेशन):**
- कोणत्याही डिस्पॅचसाठी "✂️ कटिंग" क्लिक करा
- मिळालेले वजन, दर, दर्जा कट (डॅमेज/ओलावा/इतर) टाका
- लॉस रक्कम व पास केलेली रक्कम आपोआप कॅल्क्युलेट होईल

**पेमेंट ऍड करणे:**
- कोणत्याही कंपनी प्रोफाइलमध्ये "➕ पेमेंट" क्लिक करा
- रक्कम, तारीख, मोड (Bank Transfer/RTGS/Cheque/Cash/UPI), संदर्भ नंबर, नोट

##### सर्व ट्रक लॉग टॅब
- सर्व ऑर्डर्समधील सर्व डिस्पॅच एकाच टेबलमध्ये
- फिल्टर: सर्व / शेवटचे ७ दिवस / शेवटचा महिना / सानुकूल तारीख श्रेणी
- 📥 **एक्सेल डाउनलोड** — स्टाइल केलेली XLS फाइल
- प्रत्येक डिस्पॅचसाठी "📄 बिल" बटण

##### सर्व पेमेंट्स टॅब
- लवकरच उपलब्ध

---

## 🇬🇧 English Guide

### Project Description

**KT Traders Management System** is a web-based application developed for **M/s. K. T. Traders**, a grain wholesale business based in Market Yard, Malegaon Camp, Dist. Nashik, Maharashtra. The system manages complete agricultural trade operations including farmer purchase records, dealer order management, truck dispatch logistics, payment tracking, and comprehensive reporting.

The application serves two primary portals:
- **🧑‍🌾 Farmer Portal** — For recording grain purchases from farmers, generating invoices, tracking payments
- **🚚 Dealer Portal** — For managing dealer orders, truck dispatches, company profiles, cutting/loss calculations, and payment tracking

### Key Features

- **Real-time Invoice Generator** — Create instant farmer purchase invoices with live preview
- **Live Market Rates** — Display real-time commodity prices from Indian government open data API
- **PDF Invoice Download** — Generate printable A5-size PDF invoices
- **Truck Dispatch Management** — Record complete truck load details (vehicle, driver, cargo, freight)
- **Company Profiles** — Per-company ledger with all orders, dispatches, payments
- **Cutting/Loss Calculation** — Company-side verification with damage/moisture/other deductions
- **Dual-Slip Invoice** — Two-column bill slip matching physical receipt books (transport + loading)
- **Payment Ledger** — Complete payment tracking with running balance and print support
- **CSV Export/Import** — Bulk data operations for records
- **Date-Range Reports** — Customizable reports with search and filter
- **Responsive Design** — Works on desktop and mobile devices
- **Dark/Light Theme** — User-selectable theme with persistent preference

### System Requirements

- **Browser**: Chrome, Firefox, Edge, or Safari (latest 2 versions)
- **Internet**: Required for API calls and database connectivity
- **Screen**: Desktop/laptop recommended; mobile supported
- **Printer**: Optional, for printing bills and ledgers

### Installation Guide

#### One-Click Deploy (Vercel)

The project is designed for Vercel deployment. Fork the repository and connect it to Vercel:

1. Fork the repo on GitHub
2. Create a new Vercel project connected to your fork
3. Set the following **Environment Variables** in Vercel dashboard:
   - `SUPABASE_URL` — Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` — Your Supabase service role key
   - `JWT_SECRET` — A strong random string for JWT signing
   - `ADMIN_EMAIL` — Admin login email
   - `ADMIN_PASSWORD` — Admin login password
   - `MARKET_API_KEY` — API key from data.gov.in (for market rates)
4. Vercel will auto-detect the build configuration from `vercel.json`
5. Deploy!

#### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/MAYURSHEWALE12/mandi-record-keeper.git
cd mandi-record-keeper

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../Backend-Node
npm install

# 4. Configure environment
# Create Backend-Node/.env:
#   SUPABASE_URL=your_supabase_url
#   SUPABASE_SERVICE_KEY=your_supabase_service_key
#   JWT_SECRET=your_jwt_secret
#   ADMIN_EMAIL=admin@example.com
#   ADMIN_PASSWORD=your_password

# 5. Start the backend server
cd ../Backend-Node
npm start    # Runs on port 8000

# 6. Start the frontend (new terminal)
cd ../frontend
npm start    # Runs on port 3000

# 7. Open http://localhost:3000 in your browser
```

#### Supabase Database Setup

Run the following SQL commands in your Supabase project's SQL Editor to create the required tables:

```sql
-- bill_counters table
CREATE TABLE IF NOT EXISTS bill_counters (
  id INTEGER PRIMARY KEY DEFAULT 1,
  seq INTEGER NOT NULL DEFAULT 1000
);
INSERT INTO bill_counters (id, seq) VALUES (1, 1000) ON CONFLICT (id) DO NOTHING;

-- admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- records table (farmer purchase records)
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_no INTEGER,
  farmer_name TEXT,
  farmer_number TEXT,
  commodity JSONB,
  weight NUMERIC,
  weight_details TEXT,
  total_amount NUMERIC,
  paid_amount NUMERIC DEFAULT 0,
  due_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  payments JSONB DEFAULT '[]',
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dealer_orders table
CREATE TABLE IF NOT EXISTS dealer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_no TEXT,
  dealer_name TEXT,
  dealer_phone TEXT,
  place TEXT,
  village TEXT,
  total_ordered_weight NUMERIC,
  order_date DATE,
  expected_delivery DATE,
  status TEXT DEFAULT 'pending',
  dispatches JSONB DEFAULT '[]',
  payments JSONB DEFAULT '[]',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- dealers table (registered companies)
CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  place TEXT,
  village TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC function for bill number auto-increment
CREATE OR REPLACE FUNCTION increment_bill_sequence()
RETURNS INTEGER AS $$
DECLARE
  new_seq INTEGER;
BEGIN
  UPDATE bill_counters SET seq = seq + 1 WHERE id = 1 RETURNING seq INTO new_seq;
  RETURN new_seq;
END;
$$ LANGUAGE plpgsql;
```

### User Manual

#### 1. Admin / Farmer Portal

##### Login
1. Navigate to `https://mandi-record-keeper.vercel.app`
2. Enter your **Email** and **Password**
3. Click **"Sign In"**
4. On success, you'll see the **Portal Selection** screen

##### Portal Selection
- **🧑‍🌾 Farmer Invoice Generator** — For managing farmer grain purchase records
- **🚚 Dealer Dashboard** — For managing dealer orders, truck dispatches, and payments

##### Creating an Invoice (`/dashboard`)
1. Go to Dashboard or select "Farmer Invoice Generator"
2. **Date** — Auto-filled with today; changeable
3. **Farmer Name** — Enter the farmer's full name
4. **Mobile** — 10-digit mobile number
5. **Crop** — Select from dropdown (corn, wheat, onion, jowar, bajra)
6. **Rate (₹/quintal)** — Enter the rate per quintal
7. **Quantity (quintals)** — Enter the weight in quintals
8. **Total Amount** — Auto-calculated (rate × quantity)
9. **Paid Amount** — Enter how much was paid today
10. **Live Preview** — See the bill slip update in real-time
11. **📥 Download PDF** — Download the A5-sized invoice
12. **✅ Save** — Save the record. Form resets, table refreshes

##### Day Statistics
Below the invoice form, today's stats cards show:
- Today's records count, total amount, paid, due
- Corn stock: inward stock from today's records minus outward dispatches

##### Records Table
- Searchable, filterable, paginated table of all records
- Actions per row: PDF invoice, Edit, Delete
- CSV Export/Import buttons

##### Admin Panel (`/admin`)
- **Total Stats**: All-time records, total amount, total paid, total due
- **Today's Stats**: Today's aggregated numbers
- **Add/Edit Record Form**: Create new or modify existing records
- **Records Table**: Full featured with search, filter, CSV, per-record PDF
- **Danger Zone**: "Reset All Data" — clears all transactional data (requires admin password)

##### Due Payments (`/pending`)
- Lists only records with outstanding balance
- Click farmer name → navigate to their Payment History

##### Completed Payments (`/completed`)
- Lists only fully paid records

##### Payment History (`/payment-history`)
1. Search farmer by name or mobile
2. Select a farmer to see all their bills
3. Each bill shows: crop, quantity, rate, total, paid, due
4. Payment table with running balance history
5. **🖨️ Print** — Print-friendly ledger format

##### Reports (`/report`)
1. Select date range: Today / 7 Days / 1 Month / 6 Months / Custom
2. Search by name, filter by crop
3. Paginated table of filtered records

---

#### 2. Dealer Portal

##### Orders Management (Default Tab)

**Creating a New Order:**
1. Click **📦 + New Order** button
2. **PO Number** — Enter purchase order number
3. **Company Name** — Select from dropdown or register a new company
4. **Place & Village** — Enter location details
5. **Total Weight** — Enter ordered weight in tons
6. Click **Save**

**Viewing Order Details:**
- Click any order card to expand detail panel:
  - **Order Summary**: PO#, dealer name, address, ordered weight, fulfilled weight, status
  - **Dispatch Log**: Table of all truck dispatches
  - **New Dispatch**: Truck entry form

**Recording a Truck Dispatch:**
1. Click **🚛 + New Dispatch** button within an order
2. **Section 1 — Receipt & Transport:**
   - Bill number, date, delivery place, broker name, transport agent
3. **Section 2 — Vehicle & Driver:**
   - Truck number, owner name, driver name/mobile/license/village
4. **Section 3 — Cargo Details:**
   - Crop type (corn/wheat/onion/jowar/bajra), bag count, moisture %, net weight (tons), rate — amount auto-calculates
5. **Section 4 — Freight Calculation:**
   - Freight rate per bag, advance freight paid — due freight auto-calculates
6. **Stock Validation**: Cannot dispatch more than available physical stock
7. Click **Save Dispatch**

**Invoice Preview (Dual-Slip Bill):**
- Click **📄 Bill** button on any dispatch row
- Two-column bill matching physical receipt books:
  - **Left Slip**: Transport Freight Receipt (truck & freight details)
  - **Right Slip**: Loading Goods Receipt (cargo details, amount, bank info)
  - Perforation divider line between slips
- **Options**: Download Transport Slip / Loading Slip / Combined A4 PDF

##### Companies Tab

**Registering a New Company:**
1. Go to "Companies" tab
2. Enter company name, place, village
3. Click **Save**

**Company Profile:**
- Click any company name to enter profile
- **Tally Cards**: Location, total trade value, total cutting, passed amount, received payments, outstanding
- **Orders Sub-tab**: Company's orders
- **Trucks Sub-tab**: Dispatch records with cutting/loss details
- **Payments Sub-tab**: Payment ledger with delete capability

**Cutting (Company Verification):**
- Click **✂️ Cutting** on any dispatch in company profile
- Enter received weight, rate, quality cuts (damage/moisture/other)
- Loss amount and passed value auto-calculate

**Adding a Payment:**
- Click **➕ Payment** in company profile
- Enter amount, date, mode (Bank Transfer/RTGS/Cheque/Cash/UPI), reference number, note
- **Print Hidden Ledger**: Complete printable ledger with running balance and PDF download

##### All Trucks Log Tab
- Consolidated view of ALL dispatches across ALL orders
- Filters: All / Last 7 Days / Last Month / Custom Date Range
- **📥 Excel Download** — Styled XLS file with formatting
- Per-dispatch bill view button

##### All Payments Tab
- Coming soon

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Axios, html2canvas, jsPDF, react-hot-toast, lucide-react |
| **Backend** | Node.js, Express 4, Supabase (PostgreSQL), JWT, bcrypt |
| **Database** | PostgreSQL via Supabase (cloud-hosted) |
| **Deployment** | Vercel (frontend + API serverless functions) |
| **UI Features** | Dark/Light theme, bilingual (Marathi/English), responsive, accessible |

## 🌍 Environment Variables

### Required for Backend
| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role API key |
| `JWT_SECRET` | Secret string for JWT token signing |
| `ADMIN_EMAIL` | Default admin email for seeding |
| `ADMIN_PASSWORD` | Default admin password |
| `MARKET_API_KEY` | data.gov.in API key for market rates |

### Optional for Backend
| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Server port | `8000` |
| `JWT_EXPIRES_IN` | Token expiry duration | `24h` |
| `FRONTEND_URL` | CORS origin | `http://localhost:3000` + Vercel URL |

### Frontend
| Variable | Purpose | Default |
|---|---|---|
| `REACT_APP_API_URL` | API base URL | `http://localhost:8000` (dev) / `""` (production, same origin) |

## 📁 Project Structure

```
mandi-record-keeper/
├── api/                          # Vercel serverless functions
│   ├── app.js                    # Express app with all routes
│   ├── index.js                  # Serverless entry point
│   ├── db.js                     # Supabase client
│   ├── middleware/auth.js        # JWT auth middleware
│   └── controllers/
│       ├── authController.js     # Login (password reset removed)
│       ├── recordController.js   # Farmer records CRUD
│       ├── dealerOrderController.js  # Dealer orders CRUD
│       └── dealerController.js   # Companies CRUD
├── Backend-Node/                 # Standalone Node.js server (local dev)
│   ├── server.js                 # Express server with dotenv
│   └── .env                      # Environment variables
├── Backend-PHP/                  # PHP/Laravel port (in progress)
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── App.js                # Routes and ErrorBoundary
│   │   ├── api.js                # Axios instance with auth interceptor
│   │   ├── config.js             # API URL configuration
│   │   ├── constants.js          # Business info constants
│   │   ├── pages/                # Page-level components
│   │   ├── components/           # Reusable components
│   │   │   ├── common/           # ErrorBoundary, CustomDropdown
│   │   │   ├── layout/           # AppLayout, PageWrapper
│   │   │   ├── loginpage/        # LoginPage
│   │   │   ├── dashboard/        # Invoice, InvoiceRecordsTable, DayStatsCards
│   │   │   ├── admin/            # AdminTable, RecordsTable, StatsCards, etc.
│   │   │   ├── dealer/           # DealerOrderForm, DispatchForm, InvoicePreview, etc.
│   │   │   └── ReportTable/      # ReportTable
│   │   └── styles/               # CSS files
│   └── package.json
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

## 🔐 Security Notes

- All API endpoints (except login, health, market-rates) require JWT bearer token
- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 24 hours by default
- No dealer authentication — both portals accessed via single admin login
- Reset database endpoint requires admin password
- All hardcoded secrets have been removed; all passwords/keys must be set via environment variables

## 🤝 Support

For issues, feature requests, or contributions, please visit:
[https://github.com/MAYURSHEWALE12/mandi-record-keeper](https://github.com/MAYURSHEWALE12/mandi-record-keeper)

---

**के.टी. ट्रेडर्स — गुणवत्ता व विश्वास यांचे प्रतीक**
**KT Traders — A Symbol of Quality and Trust**

🌽 मार्केट यार्ड, श्री व्यंकटेश बँकच्या मागे, मालेगाव कॅम्प जि. नाशिक.
📞 +91 98502 92298
