// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as prodEnvironment } from "./environment.prod"

export const environment = {
  ...prodEnvironment,
  production: false,
  keycloakUrl: "https://dev-auth.banyuwangikab.go.id/",
  serverBaseUrl: "https://dev-api-ai.banyuwangikab.go.id",
   // serverBaseUrl: "https://api-ai.banyuwangikab.go.id",
  firebase: {
    apiKey: "${FIREBASE_API_KEY}",
    authDomain: "smartdashboard-bwi.firebaseapp.com",
    projectId: "smartdashboard-bwi",
    storageBucket: "smartdashboard-bwi.appspot.com",
    messagingSenderId: "666405773757",
    appId: "1:666405773757:web:dee13c0ef51859a6d032d4",
    measurementId: "G-L2F48S7T61",
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/plugins/zone-error" // Included with Angular CLI.
