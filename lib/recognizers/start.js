import * as sessionUtils from "../utils/session";
import { TIMEOUT_AWAIT } from "../utils/constants";

const builder = require("botbuilder");
const recognizer = new builder.LuisRecognizer(process.env.LUIS_APP_URL);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

function unAuthorizedResponse(session, args) {
    session.sendTyping();
    setTimeout(function () {
        session.send(`Before we can go any further I'm gonna need you to login to use my services`);
        session.beginDialog("login", args);
    }, TIMEOUT_AWAIT);
}

function start(bot) {
    intents
        .onBegin((session, args, next) => {
            unAuthorizedResponse(session, args);
        })
        .matches('FindAMission', require("./findMisson"))
        .matches('FindADestination', require("./findDestination"))
        .matches('None', require("./none"))
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

module.exports.start = start;
module.exports.unAuthorizedResponse = unAuthorizedResponse;