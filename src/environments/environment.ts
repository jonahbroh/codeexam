// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  data: {
    tweets : "assets/Twitter_141103.csv",
    places: "assets/FacebookPlaces_Albuquerque.csv",
    facts: "assets/BernallioCensusBlocks_Joined.json",
    values: "src/assets/KeyforB00000Values.txt",
    '01001': "src/assets/ACS_13_5YR_B01001_metadata.csv",
    '01002': "src/assets/ACS_13_5YR_B01002_metadata.csv",
    '08301': "src/assets/ACS_13_5YR_B08301_metadata.csv",
    '11001': "src/assets/ACS_13_5YR_B11001_metadata.csv",
    '19051': "src/assets/ACS_13_5YR_B19051_metadata.csv"
  },
  mapbox: {
    accessToken: 'pk.eyJ1Ijoiam9uYWhicm9oIiwiYSI6ImNqbG12ZmM1ODFjbmkza281Y2NvY2x6ZncifQ.gHjZYsOCjn3Fzi9B72Xk4Q'
  }
}
/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
