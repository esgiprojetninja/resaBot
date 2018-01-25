const builder = require("botbuilder");

module.exports = function(bot) {
    const recognizer = new builder.LuisRecognizer(process.env.LUIS_APP_URL);
    const intents = new builder.IntentDialog({ recognizers: [recognizer] })
        .onBegin((session, args, next) => {
            console.log("########### Luis about to be contacted for the first time and the first time only ###########");
            next();
        })
        .matches('FindAMission', (session) => {
            console.log("Matched FindAMission intent !");
        })
        .matches('FindADestination', (session) => {
            console.log("Matched FindADestination intent !");
        })
        .matches('None', (session) => {
            console.log("Matched None intent !");
        })
        .onDefault((session) => {
            console.log("No intents matched");
        });

    // Le dialog par défaut est assigné ici 
    bot.dialog('/', intents);
}