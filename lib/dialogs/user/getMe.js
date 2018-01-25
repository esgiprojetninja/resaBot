import { saveUserData } from "../../utils/session";

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
                session.send(`Something went wrong while refreshing the connection with DevAway`);
                session.endConversation(`Received error: ${parsed.message}. Please try again !`);
            }
            else {
                saveUserData(session, parsed);
                session.send("Your connection with devaway is now established.");
                session.endDialogWithResult(parsed);
            }
        }).catch(err => {
            session.send(`Something went wrong while refreshing the connection with DevAway`);
            session.endConversation(`Received error: ${parsed.message}. Please try again !`);
        });
    }
];
