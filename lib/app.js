/* global process */
require("dotenv").config();
var restify = require("restify");
var builder = require("botbuilder");
require("es6-promise").polyfill();
require("isomorphic-fetch");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post("/api/messages", connector.listen());

var DialogLabels = {
    Login: "Login",
    SearchAccommodations: "Search Accommodations",
    SearchMissions: "Search Missions"
};
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.choice(
            session,
            "Hello ! What do you want to do today ?",
            DialogLabels,
            {
                maxRetries: 3,
                retryPrompt: "Not a valid option"
            }
        );
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send("Ooops! Too many attemps :( But don't worry, I'm handling that exception and you can try again!");
            return session.endDialog();
        }
        // on error, start over
        session.on("error", function (err) {
            session.send("Failed with message: %s", err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Login:
                return session.beginDialog("login");
            default:
                session.endDialog("This action is not yet ready. Check back soon !");
        }
    }
]).set("storage", inMemoryStorage);

bot.dialog("login", [
    function (session, args) {
        builder.Prompts.text(session, `In order to log in, visit [DevAway](${process.env.APP_URL}/profile), login and click on "Get my guard code". Then paste it here`);
    },
    function (session, args) {
        session.dialogData.code = args.response;
        builder.Prompts.text(session, "Please give me your email address so I can log you in");
    },
    function (session, args) {
        session.dialogData.email = args.response;
        session.sendTyping();
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
            if (res.hasError) {
                session.endConversation(`Something went wrong: ${res.message}. Please try again !`);
            }
            else {
                session.userData.token = res.token;
                session.send("Wow, you just logged in ! Please wait a moment while a gather some data...");
                session.beginDialog("getMe");
            }
        });
    },
    function (session, args) {
        session.userData.data = args;
        session.endConversation(`Really glad to see you, ${session.userData.data.firstName}!`);
    }
]);

bot.dialog("getMe", [
    function (session, args) {
        session.sendTyping();
        fetch(`${process.env.API_URL}/api/users/me.json`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.userData.token}`
            }
        }).then(res => res.json()).then(parsed => {
            if (parsed.hasError) {
                session.endConversation(`Something went wrong: ${parsed.message}. Please try again !`);
            }
            else {
                session.endDialogWithResult(parsed);
            }
        });
    }
]);

// Add global LUIS recognizer to bot
// var luisAppUrl = process.env.LUIS_APP_URL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/61a635f4-16c3-4094-894b-cffc40665062?subscription-key=b731322bef9d484ea4c36e7dca760de6&staging=true&verbose=true&timezoneOffset=0&q=";
// bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

// log any bot errors into the console
bot.on("error", function (e) {
    console.log("And error ocurred", e);
});
