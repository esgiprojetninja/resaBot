/* global module */
var builder = require("botbuilder");
import { cancelConversationOnIntentsMatched } from "../../utils/userIntent";
import { getUserName } from "../../utils/session";

module.exports = function (bot) {
    bot.dialog("searchMissions", require("./searchMissions"));
    return [
        function (session, args) {
            if (args && args.reprompt) {
                builder.Prompts.text(session, `I'm affraid I don't have anything to offer around ${session.conversationData.locationFilter}. Another place maybe ?`);
            }
            else {
                builder.Prompts.text(session, `Ok ${getUserName(session)}, where do you want to go ?`);
            }
        },
        function (session, args) {
            session.conversationData.locationFilter = args.response;
            cancelConversationOnIntentsMatched(session, ["Refusing", "AbortOperation"], () => { session.beginDialog("searchMissions"); });
        },
        function (session, args) {
            if (args["hydra:totalItems"] === 0) {
                session.replaceDialog("searchAMission", {reprompt: true});
            }
            else {
                var msg = new builder.Message(session);
                msg.attachmentLayout(builder.AttachmentLayout.carousel);
                msg.attachments(
                    args["hydra:member"].map(mission => (
                        new builder.HeroCard(session)
                            .title(`mission n${mission.id}`)
                            .text(mission.description)
                            .buttons([
                                builder.CardAction
                                    .dialogAction(session, "applyToMission", mission.accommodation, "Apply")
                            ])
                    ))
                );
                session.send(msg).endDialog();
            }
        }
    ];
};

