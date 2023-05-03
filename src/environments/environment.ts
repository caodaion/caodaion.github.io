// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  administratorUrl: 'http://localhost:4200/auth?token=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW5pc3RyYXRvciIsInJlZGlyZWN0VG8iOiIvdHJhbmctY2h1L2tpbmgifQ.OPixqUlQxMuCI9ciDOBDrQonCuyUshKvHNjC0-yIvY8',
  firebaseConfig: {
    apiKey: "AIzaSyAnwlY1ftsfJLWfn-5PCbftOaQ1_4wRKxo",
    authDomain: "caodaion-5167e.firebaseapp.com",
    projectId: "caodaion-5167e",
    storageBucket: "caodaion-5167e.appspot.com",
    messagingSenderId: "671089239835",
    appId: "1:671089239835:web:d2ec42f54b02f0fed115be",
    measurementId: "G-8EMJZEB65T"
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
