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

### वापर मार्गदर्शक — चरण-दर-चरण सूचना

---

#### 🔐 सुरुवात कशी करावी (लॉगिन)

**तुम्ही कराल:**
1. तुमच्या ब्राउजरमध्ये वेबसाइटचा पत्ता टाइप करा: `https://mandi-record-keeper.vercel.app`
2. तुम्हाला एक सुंदर लॉगिन पेज दिसेल. डावीकडे KT Traders ची ब्रँडिंग आहे, उजवीकडे लॉगिन फॉर्म आहे.
3. तुमचा **ईमेल** लिहा (उदा. `admin@example.com`)
4. तुमचा **पासवर्ड** लिहा
5. **Sign In** बटण दाबा
6. **स्क्रीनवर काय दिसेल:** "Signing In..." असा मेसेज येईल, थोड्याच वेळात तुम्ही **पोर्टल निवड** पेजवर पोहोचाल

> ⚠️ लॉगिन होत नसल्यास: ईमेल आणि पासवर्ड बरोबर आहेत याची खात्री करा. इंटरनेट कनेक्शन तपासा.

---

#### 🚪 पोर्टल निवड — कोणत्या पोर्टलमध्ये जायचे?

लॉगिन केल्यावर दोन पर्याय दिसतील:

| बटण | कशासाठी |
|---|---|
| **🧑‍🌾 Farmer Invoice Generator** | शेतकऱ्यांकडून मका/धान्य खरेदीची बिले तयार करण्यासाठी |
| **🚚 Dealer Dashboard** | डीलर्सना माल पाठवण्यासाठी, ट्रक डिस्पॅच, कंपनी व्यवस्थापन |

> 💡 **टीप:** तुम्ही नंतरही साइडबारमधून ("Farmer" / "Dealer" बटण) पोर्टल बदलू शकता.

---

### १. 🧑‍🌾 शेतकरी पोर्टल — शेतकऱ्याचे बिल तयार करणे

हा भाग वापरून तुम्ही शेतकऱ्याकडून मका खरेदी केल्याची नोंद कराल आणि त्याचे बिल प्रिंट कराल.

#### १.१ इन्व्हॉइस (बिल) तयार करणे

**हा वर्कफ्लो आहे — रोजचा वापर:**

1. **Farmer Invoice Generator** वर क्लिक करा. डॅशबोर्ड उघडेल.
2. वरच्या बाजूला एक **लाइव्ह मार्केट रेट्स** ची पट्टी दिसेल — आजचे बाजारभाव दाखवते (दर १५ मिनिटांनी अपडेट होते).
3. त्याखाली **इन्व्हॉइस फॉर्म** आहे. हा फॉर्म भरा:

   | फील्ड | काय टाकावे | उदाहरण |
   |---|---|---|
   | **तारीख** | आजची तारीख (आपोआप येते) | २०२६-०६-०५ |
   | **शेतकरी नाव** | पूर्ण नाव | रमेश शिंदे |
   | **मोबाईल नंबर** | १० आकडी मोबाईल | ९८५०२९१२९८ |
   | **पीक** | ड्रॉपडाउनमधून निवडा | मका |
   | **दर (₹ प्रति क्विंटल)** | प्रति क्विंटल दर | २५०० |
   | **प्रमाण (क्विंटल)** | किती क्विंटल | १० |
   | **एकूण रक्कम** | आपोआप कॅल्क्युलेट होईल | ₹ २५,००० |
   | **पेड रक्कम** | आज शेतकऱ्याला दिलेली रक्कम | २०००० |

4. **फॉर्म भरतानाच उजवीकडे बिल प्रिव्ह्यू** दिसू लागेल — जसे तुम्ही टाइप कराल तसे बिल अपडेट होताना दिसेल.
5. **📥 PDF डाउनलोड** बटण दाबा → A5 आकारात PDF डाउनलोड होईल, जे तुम्ही प्रिंट करून शेतकऱ्याला देऊ शकता.
6. **✅ सेव्ह** बटण दाबा → "रेकॉर्ड यशस्वीरित्या सेव्ह!" असा टोस्ट दिसेल. फॉर्म क्लियर होईल आणि खालची टेबल रिफ्रेश होईल.

**स्क्रीनवर काय दिसेल:**
- वर मार्केट रेट्सची पट्टी
- मध्यभागी फॉर्म (डावीकडे) आणि बिल प्रिव्ह्यू (उजवीकडे)
- खाली आजचे स्टॅट्स कार्ड्स
- सर्वात खाली रेकॉर्ड्सची टेबल

---

#### १.२ आजचे आकडे बघणे (Day Stats Cards)

इन्व्हॉइस फॉर्मच्या खाली लगेच तुम्हाला चार कार्ड्स दिसतील:

| कार्ड | काय दाखवते |
|---|---|
| **📋 आजच्या नोंदी** | आज किती बिले तयार केली |
| **💰 एकूण रक्कम** | आजच्या सर्व बिलांची एकूण रक्कम |
| **✅ पेड** | आज शेतकऱ्यांना दिलेली रक्कम |
| **⏳ बाकी** | उरलेली रक्कम |

तसेच **कॉर्न स्टॉक** कार्ड — आजचा उपलब्ध स्टॉक (आत आलेला माल — बाहेर गेलेला माल).

---

#### १.३ मागील नोंदी बघणे व व्यवस्थापित करणे (Records Table)

पेजच्या सर्वात खाली **रेकॉर्ड्स टेबल** आहे.

**वैशिष्ट्ये:**
- **🔍 नावाने सर्च:** वरच्या बॉक्समध्ये शेतकरी नाव लिहा — टेबल फिल्टर होईल
- **📅 तारीख फिल्टर:** ड्रॉपडाउनमधून "आज", "७ दिवस", "१ महिना" निवडा
- **◀ ▶ पाने:** खाली पॅजिनेशन बटणे आहेत — पुढचे/मागील पान बघा

**प्रत्येक रेकॉर्डवर उपलब्ध क्रिया:**
| बटण | काय होते |
|---|---|
| **📄 बिल** | पॉपअपमध्ये बिल दाखवते — PDF डाउनलोड करू शकता |
| **✏️ एडिट** | फॉर्म उघडेल — डेटा बदलू शकता |
| **🗑️ डिलीट** | विचारपूर्वक डिलीट करते |

**CSV एक्सपोर्ट/इंपोर्ट:**
- **📤 CSV एक्सपोर्ट** → सर्व डेटा Excel मध्ये डाउनलोड करा
- **📥 CSV इंपोर्ट** → Excel मधून डेटा अपलोड करा (मोठ्या प्रमाणात डेटा एंट्रीसाठी उपयोगी)

---

#### १.४ अ‍ॅडमिन पॅनल — संपूर्ण व्यवस्थापन (`/admin`)

साइडबारमध्ये "Admin" बटण क्लिक करा. हे पेज अ‍ॅडमिनसाठी आहे — येथे सर्व क्रिया करता येतात.

**पेजवर चार भाग आहेत:**

**१. स्टॅट्स कार्ड्स (वर):**
- एकूण नोंदी, एकूण रक्कम, एकूण पेड, एकूण बाकी — सर्व काळासाठी

**२. आजचे स्टॅट्स:**
- आजच्या नोंदींची आकडेवारी

**३. नवीन नोंद फॉर्म:**
- इथेही नवीन बिल तयार करू शकता
- किंवा एखादी जुनी नोंद एडिट करू शकता (टेबलमधून ✏️ क्लिक केल्यास फॉर्म प्री-फिल्ड होईल)

**४. रेकॉर्ड्स टेबल:**
- मोठी टेबल — सर्च, फिल्टर, पॅजिनेशन, CSV, PDF — सर्व सुविधा

**५. डेंजर झोन (सर्वात खाली):**
- ⚠️ "Reset All Data" — हे बटण दाबल्यास **सर्व रेकॉर्ड्स आणि डीलर ऑर्डर्स डिलीट** होतील
- **पासवर्ड विचारेल** — प्रशासक पासवर्ड टाकल्याशिवाय रीसेट होणार नाही
- बिल नंबर काउंटर पुन्हा १००० वर सेट होईल
- > ⚠️ **सावधान:** ही क्रिया उलट करता येत नाही. फार गरज असेल तरच वापरा.

---

#### १.५ बाकी व्यवहार बघणे (`/pending`)

- फक्त **ज्यांची बाकी रक्कम आहे** अशा नोंदी दिसतील
- कोणत्याही शेतकऱ्याच्या नावावर क्लिक करा → लगेच **पेमेंट हिस्ट्री** पेजवर जाईल

---

#### १.६ पूर्ण व्यवहार बघणे (`/completed`)

- फक्त **ज्यांची सर्व रक्कम भरली आहे** अशा नोंदी

---

#### १.७ पेमेंट हिस्ट्री — शेतकरी-निहाय लेजर (`/payment-history`)

**कोणत्या शेतकऱ्याचे किती पैसे बाकी आहेत हे बघण्यासाठी:**

1. पेजवर एक **सर्च बॉक्स** आहे — शेतकऱ्याचे नाव किंवा मोबाईल नंबर टाका
2. खाली शेतकरी नाव दिसेल — त्यावर क्लिक करा
3. त्या शेतकऱ्याची **सर्व बिले दिसतील** — प्रत्येक बिलात:
   - पीक, प्रमाण (क्विंटल), दर (₹), एकूण रक्कम
   - किती पैसे दिले, किती बाकी आहेत
4. खाली **पेमेंट टेबल** — सर्व पेमेंटचा इतिहास रनिंग बॅलन्ससह
5. **🖨️ प्रिंट** बटण दाबा → प्रिंट फ्रेंडली फॉरमॅटमध्ये लेजर उघडेल, तुम्ही प्रिंट करू शकता

---

#### १.८ अहवाल बघणे (`/report`)

**विशिष्ट तारखांचा अहवाल हवा असल्यास:**

1. **तारीख श्रेणी** निवडा:
   - **आज** → फक्त आजच्या नोंदी
   - **७ दिवस** → आजपासून ७ दिवस मागे
   - **१ महिना** → मागील ३० दिवस
   - **६ महिने** → मागील ६ महिने
   - **Custom** → स्वतः तारीख निवडा ("पासून" आणि "पर्यंत")
2. पर्यायी: **नावाने सर्च** करा किंवा **पीक फिल्टर** करा
3. पॅजिनेटेड टेबलमध्ये नोंदी बघा

---

### २. 🚚 डीलर पोर्टल — डीलर्सना माल पाठवणे

डीलर पोर्टलमध्ये चार टॅब आहेत: **Orders** (डिफॉल्ट), **Companies**, **All Trucks**, **All Payments**.

---

#### २.१ ऑर्डर्स टॅब — नवीन ऑर्डर तयार करणे

**डीलरकडून ऑर्डर आल्यावर हे करा:**

1. Dealer Dashboard मध्ये **Orders** टॅबवर जा (डिफॉल्टने येथेच येईल)
2. वरच्या बाजूला **📦 + नवीन ऑर्डर** बटण दाबा
3. एक पॉपअप उघडेल — हे भरा:

   | फील्ड | काय टाकावे |
   |---|---|
   | **PO Number** | खरेदी ऑर्डर नंबर |
   | **कंपनीचे नाव** | ड्रॉपडाउनमधून कंपनी निवडा (नवीन कंपनी हवी असल्यास Companies टॅबवर जाऊन नोंदवा) |
   | **ठिकाण** | शहर/तालुका |
   | **गाव** | गावाचे नाव |
   | **एकूण वजन (टन)** | किती टन माल हवा आहे |

4. **✅ सेव्ह** दाबा → नवीन ऑर्डर कार्ड तयार होईल

**स्क्रीनवर काय दिसेल:**
- वर स्टॅट्स कार्ड्स: एकूण ऑर्डर्स, एकूण टन, पूर्ण टन, बाकी टन
- खाली **ऑर्डर कार्ड्स** — प्रत्येक ऑर्डरचे वेगळे कार्ड:
  - PO नंबर, कंपनीचे नाव, ठिकाण
  - प्रोग्रेस बार (किती टन माल पाठवला / किती बाकी)
  - स्टेटस: ⏳ पending / 🟡 Partially Fulfilled / ✅ Fulfilled

---

#### २.२ ऑर्डरचे तपशील बघणे व डिस्पॅच करणे

**ऑर्डरवर क्लिक करा** — तपशील पॅनेल उघडेल. इथे तीन भाग आहेत:

**भाग १ — ऑर्डर सारांश:**
- PO#, डीलर नाव, पत्ता, ऑर्डर केलेले वजन
- आतापर्यंत पाठवलेले वजन, स्टेटस

**भाग २ — डिस्पॅच लॉग:**
- या ऑर्डरखाली पाठवलेल्या सर्व ट्रकची यादी
- प्रत्येक ओळीत: बिल नंबर, तारीख, ट्रक नंबर, पीक, वजन, भाडे
- **📄 बिल** बटण → डबल-स्लिप इन्व्हॉइस पहा
- **🗑️ डिलीट** बटण → डिस्पॅच काढून टाका

**भाग ३ — नवीन ट्रक डिस्पॅच:**

**🚛 + नवीन डिस्पॅच** बटण दाबा. फॉर्म चार विभागात आहे:

**विभाग १ — रसीद व वाहतूक:**
| फील्ड | काय टाकावे |
|---|---|
| बिल नंबर | ट्रान्सपोर्ट बिल नंबर |
| तारीख | आजची तारीख |
| डिलिव्हरी ठिकाण | माल कुठे पोहोचवायचा आहे |
| ब्रोकर नाव | ब्रोकरचे नाव (असेल तर) |
| ट्रान्सपोर्ट एजंट | ट्रान्सपोर्ट कंपनीचे नाव |

**विभाग २ — वाहन व चालक:**
| फील्ड | काय टाकावे |
|---|---|
| ट्रक नंबर | ट्रकचा नंबर (उदा. MH-15-XX-1234) |
| मालक नाव | ट्रक मालकाचे नाव |
| चालक नाव | चालकाचे पूर्ण नाव |
| चालक मोबाईल | चालकाचा मोबाईल नंबर |
| चालक लायसन्स | चालकाचा लायसन्स नंबर |
| चालक गाव | चालकाचे गाव |

**विभाग ३ — माल तपशील:**
| फील्ड | काय टाकावे |
|---|---|
| पीक | ड्रॉपडाउनमधून: मका / गहू / कांदा / ज्वारी / बाजरी |
| पोती | किती पोती भरली |
| ओलावा % | ओलावा टक्केवारी |
| निव्वळ वजन (टन) | टन मध्ये वजन |
| दर | प्रति टन दर (₹) |
| **रक्कम** | **आपोआप कॅल्क्युलेट होईल** (वजन × दर) |

**विभाग ४ — भाडे गणना:**
| फील्ड | काय टाकावे |
|---|---|
| भाडेदर प्रति पोते | एका पोत्याचे भाडे |
| एकूण भाडे | **आपोआप कॅल्क्युलेट** (पोती × भाडेदर) |
| अग्रिम भाडे | आगाऊ दिलेले भाडे |
| बाकी भाडे | **आपोआप कॅल्क्युलेट** |

> ⚠️ **स्टॉक चेक:** जर उपलब्ध स्टॉकपेक्षा जास्त डिस्पॅच करत असाल तर फॉर्म सबमिट होणार नाही — "पुरेसा स्टॉक नाही" असा मेसेज दिसेल.

**✅ सेव्ह डिस्पॅच** दाबा → डिस्पॅच लॉगमध्ये नवीन एंट्री दिसेल.

---

#### २.३ डबल-स्लिप बिल प्रिंट करणे (इन्व्हॉइस)

**डिस्पॅच झाल्यावर डीलरला बिल द्यायचे असेल तर:**

1. कोणत्याही डिस्पॅचच्या **📄 बिल** बटणावर क्लिक करा
2. एक मोठे पॉपअप उघडेल — त्यात **दोन स्लिप्स** आहेत:
   - **डावी स्लिप — ट्रान्सपोर्ट फ्रेट रसीद:** ट्रक नंबर, चालक, भाडे तपशील
   - **उजवी स्लिप — लोडिंग गुड्स रसीद:** माल तपशील, रक्कम, बँक तपशील
   - दोन्ही स्लिप्समध्ये **कट-लाइन** (वास्तविक बिल बुकमध्ये जसे छिद्र पाडलेले असते तशी रेषा)
3. तीन पर्याय:
   - **📥 ट्रान्सपोर्ट स्लिप** — फक्त डावी स्लिपचे PDF
   - **📥 लोडिंग स्लिप** — फक्त उजवी स्लिपचे PDF
   - **📥 दोन्ही स्लिप्स** — A4 PDF मध्ये दोन्ही स्लिप्स

---

#### २.४ कंपनीज टॅब — कंपन्या रजिस्टर करणे

**नवीन कंपनी (डीलर) नोंदवण्यासाठी:**

1. **Companies** टॅबवर क्लिक करा
2. **नवीन कंपनी फॉर्म** दिसेल:
   - **कंपनीचे नाव** — पूर्ण नाव (उदा. "श्री गणेश ट्रेडर्स")
   - **ठिकाण** — शहर (उदा. "मालेगाव")
   - **गाव** — गावाचे नाव
3. **✅ सेव्ह** दाबा
4. कंपनी टेबलमध्ये दिसेल

---

#### २.५ कंपनी प्रोफाइल — संपूर्ण व्यवहार बघणे

**कोणत्याही कंपनीच्या नावावर क्लिक करा** — प्रोफाइल पेज उघडेल.

**टॅली कार्ड्स (वर):**
| कार्ड | माहिती |
|---|---|
| 📍 ठिकाण | कंपनीचा पत्ता |
| 💰 एकूण व्यापार | या कंपनीला पाठवलेल्या मालाची एकूण किंमत |
| ✂️ एकूण कटिंग | दर्जा कटाची एकूण रक्कम |
| ✅ पास केलेले | कंपनीने मंजूर केलेली रक्कम |
| 💳 मिळालेले पेमेंट | कंपनीकडून मिळालेले एकूण पैसे |
| 📊 थकबाकी | किती पैसे बाकी आहेत |

**तीन सब-टॅब:**

**🔹 Orders सब-टॅब:**
- या कंपनीच्या सर्व ऑर्डर्सची यादी
- प्रत्येक ऑर्डरचा PO#, वजन, स्टेटस

**🔹 Trucks सब-टॅब — कटिंग (व्हेरिफिकेशन):**
- कंपनीकडे गेलेल्या सर्व ट्रकची माहिती
- प्रत्येक डिस्पॅचसाठी **✂️ कटिंग** बटण आहे

**कटिंग म्हणजे काय?** कंपनीकडे माल पोहोचल्यावर ते वजन करतात, दर्जा तपासतात. त्यात काही कमी आढळल्यास (खराब माल, जास्त ओलावा) ते कापतात. ही प्रक्रिया म्हणजे कटिंग.

**✂️ कटिंग कसे करावे:**
1. **✂️ कटिंग** बटण क्लिक करा
2. हे भरा:
   - **मिळालेले वजन (टन)** — कंपनीने सांगितलेले वजन
   - **दर (₹)** — कंपनीने मंजूर केलेला दर
   - **डॅमेज कट** — खराब मालाची रक्कम
   - **ओलावा कट** — जास्त ओलाव्याची रक्कम
   - **इतर कट** — इतर कपात
3. **लॉस रक्कम आपोआप कॅल्क्युलेट** होईल
4. **पास केलेली रक्कम आपोआप कॅल्क्युलेट** होईल (एकूण — सर्व कट)
5. **✅ सेव्ह** करा

**🔹 Payments सब-टॅब — पेमेंट लेजर:**

**नवीन पेमेंट ऍड करणे:**
1. **➕ पेमेंट** बटण क्लिक करा
2. फॉर्म भरा:
   - **रक्कम** — किती पैसे मिळाले
   - **तारीख** — पेमेंटची तारीख
   - **मोड** — Bank Transfer / RTGS / Cheque / Cash / UPI
   - **संदर्भ नंबर** — चेक नंबर / UPI ID / ट्रान्झॅक्शन ID
   - **नोट** — काही विशेष माहिती
3. **✅ सेव्ह** करा

**लेजर प्रिंट करणे:**
- खाली **🖨️ संपूर्ण लेजर प्रिंट** बटण आहे
- यात सर्व व्यवहार (माल पाठवले, पेमेंट मिळाले) रनिंग बॅलन्ससह दिसतील
- PDF डाउनलोड करून प्रिंट करू शकता

---

#### २.६ सर्व ट्रक लॉग टॅब — सर्व डिस्पॅच एकाच ठिकाणी

हा टॅब सर्व ऑर्डर्समधील सर्व डिस्पॅच **एकाच टेबलमध्ये** दाखवतो.

**वैशिष्ट्ये:**
- **फिल्टर:** All / Last 7 Days / Last Month / Custom Date Range
- प्रत्येक ओळीत: तारीख, कंपनी, ट्रक नंबर, पीक, लोड केलेले वजन, मिळालेले वजन, कटिंग, पास केलेली रक्कम
- **📥 Excel डाउनलोड** — स्टाइल केलेली XLS फाइल डाउनलोड करा
- प्रत्येक डिस्पॅचसाठी **📄 बिल** बटण

---

#### २.७ सर्व पेमेंट्स टॅब

> 🚧 लवकरच उपलब्ध होईल.

---

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

### User Manual — Step-by-Step Guide

---

#### 🔐 Getting Started (Login)

**What you do:**
1. Open your browser and go to: `https://mandi-record-keeper.vercel.app`
2. You'll see a beautiful split-screen login page — left side has KT Traders branding, right side has the login form
3. Type your **Email** (e.g., `admin@example.com`)
4. Type your **Password**
5. Click **Sign In** button
6. **What you'll see:** The button shows "Signing In..." briefly, then you're taken to the **Portal Selection** page

> ⚠️ Can't log in? Double-check your email and password. Check your internet connection. If you forgot credentials, contact your system admin.

---

#### 🚪 Portal Selection — Which Portal Do You Need?

After login, you'll see two large choice cards:

| Button | Purpose |
|---|---|
| **🧑‍🌾 Farmer Invoice Generator** | For recording grain purchases from farmers and generating invoices |
| **🚚 Dealer Dashboard** | For managing dealer orders, truck dispatches, company profiles, and payments |

> 💡 **Tip:** You can switch between portals anytime using the sidebar ("Farmer" / "Dealer" toggle).

---

### 1. 🧑‍🌾 Farmer Portal — Creating a Farmer's Invoice

This is your daily workflow for recording corn purchases from farmers.

#### 1.1 Generating an Invoice (Daily Bill)

**The workflow — step by step:**

1. Click **Farmer Invoice Generator** on the portal selection page. The Dashboard opens.
2. At the top, you'll see a **Live Market Rates** scrolling ticker — it shows today's commodity prices from the government data API (refreshes every 15 minutes).
3. Below that is the **Invoice Form**. Fill it in:

   | Field | What to enter | Example |
   |---|---|---|
   | **Date** | Auto-filled with today; change if needed | 2026-06-05 |
   | **Farmer Name** | Full name of the farmer | Ramesh Shinde |
   | **Mobile** | 10-digit phone number | 9850291298 |
   | **Crop** | Select from dropdown | Corn (मका) |
   | **Rate (₹/quintal)** | Price per quintal | 2500 |
   | **Quantity (quintals)** | Weight in quintals | 10 |
   | **Total Amount** | Auto-calculated | ₹ 25,000 |
   | **Paid Amount** | How much you paid today | 20000 |

4. **As you type, the bill preview updates in real-time** on the right side — you can see exactly how the printed bill will look.
5. Click **📥 Download PDF** → An A5-sized PDF invoice downloads, ready to print and give to the farmer.
6. Click **✅ Save** → You'll see a green toast: "रेकॉर्ड यशस्वीरित्या सेव्ह!" (Record saved successfully!). The form clears and the table below refreshes.

**What the screen looks like:**
```
┌─────────────────────────────────────────────────────────┐
│  🌽 Live Market Rates — मका: ₹2,500 | गहू: ₹3,200 ...  │
├──────────────────────────────┬──────────────────────────┤
│  📋 Invoice Form             │  🧾 Bill Preview         │
│  ┌──────────────────────┐   │  ┌──────────────────────┐│
│  │ Date: [2026-06-05]   │   │  │  K. T. TRADERS      ││
│  │ Farmer: [Ramesh..]   │   │  │  Market Yard,...     ││
│  │ Mobile: [98502...]   │   │  │  ─────────────      ││
│  │ Crop: [मका ▼]        │   │  │  Ramesh Shinde      ││
│  │ Rate: [2500]         │   │  │  Corn — 10 Qtls      ││
│  │ Qty: [10]            │   │  │  Rate: ₹2,500/Qtl    ││
│  │ Total: ₹ 25,000      │   │  │  Total: ₹25,000      ││
│  │ Paid: [20000]        │   │  │  Paid: ₹20,000       ││
│  │ [📥 PDF] [✅ Save]   │   │  │  Due: ₹5,000         ││
│  └──────────────────────┘   │  └──────────────────────┘│
├──────────────────────────────┴──────────────────────────┤
│  📊 Today's Stats                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐ │
│  │ 5    │ │₹1.2L │ │₹80K  │ │₹40K  │ │ Corn Stock   │ │
│  │Records│ │Total │ │Paid  │ │Due   │ │ 15.5 tons    │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│  📋 Records Table (filtered by date)                    │
│  ┌─────┬──────┬──────┬──────┬──────┬──────┬────┐     │
│  │Date │Farmer│Crop  │Qty   │Total │Paid  │Due │     │
│  ├─────┼──────┼──────┼──────┼──────┼──────┼────┤     │
│  │...  │...   │...   │...   │...   │...   │... │     │
│  └─────┴──────┴──────┴──────┴──────┴──────┴────┘     │
│  ◀ पान 1 / 5 ▶                                        │
└─────────────────────────────────────────────────────────┘
```

---

#### 1.2 Viewing Today's Statistics (Day Stats Cards)

Right below the invoice form, you'll see five cards:

| Card | What it shows |
|---|---|
| **📋 Today's Records** | Number of bills created today |
| **💰 Total Amount** | Sum of all today's bill amounts |
| **✅ Paid** | Total amount paid to farmers today |
| **⏳ Due** | Outstanding balance of today's records |
| **🌽 Corn Stock** | Available stock = inbound today − outbound dispatches |

---

#### 1.3 Managing Past Records (Records Table)

At the bottom of the Dashboard page is the **Records Table**.

**Features:**
- **🔍 Search by name:** Type a farmer name in the search box — table filters instantly
- **📅 Date filter:** Use the dropdown for "Today", "7 Days", "1 Month"
- **◀ ▶ Pagination:** Navigate through pages using the blue pill at bottom-right

**Actions available on each record:**

| Button | What happens |
|---|---|
| **📄 Bill** | Opens a popup with the invoice — you can download PDF |
| **✏️ Edit** | Opens the form with pre-filled data — modify and save |
| **🗑️ Delete** | Confirms then deletes the record permanently |

**CSV Export/Import:**
- **📤 CSV Export** → Downloads all data as an Excel-compatible CSV file
- **📥 CSV Import** → Upload data from CSV (useful for bulk data entry)

---

#### 1.4 Admin Panel — Full Management (`/admin`)

Click **Admin** in the sidebar. This page has everything for comprehensive management.

**Five sections on this page:**

**1. Stats Cards (top):**
- Total records all time, total amount, total paid, total due

**2. Today's Stats:**
- Today's aggregated numbers

**3. Add/Edit Record Form:**
- Create new farmer purchase records
- Edit existing records (clicked from table)

**4. Records Table:**
- Full-featured: search, filter by crop/date/due status, pagination, CSV, per-record PDF invoice
- Actions: Edit, Delete, View Bill

**5. Danger Zone (bottom):**
- ⚠️ **"Reset All Data"** button — clicking this will:
  - Delete ALL records and dealer orders
  - Ask for admin password before executing
  - Reset bill counter back to 1000
- > ⚠️ **Warning:** This action CANNOT be undone. Use only when absolutely necessary.

---

#### 1.5 Viewing Due Payments (`/pending`)

- Shows ONLY records with outstanding balance (due > 0)
- Click any farmer name → takes you directly to their **Payment History** page

---

#### 1.6 Viewing Completed Payments (`/completed`)

- Shows ONLY records that are fully paid (due = 0)

---

#### 1.7 Payment History — Per-Farmer Ledger (`/payment-history`)

**To see how much a farmer has been paid vs what's still due:**

1. You'll see a **Search box** at the top — type a farmer's name or mobile number
2. Matching farmers appear below — click on one
3. All of that farmer's **bills are displayed** — each bill shows:
   - Crop, Quantity (quintals), Rate (₹), Total Amount
   - How much was paid, how much is still due
4. Below each bill is a **Payment Table** — complete history of all payments with running balance
5. Click **🖨️ Print** → Opens a print-friendly ledger format, ready to print or save as PDF

**Use case:** When a farmer comes to collect remaining payment, open this page to see exactly how much is due across all their bills.

---

#### 1.8 Running Reports (`/report`)

**To see records for a specific time period:**

1. Select a **date range**:
   - **Today** → Only today's records
   - **7 Days** → Last 7 days
   - **1 Month** → Last 30 days
   - **6 Months** → Last 6 months
   - **Custom** → Pick your own "From" and "To" dates
2. Optional: **Search by name** or **Filter by crop**
3. View the paginated table of filtered records

---

### 2. 🚚 Dealer Portal — Managing Dealer Orders & Truck Dispatches

The Dealer Portal has four tabs: **Orders** (default), **Companies**, **All Trucks**, **All Payments**.

---

#### 2.1 Orders Tab — Creating a New Order

**When a dealer places an order, here's what you do:**

1. Go to the Dealer Dashboard → you'll land on the **Orders** tab by default
2. Click the **📦 + New Order** button at the top
3. A modal popup opens — fill in:

   | Field | What to enter |
   |---|---|
   | **PO Number** | Purchase order number from the dealer |
   | **Company Name** | Select from dropdown (or register a new company in Companies tab first) |
   | **Place** | City / taluka |
   | **Village** | Village name |
   | **Total Weight (tons)** | How many tons the dealer ordered |

4. Click **✅ Save** → A new order card appears in the grid

**What the screen looks like:**

```
┌─────────────────────────────────────────────────────────┐
│  [📦 + New Order]                                       │
├─────────────────────────────────────────────────────────┤
│  📊 Stats                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 12 Orders│ │ 240 Tons │ │180 Tons  │ │ 60 Tons   │  │
│  │          │ │ Ordered  │ │Fulfilled │ │ Pending   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  🃏 Order Cards                                         │
│  ┌─────────────────┐ ┌─────────────────┐               │
│  │ PO-2024-001     │ │ PO-2024-002     │               │
│  │ श्री गणेश ट्रेडर्स│ │ महालक्ष्मी ट्रेडर्स│               │
│  │ Malegaon        │ │ Nashik          │               │
│  │ ████████░░ 80%  │ │ ████░░░░ 40%   │               │
│  │ ✅ Fulfilled    │ │ ⏳ Pending      │               │
│  └─────────────────┘ └─────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

#### 2.2 Viewing Order Details & Recording Dispatch

**Click any order card** → The detail panel expands below with three sections:

**Section 1 — Order Summary:**
- PO#, dealer name, address
- Ordered weight vs. dispatched weight
- Status badge (Pending / Partially Fulfilled / Fulfilled)

**Section 2 — Dispatch Log:**
- Table of all trucks dispatched under this order
- Each row: Bill No, Date, Truck No, Crop, Weight (tons), Freight
- **📄 Bill** button → Opens dual-slip invoice preview
- **🗑️ Delete** button → Removes the dispatch

**Section 3 — New Truck Dispatch Form:**

Click **🚛 + New Dispatch**. The form has four sections:

**Section A — Receipt & Transport:**
| Field | What to enter |
|---|---|
| Bill No | Transport bill number |
| Date | Today's date (auto-filled) |
| Delivery Place | Where the goods are going |
| Broker Name | Broker's name (optional) |
| Transport Agent | Transport company name |

**Section B — Vehicle & Driver:**
| Field | What to enter |
|---|---|
| Truck No | Registration number (e.g., MH-15-XX-1234) |
| Owner Name | Truck owner's name |
| Driver Name | Driver's full name |
| Driver Mobile | Driver's phone number |
| Driver License | Driver's license number |
| Driver Village | Driver's home village |

**Section C — Cargo Details:**
| Field | What to enter |
|---|---|
| Crop Type | Dropdown: Corn / Wheat / Onion / Jowar / Bajra |
| Bags Count | Number of bags loaded |
| Moisture % | Moisture percentage |
| Net Weight (tons) | Weight in tons |
| Rate (₹/ton) | Rate per ton |
| **Amount** | **Auto-calculated** (weight × rate) |

**Section D — Freight Calculation:**
| Field | What to enter |
|---|---|
| Freight Rate per Bag | Rate per bag |
| **Total Freight** | **Auto-calculated** (bags × rate) |
| Advance Freight Paid | Amount paid in advance |
| **Due Freight** | **Auto-calculated** (total − advance) |

> ⚠️ **Stock Check:** If you try to dispatch more than the available physical stock, the form won't submit — you'll see "पुरेसा स्टॉक नाही" (Insufficient stock) error.

Click **✅ Save Dispatch** → The new entry appears in the Dispatch Log table.

---

#### 2.3 Printing the Dual-Slip Bill (Invoice Preview)

**After a truck is dispatched, give the dealer a bill:**

1. Click **📄 Bill** button on any dispatch row
2. A large modal opens showing **two bill slips** side by side:
   - **Left Slip — Transport Freight Receipt:** Shows truck details, driver info, freight calculation
   - **Right Slip — Loading Goods Receipt:** Shows cargo details, total amount, bank account info
   - A **perforation line** separates the two slips (just like physical bill books)
3. Three download options:
   - **📥 Transport Slip Only** — PDF of just the left side
   - **📥 Loading Slip Only** — PDF of just the right side
   - **📥 Both Slips** — A4 landscape PDF with both slips

---

#### 2.4 Companies Tab — Registering Companies

**To add a new dealer company:**

1. Click the **Companies** tab
2. You'll see a **Register New Company** form:
   - **Company Name** — Full name (e.g., "Shree Ganesh Traders")
   - **Place** — City (e.g., "Malegaon")
   - **Village** — Village name
3. Click **✅ Save**
4. The new company appears in the table below

---

#### 2.5 Company Profile — Complete Business View

**Click any company name** → Company Profile opens.

**Tally Cards (top row):**
| Card | Information |
|---|---|
| 📍 Location | Company address |
| 💰 Total Trade Value | Total value of goods sent to this company |
| ✂️ Total Cutting | Total quality deductions |
| ✅ Passed Amount | Amount verified by company |
| 💳 Payments Received | Total money received from company |
| 📊 Outstanding | Balance due |

**Three sub-tabs:**

**🔹 Orders Sub-tab:**
- Lists all orders belonging to this company
- Each order shows: PO#, weight, status

**🔹 Trucks Sub-tab — Cutting (Verification):**
- Shows all dispatches sent to this company
- Each dispatch has a **✂️ Cutting** button

**What is Cutting?** When the goods arrive at the company, they weigh and check quality. If they find issues (damaged goods, excess moisture), they deduct money. This process is called "cutting."

**How to do Cutting:**
1. Click **✂️ Cutting** on any dispatch
2. A modal opens — fill in:
   - **Received Weight (tons)** — What the company reported
   - **Rate (₹)** — Rate the company confirmed
   - **Damage Cut** — Amount deducted for damaged goods
   - **Moisture Cut** — Amount deducted for excess moisture
   - **Other Cuts** — Any other deductions
3. **Loss Amount** is auto-calculated
4. **Passed Amount** is auto-calculated (total cuts − all deductions)
5. Click **✅ Save**

**🔹 Payments Sub-tab — Payment Ledger:**

**Adding a New Payment:**
1. Click **➕ Payment** button
2. Fill in the form:
   - **Amount** — How much received
   - **Date** — Payment date
   - **Mode** — Bank Transfer / RTGS / Cheque / Cash / UPI
   - **Reference No** — Check number / UPI ID / Transaction ID
   - **Note** — Any notes
3. Click **✅ Save**

**Printing the Ledger:**
- Click **🖨️ Print Full Ledger** button at the bottom
- Opens a complete transaction history with running balance
- Download as PDF and print

---

#### 2.6 All Trucks Log Tab — Consolidated Dispatch View

This tab shows ALL dispatches from ALL orders in one single table.

**Features:**
- **Filters:** All / Last 7 Days / Last Month / Custom Date Range
- Each row: Date, Company, Truck No, Crop, Loaded Weight, Received Weight, Cutting, Passed Amount
- **📥 Excel Download** — Downloads a styled XLS file with formatting
- Per-dispatch **📄 Bill** button

**Use case:** At the end of the month, export all dispatches to Excel for accounting.

---

#### 2.7 All Payments Tab

> 🚧 Coming soon.

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
