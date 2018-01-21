/* global module, process */

module.exports = [
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
];
