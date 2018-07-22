import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const database = admin.database();

const {
    dialogflow
} = require('actions-on-google');
const app = dialogflow({
    debug: true
});


app.intent("What is the power output", conv => {
    const appliances: string[] = conv.parameters['appliances'];
    const numberOfAppliances: number[] = conv.parameters['numbers'];
    //Below code for database ref
    return database.ref("appliances/").once("value", snapshot => {
        const data = snapshot.val();
        //now data is a js object, the appliances detail could be accessed similarily
        let totalPowerConsumption = 0;
        const unknownValues: string[] = [];
        //If the Number of all Appliances are provided by user
        if (appliances.length === numberOfAppliances.length) {
            for (let i = 0; i < appliances.length; i++) {
                if (data[appliances[i]] !== undefined)
                    totalPowerConsumption += numberOfAppliances[i] * data[appliances[i]].output;
                else
                    unknownValues.push(appliances[i]);
            }
        }
        // If The only single Number of appliance is provided. It'll take same for all appliances.
        else if (numberOfAppliances.length === 1) {
            for (const appliance of appliances) {
                if(data[appliance] !== undefined)
                    totalPowerConsumption += numberOfAppliances[0] * data[appliance].output;
                else
                    unknownValues.push(appliance);
            }
        }
        //if no Number of Appliances are provided. It'll take 1 as default for all appliances
        else if (numberOfAppliances.length === null) {
            for (const appliance of appliances) {
                if(data[appliance] !== undefined)
                    totalPowerConsumption += data[appliance].output;
                else
                    unknownValues.push(appliance);
            }
        }
        // If Number of Appliances is provided for only some of applianes.
        else {
            for (let i = 0; i < numberOfAppliances.length; i++) {
                if(data[appliances[i]] !== undefined)
                    totalPowerConsumption += numberOfAppliances[i] * data[appliances[i]].output;
                else
                    unknownValues.push(data[appliances[i]])
            }
            for (let i = numberOfAppliances.length; i < appliances.length; i++) {
                if(data[appliances[i]] !== undefined)
                    totalPowerConsumption += data[appliances[i]].output;
                else
                    unknownValues.push(data[appliances[i]])

            }
        }
        conv.ask("Total Power Consumption will be " + totalPowerConsumption + " Watts");
        if(unknownValues.length) {
            if(unknownValues.length === 1)
                conv.close(`I am unaware of power usage of ${unknownValues[0]}. Informed it to developers, would surely get to know about it soon.`)
            else
                conv.close(`I am unaware of power usage of ${unknownValues.slice(0,-1).join(', ')} and ${unknownValues.slice(-1)}. Informed it to developers, would surely get to know about it soon.`);
            console.warn("<unknown-values>",unknownValues);
        }
        else {
            conv.ask("Anything else I can help you with?")
        }

    }).catch(e => {
        conv.close("Looks like I faced an internal short circuit! Meet you soon when I am repaired.");
        console.error(e);
    })
})

exports.googleAction = functions.https.onRequest(app);