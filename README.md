# 🎙 VoiceSpend — AI Voice-Based Expense Tracker

A full-featured, AI-powered expense tracker with voice input, smart category detection, interactive charts, and Firebase sync.

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Voice Input** | Web Speech Recognition API — speak naturally in English/Hindi-English |
| **AI Parser** | Auto-detects amount, category & description from speech |
| **Speech Output** | TTS feedback after every action (Web Speech Synthesis) |
| **Pie Chart** | Category-wise donut chart (Chart.js) |
| **Bar Chart** | 6-month spending trend |
| **Category Breakdown** | Animated progress bars with percentages |
| **Monthly Navigation** | Browse any past/future month |
| **AI Insights** | Month-over-month analysis, projections, top category |
| **Filter Tabs** | Filter transactions by category |
| **Export CSV** | Download expenses as spreadsheet |
| **Firebase Ready** | Optional Firestore integration (see `firebase-config.js`) |
| **Local Storage** | Works offline without Firebase setup |

---

## 🗣 Voice Commands (Examples)

```
"Spent 200 on food"
"Paid 1200 for electricity bill"
"Bought groceries for 850 rupees"
"500 rupees taxi fare"
"Lunch at restaurant 350"
"Netflix subscription 499"
"Medicine from pharmacy 320"
"Uber ride 180"
```

---

## 📁 Project Structure

```
voice-expense-tracker/
├── index.html          # Main app (all-in-one HTML/CSS/JS)
├── firebase-config.js  # Firebase Firestore integration guide
└── README.md           # This file
```

---

## 🛠 Technologies

- **HTML5 / CSS3 / Vanilla JavaScript** — No framework required
- **Web Speech API** — `SpeechRecognition` for voice input
- **Web Speech Synthesis API** — TTS audio feedback
- **Chart.js 4.4** — Donut and bar charts
- **LocalStorage** — Default offline database
- **Firebase Firestore** — Optional cloud sync (see setup below)

---

## ⚡ Quick Start

### Option A — Just open the file (localStorage mode)
```bash
# Simply open in Chrome or Edge (Firefox has limited Speech API support)
open index.html
```

### Option B — Local development server
```bash
# Using Python
python3 -m http.server 8080
# Open http://localhost:8080

# Using Node.js
npx serve .
# Open http://localhost:3000
```

> ⚠️ Chrome requires HTTPS or localhost for the Microphone API

---

## 🔥 Firebase Setup (Optional — for cloud sync)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g. `voicespend`)
3. Enable **Firestore Database** (test mode)
4. Enable **Authentication → Anonymous**
5. Copy your config into `firebase-config.js`
6. Follow the integration instructions inside `firebase-config.js`

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Category Detection Keywords

| Category | Keywords |
|---|---|
| 🍔 Food | food, eat, lunch, dinner, restaurant, café, swiggy, zomato, grocery... |
| 🚗 Transport | taxi, uber, ola, bus, train, fuel, petrol, metro, toll... |
| 🛍 Shopping | clothes, amazon, flipkart, mall, fashion, shoes, online... |
| 💊 Health | medicine, doctor, hospital, pharmacy, gym, fitness... |
| 🎬 Entertainment | movie, netflix, spotify, game, cinema, party, subscription... |
| 💡 Bills | electricity, water, internet, rent, EMI, mobile, insurance... |
| 📦 Other | everything else |

---

## 🌐 Browser Support

| Browser | Voice Input | TTS | Charts |
|---|---|---|---|
| Chrome 88+ | ✅ | ✅ | ✅ |
| Edge 88+ | ✅ | ✅ | ✅ |
| Safari 15+ | ⚠️ Partial | ✅ | ✅ |
| Firefox | ❌ | ✅ | ✅ |

---

## 📦 Future Enhancements

- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Budget goals with alerts
- [ ] Receipt photo scanning (OCR)
- [ ] Google Sheets export
- [ ] PWA (offline mobile app)
- [ ] WhatsApp bot integration

---

## 📄 License
MIT — Free to use and modify.
