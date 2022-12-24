importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js"
)
firebase.initializeApp({
  apiKey: "AIzaSyBKcA_zpHBNItBCa0wjwh1xcWXrvGhFT-0",
  authDomain: "banyuwangi-dashboard.firebaseapp.com",
  projectId: "banyuwangi-dashboard",
  storageBucket: "banyuwangi-dashboard.appspot.com",
  messagingSenderId: "536041587255",
  appId: "1:536041587255:web:a5cde06490e51a6d31f5b2",
  measurementId: "G-QCZJSY35D6",
})
const messaging = firebase.messaging()
