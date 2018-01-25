/* global module */
var builder = require("botbuilder");

module.exports = function (bot) {
    bot.dialog("missionsStatus", require("./missionsStatus"));
    var choices = {
        "Accepted" : {
            item: "Accepted"
        },
        "Declined": {
            item: "Declined"
        },
        "Pending": {
            item: "Pending"
        },
        "All": {
            item: "All"
        }
    };

    var statusText = [
        "Declined","Accepted","Pending"
    ]
 
    return [
        function (session, args) {
            if (args && args.reprompt) {
                builder.Prompts.text(session, `I'm affraid I don't have anything to show you. Shall we look another status ?`);
            }
            else {
                builder.Prompts.choice(session, `Ok ${session.userData.data.firstName}, which status of missions do you want to retrieve ?`, choices, {listStyle: builder.ListStyle["button"]});
            }
        },
        function (session, args) {
            session.conversationData.statusChoice = choices[args.response.entity].item;
            session.beginDialog("missionsStatus");
        },
        function (session, args) {
            if (args["hydra:totalItems"] === 0) {
                session.replaceDialog("missionsStatusChoice", {reprompt: true});
            }
            else {
                var msg = new builder.Message(session);
                msg.attachmentLayout(builder.AttachmentLayout.carousel);
                msg.attachments(
                    args["hydra:member"].map(candidate => (
                        new builder.HeroCard(session)
                            .title(`Accommodation n${candidate.accommodation}`)
                            .text(`Status : ${statusText[candidate.status]}`)
                    ))
                );
                session.send(msg).endDialog();
            }
        }
    ];
};

