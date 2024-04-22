importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js"
)
firebase.initializeApp({
  apiKey: "${FIREBASE_API_KEY}",
  authDomain: "banyuwangi-dashboard.firebaseapp.com",
  projectId: "banyuwangi-dashboard",
  storageBucket: "banyuwangi-dashboard.appspot.com",
  messagingSenderId: "536041587255",
  appId: "1:536041587255:web:c461874e03273eaf31f5b2",
  measurementId: "G-5L1MEWDCYZ",
})
const messaging = firebase.messaging()
