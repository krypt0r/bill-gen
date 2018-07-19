import * as functions from 'firebase-functions';
const admin = require("firebase-admin");

admin.initializeApp();
const { dialogflow } = require('actions-on-google');
const app = dialogflow({
    debug: true
});

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

app.intent("welcomeIntent", conv => {
    conv.ask("Helllllo");
});

exports.googleAction = functions.https.onRequest(app);