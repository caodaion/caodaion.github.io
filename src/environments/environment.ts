// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  administratorUrl: 'http://localhost:4200/auth?token=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW5pc3RyYXRvciIsInJlZGlyZWN0VG8iOiIvdHJhbmctY2h1L2tpbmgifQ.OPixqUlQxMuCI9ciDOBDrQonCuyUshKvHNjC0-yIvY8',
  firebaseConfig: {
    apiKey: "AIzaSyDavRMqGB8aszzTrYJ2IOmpPUkeynN_xbk",
    authDomain: "caodaion-5c203.firebaseapp.com",
    projectId: "caodaion-5c203",
    storageBucket: "caodaion-5c203.appspot.com",
    messagingSenderId: "415271346393",
    appId: "1:415271346393:web:4405bd4a06c08c18079ec8",
    measurementId: "G-3TZWT3X0N6"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
