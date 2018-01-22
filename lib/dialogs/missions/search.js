/* global module */
var builder = require("botbuilder");

module.exports = function (bot) {
    bot.dialog("searchMissions", require("./searchMissions"));
    return [
        function (session) {
            builder.Prompts.text(session, `Ok ${session.userData.data.firstName}, where do you want to go ?`);
        },
        function (session, args) {
            // looking for missions
            // TODO : replace this with the custom view
            session.beginDialog("searchMissions");
        },
        function (session, args) {
            var msg = new builder.Message(session);
            msg.attachmentLayout(builder.AttachmentLayout.carousel);
            msg.attachments(
                args.map(mission => (
                    new builder.HeroCard(session)
                        .title(`mission n${mission.id}`)
                        .text(mission.description)
                        .buttons([
                            builder.CardAction.imBack(session, "Candidate", "")
                        ])
                ))
            );
            session.send(msg).endDialog();
        }
    ];
};

