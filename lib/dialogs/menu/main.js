/* global module */
var builder = require("botbuilder");

var DialogLabels = {
    Login: "Login",
    SearchAccommodations: "Search Accommodations",
    SearchMissions: "Search Missions"
};

module.exports = [
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
        var selection = DialogLabels[result.response.entity];
        switch (selection) {
            case DialogLabels.Login:
                return session.beginDialog("login");
            case DialogLabels.SearchMissions:
                return session.beginDialog("search");
            default:
                session.endDialog("This action is not yet ready. Check back soon !");
        }
    }
]