
const admin = require("firebase-admin");
const serviceAccountConfig = require("./adminsdk.json")

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
  databaseURL: "https://silent-blend-161710-default-rtdb.asia-southeast1.firebasedatabase.app"
});

async function callDB() {
  firebaseApp.database().ref("Nrx4bAHlo0UwXR5jpgWXAkZpr7q1").get().then(snapshot => {
    snapshot.child('moodEntries').forEach(function (it) {
      console.log(it.toJSON())
    })
  })
}

async function authUser(req) {
  firebaseApp.auth().verifyIdToken(req.body.token, true).then( token => {
    return token
  }).catch(_ => {
    return req.status(403)
  })
}

app.post('/',(req, res) => {
  authUser(req).then(promise => {
    console.log("Success")
    res.send("Logged in")
  }).catch(error => {
    console.log(error)
    res.status(403).send("Unauthorised")
  })
})

module.exports = app;