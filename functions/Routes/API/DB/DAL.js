const admin = require('firebase-admin');

let serviceAccount = require('./blessing-def2f-a5d250fa5e0f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

module.exports = db;
