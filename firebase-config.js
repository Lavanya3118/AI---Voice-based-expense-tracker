// ============================================================
//  VoiceSpend — Firebase Integration
//  Replace localStorage with Firebase Firestore
//  Instructions: https://console.firebase.google.com
// ============================================================

// 1. Install Firebase SDK
// In your project folder: npm install firebase
// Or include via CDN in index.html before your script:
// <script type="module" src="firebase-config.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  deleteDoc, doc, query, where, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===================== FIREBASE CONFIG =====================
// Replace with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ===================== INIT =====================
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

let currentUserId = null;

// Sign in anonymously (each browser session gets a unique user ID)
// For real auth, replace with Google Sign-In or Email/Password
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    listenToExpenses();         // Start real-time sync
  }
});

signInAnonymously(auth).catch(console.error);

// ===================== FIRESTORE HELPERS =====================

/**
 * Add an expense document to Firestore
 * @param {Object} expense - { description, amount, category, date }
 */
export async function addExpenseFirestore(expense) {
  if (!currentUserId) throw new Error("Not authenticated");
  const docRef = await addDoc(collection(db, "users", currentUserId, "expenses"), {
    description: expense.description,
    amount:      parseFloat(expense.amount),
    category:    expense.category,
    date:        expense.date || new Date().toISOString(),
    createdAt:   new Date(),
  });
  console.log("Expense added with ID:", docRef.id);
  return docRef.id;
}

/**
 * Get all expenses for the current user (one-time fetch)
 */
export async function getAllExpenses() {
  if (!currentUserId) return [];
  const q = query(
    collection(db, "users", currentUserId, "expenses"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get expenses for a specific month
 * @param {number} year  - e.g. 2025
 * @param {number} month - 0-indexed (0=Jan, 11=Dec)
 */
export async function getExpensesByMonth(year, month) {
  const start = new Date(year, month, 1).toISOString();
  const end   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  const q = query(
    collection(db, "users", currentUserId, "expenses"),
    where("date", ">=", start),
    where("date", "<=", end),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Delete an expense by Firestore document ID
 * @param {string} docId - Firestore document ID
 */
export async function deleteExpenseFirestore(docId) {
  if (!currentUserId) throw new Error("Not authenticated");
  await deleteDoc(doc(db, "users", currentUserId, "expenses", docId));
  console.log("Expense deleted:", docId);
}

/**
 * Real-time listener — calls callback whenever data changes
 * Use this to replace the localStorage renderAll() calls
 * @param {Function} callback - receives array of expense objects
 */
export function listenToExpenses(callback) {
  if (!currentUserId || !callback) return;
  const q = query(
    collection(db, "users", currentUserId, "expenses"),
    orderBy("date", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}

// ===================== HOW TO INTEGRATE =====================
/*

STEP 1 — Setup Firebase:
  1. Go to https://console.firebase.google.com
  2. Create a new project (e.g. "voicespend")
  3. Enable Firestore Database (Start in test mode for development)
  4. Enable Authentication > Anonymous sign-in
  5. Copy your config object above

STEP 2 — Replace localStorage calls in index.html:

  OLD (localStorage):
    function loadDB() { return JSON.parse(localStorage.getItem('voicespend_expenses')) || []; }
    function saveDB(data) { localStorage.setItem('voicespend_expenses', JSON.stringify(data)); }

  NEW (Firestore):
    async function addExpense(exp) {
      const id = await addExpenseFirestore(exp);
      exp.id = id;
      // refresh UI via listenToExpenses callback
    }

    async function deleteExpense(id) {
      await deleteExpenseFirestore(id);
      // UI updates via real-time listener
    }

STEP 3 — Wire up real-time updates:
    listenToExpenses((freshExpenses) => {
      expenses = freshExpenses;
      renderAll();
      generateInsights();
    });

FIRESTORE SECURITY RULES (Firebase Console > Firestore > Rules):

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId}/expenses/{expenseId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }

DATA STRUCTURE IN FIRESTORE:
  users/
    {userId}/
      expenses/
        {expenseId}/
          description: "Lunch at café"
          amount: 250
          category: "food"
          date: "2025-05-19T12:30:00.000Z"
          createdAt: Timestamp
*/
