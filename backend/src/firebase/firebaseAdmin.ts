import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(
  __dirname,
  "../../firebaseServiceAccountKey.json"
);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
