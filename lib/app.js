import { INTENT_PREFIX } from "./utils/constants";

/* global process */
require("dotenv").config();
const restify = require("restify");
const builder = require("botbuilder");
require("es6-promise").polyfill();
require("isomorphic-fetch");

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post("/api/messages", connector.listen());

const inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector).set("storage", inMemoryStorage);
require("./recognizers/start").start(bot);

bot.on("conversationUpdate", function (activity) {
    activity.membersAdded.forEach(function (member) {
        if(member.name === "User") {
            const reply = new builder.Message()
                .address(activity.address)
                .text(`Hello ${member.name} I am Devaway's assistant, my purpose is to help you use our services. To activate most of my services you're gonna have to start your messages by ${INTENT_PREFIX}`);
            bot.send(reply);
        }
    });
});
// @TODO add option to leave menu and end dialog
bot.dialog("mainMenu", require("./dialogs/menu/main")).triggerAction({
    matches: /^main menu$/i
});

bot.dialog("login", require("./dialogs/user/login"));

bot.dialog("getMe", require("./dialogs/user/getMe"));

bot.dialog("searchAMission", require("./dialogs/missions/search")(bot));

bot.dialog("missionsStatusChoice", require("./dialogs/missions/missionsChoiceStatus")(bot));

bot.dialog("/applyToMission", require("./dialogs/missions/apply"));
bot.beginDialogAction("applyToMission", "/applyToMission");

// log any bot errors into the console
bot.on("error", function (e) {
    console.log("And error ocurred", e);
});

module.exports.getBot = () => bot;