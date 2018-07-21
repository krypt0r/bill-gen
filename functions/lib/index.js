"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const database = admin.database();
const { dialogflow } = require('actions-on-google');
const app = dialogflow({
    debug: true
});
app.intent("What is the power output", conv => {
    const appliances = conv.parameters['appliances'];
    const numberOfAppliances = conv.parameters['numbers'];
    //Below code for database ref
    return database.ref("appliances/").once("value", snapshot => {
        const data = snapshot.val();
        //now data is a js object, the appliances detail could be accessed similarily
        let totalPowerConsumption = 0;
        //If the Number of all Appliances are provided by user
        if (appliances.length === numberOfAppliances.length) {
            for (let i = 0; i < appliances.length; i++) {
                totalPowerConsumption += numberOfAppliances[i] * data[appliances[i]].output;
            }
        }
        // If The only single Number of appliance is provided. It'll take same for all appliances.
        else if (numberOfAppliances.length === 1) {
            for (let i of appliances) {
                totalPowerConsumption += numberOfAppliances[0] * data[i].output;
            }
        }
        //if no Number of Appliances are provided. It'll take 1 as default for all appliances
        else if (numberOfAppliances.length === null) {
            for (let i of appliances) {
                totalPowerConsumption += data[appliances[i]].output;
            }
        }
        // If Number of Appliances is provided for only some of applianes.
        else {
            for (let i = 0; i < numberOfAppliances.length; i++) {
                totalPowerConsumption += numberOfAppliances[i] * data[appliances[i]].output;
            }
            for (let i = numberOfAppliances.length; i < appliances.length; i++) {
                totalPowerConsumption += data[appliances[i]].output;
            }
        }
        conv.ask("Total Power Consumption will be " + totalPowerConsumption + " Watts");
    });
});
exports.googleAction = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map