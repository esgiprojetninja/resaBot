/* global module, process */

module.exports = [
    function (session, args) {
        session.sendTyping();
        fetch(`${process.env.API_URL}/api/candidates/status?user_id=${session.userData.data.id}&status=${session.conversationData.statusChoice}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.userData.token}`
            }
        }).then(res => res.json()).then(parsed => {
            if (parsed.trace) {
                session.endConversation(`Something went wrong: ${parsed.detail}. Please try again !`);
            }
            else {
                session.endDialogWithResult(parsed);
            }
        });
    }
];

