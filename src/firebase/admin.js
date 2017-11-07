import * as admin from "firebase-admin";

var serviceAccount = require("./first-served-c9197-firebase-adminsdk-z1ttd-8eb8f3ca28.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://first-served-c9197.firebaseio.com"
});
