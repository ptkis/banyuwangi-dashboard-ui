export const environment = {
  version: "0.0.1",
  production: true,
  keycloakUrl: "https://auth.banyuwangikab.go.id/",
  keycloakRealm: "banyuwangi",
  keycloakClientId: "angular-banyuwangi",
  hikOpenapi: {
    hcm: {
      appKey: "29765272",
      appSecret: "TQQN1wGxFY1J8I1NHfoz",
      baseUrl: "/hcm",
    },
    hcp: {
      appKey: "21078063",
      appSecret: "VLb5HhLwF1ZSRYEQCPWz",
      baseUrl: "/hcp",
    },
  },
  serverBaseUrl: "https://api-ai.banyuwangikab.go.id",
  useHCPHCMData: false,
  firebase: {
    apiKey: "${FIREBASE_API_KEY}",
    authDomain: "banyuwangi-dashboard.firebaseapp.com",
    projectId: "banyuwangi-dashboard",
    storageBucket: "banyuwangi-dashboard.appspot.com",
    messagingSenderId: "536041587255",
    appId: "1:536041587255:web:c461874e03273eaf31f5b2",
    measurementId: "G-5L1MEWDCYZ",
  },
  mapCenter: [114.36461695575213, -8.206547262582632],
  mapZoom: 11,
  toast: {
    defaultTimeout: 3000,
    peringatanTimeout: 3000,
    errorTimeout: 3000,
    infoTimeout: 3000,
  },
  reloadHealthCheckInterval: 20, // satuan detik
  reloadErrorInterval: 10, // satuan detik
  liveCheckInterval: 2, // satuan detik
  liveCheckMaxDiff: 20, // satuan detik
  liveCheckSeek: 10, // satuan detik sebelum akhir dari video
  reloadVideoInterval: 600, // satuan detik
}
