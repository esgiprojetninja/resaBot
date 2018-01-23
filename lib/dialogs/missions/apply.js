/* global module, process */

module.exports = [
    function (session, args) {
        session.sendTyping();
        session.conversationData.applyedTo = args.data;
        const data = {
            "user": `/api/users/${session.userData.data.id}`,
            "accommodation": `/api/accommodations/${session.conversationData.applyedTo}`
        };
        console.log(data);
        fetch(`${process.env.API_URL}/api/candidates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.userData.token}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(parsed => {
            if (parsed.trace) {
                session.endConversation(`Something went wrong: ${parsed.detail}. Please try again !`);
            }
            else {
                session.endConversation("You successfully applied !");
            }
        });
    }
];

