/* global module, process */
var builder = require("botbuilder");

module.exports = [
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
        session.endConversation(
            `Really glad to see you, ${session.userData.data.firstName}! You are now logged in and can look around.`
        );
    }
];
