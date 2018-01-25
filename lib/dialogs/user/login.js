import { setInterval, clearInterval } from "timers";
import { getUserName, saveUserData } from "../../utils/session";
import { TIMEOUT_AWAIT } from "../../utils/constants";

/* global module, process */
var builder = require("botbuilder");

module.exports = [
    function (session, args) {
        session.sendTyping();
        setTimeout(function() {
            builder.Prompts.text(session, `In order to log in, visit [DevAway](${process.env.APP_URL}/profile), login and click on "Get my guard code". Then paste it here`);
        }, TIMEOUT_AWAIT);
    },
    function (session, args) {
        session.dialogData.code = args.response.trim();
        builder.Prompts.text(session, "Now give me your email address so I can log you in");
    },
    function (session, args) {
        session.dialogData.email = args.response.trim();
        let refreshingTypeNotif = setInterval(session.sendTyping.bind(session), TIMEOUT_AWAIT);
        fetch(`${process.env.API_URL}/api/guard_code/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: session.dialogData.email,
                code: session.dialogData.code
            })
        }).then(response => response.json()).then((res) => {
            clearInterval(refreshingTypeNotif);
            if (res.hasError) {
                session.endConversation(`Something went wrong: ${res.message}. Please try again !`);
            }
            else {
                saveUserData(session, res);
                session.send("Ok, you just logged in ! Please wait a moment while we setup the connection with DevAway...");
                session.beginDialog("getMe");
            }
            }, err => clearInterval(refreshingTypeNotif));
    },
    function (session, args) {
        session.userData.data = args;
        session.sendTyping();
        setTimeout(function () {
            session.endConversation(
                `Really glad to see you, ${getUserName(session)}! You are now logged in and can freely look around. How can I help ?`
            );
        }, TIMEOUT_AWAIT);
    }
];
