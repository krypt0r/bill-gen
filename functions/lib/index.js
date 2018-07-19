"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const { dialogflow } = require('actions-on-google');
const app = dialogflow({
    debug: true
});
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
//# sourceMappingURL=index.js.map