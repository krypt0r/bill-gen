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
    console.log("Appliances", appliances);
    console.log("num", numberOfAppliances);
    //Below code for database ref
    return database.ref("appliance/").once("value", snapshot => {
        const data = snapshot.val();
        //now data is a js object, the appliances detail could be accessed similarily
        let totalPowerConsumption = 1;
        if (appliances.length === numberOfAppliances.length) {
            for (let i = 0; i < appliances.length; i++) {
                totalPowerConsumption += numberOfAppliances[i] * data[appliances[i].output];
            }
        }
        else if (numberOfAppliances.length === 1) {
            for (let i of appliances) {
                totalPowerConsumption += numberOfAppliances[0] * data[i.output];
            }
        }
        else {
            for (let i = 0; i < numberOfAppliances.length; i++) {
                totalPowerConsumption += numberOfAppliances[i] * data[appliances[i].output];
            }
            for (let i = numberOfAppliances.lenght; i < appliances.length; i++) {
                totalPowerConsumption += data[appliances[i].output];
            }
        }
        conv.ask("Total Power Consumption is " + totalPowerConsumption);
    });
});
exports.googleAction = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map