export const environment = {
  production: true,
  keycloakUrl: "https://auth.banyuwangikab.go.id/",
  keycloakRealm: "banyuwangi",
  keycloakClientId: "angular-banyuwangi",
  hikOpenapi: {
    hcm: {
      appKey: "29765272",
      appSecret: "TQQN1wGxFY1J8I1NHfoz",
      baseUrl: "https://192.168.253.81:443",
    },
    hcp: {
      appKey: "21078063",
      appSecret: "VLb5HhLwF1ZSRYEQCPWz",
      baseUrl: "https://192.168.253.83:443",
    },
  },
  serverBaseUrl: "https://api-ai.banyuwangikab.go.id",
  useHCPHCMData: false,
  firebase: {
    apiKey: "AIzaSyBKcA_zpHBNItBCa0wjwh1xcWXrvGhFT-0",
    authDomain: "banyuwangi-dashboard.firebaseapp.com",
    projectId: "banyuwangi-dashboard",
    storageBucket: "banyuwangi-dashboard.appspot.com",
    messagingSenderId: "536041587255",
    appId: "1:536041587255:web:a5cde06490e51a6d31f5b2",
    measurementId: "G-QCZJSY35D6",
  },
  toast: {
    defaultTimeout: 3000,
    peringatanTimeout: 3000,
    errorTimeout: 3000,
    infoTimeout: 3000,
  },
}
