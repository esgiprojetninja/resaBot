import * as sessionUtils from "../utils/session";

const builder = require("botbuilder");


function unAuthorizedResponse(session, args) {
    session.send(`Before we can go any further I'm gonna need you to login to use my services`);
    session.sendTyping();
    setTimeout(() => {
        session.beginDialog("login", args);
    }, 2500);
}

module.exports = function(bot) {
    const recognizer = new builder.LuisRecognizer(process.env.LUIS_APP_URL);
    const intents = new builder.IntentDialog({ recognizers: [recognizer] })
        .onBegin((session, args, next) => {
            console.log("########### Luis about to be contacted for the first time and the first time only ###########");
            session.sendTyping();
            setTimeout(() => {
                unAuthorizedResponse(session, args);
            }, 2500);
        })
        .matches('FindAMission', (session, args) => {
            if (!sessionUtils.isLoggedIn(session)) {
                unAuthorizedResponse(session, args);
                return;
            }
            console.log("Matched FindAMission intent !");
        })
        .matches('FindADestination', (session) => {
            if (!sessionUtils.isLoggedIn(session)) {
                unAuthorizedResponse(session, args);
                return;
            }
            console.log("Matched FindADestination intent !");
        })
        .matches('None', (session) => {
            console.log("Matched None intent !");
        })
        .matches('Login', require("./login"))
        .onDefault((session) => {
            console.log("No intents matched");
        });

    // Le dialog par défaut est assigné ici 
    bot.dialog('/', intents);

    module.exports.getRecognizer = () => recognizer;
    module.exports.getLoggedInIntentOptions = () => ["Find a mission", "Find a destination", "Find a mission"];
    module.exports.getAnonymousOptions = () => ["Login"];
}