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

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, []).set("storage", inMemoryStorage);

bot.on("conversationUpdate", function (activity) {
    activity.membersAdded.forEach(function (member) {
        if(member.name === "User") {
            var reply = new builder.Message()
                .address(activity.address)
                .text(`Hello ${member.name}, please type "Main menu" to get started.`);
            bot.send(reply);
        }
    });
});

bot.dialog("mainMenu", require("./dialogs/menu/main")).triggerAction({
    matches: /^main menu$/i
});

bot.dialog("login", require("./dialogs/user/login"));

bot.dialog("getMe", require("./dialogs/user/getMe"));

bot.dialog("search", require("./dialogs/missions/search")(bot));

// Add global LUIS recognizer to bot
// var luisAppUrl = process.env.LUIS_APP_URL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/61a635f4-16c3-4094-894b-cffc40665062?subscription-key=b731322bef9d484ea4c36e7dca760de6&staging=true&verbose=true&timezoneOffset=0&q=";
// bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

// log any bot errors into the console
bot.on("error", function (e) {
    console.log("And error ocurred", e);
});
