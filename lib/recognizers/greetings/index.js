import { TIMEOUT_AWAIT } from "../../utils/constants";
import { getUserName, isLoggedIn } from "../../utils/session";

module.exports = (session, args) => {
    session.sendTyping();
    setTimeout(() => {
        session.send(`Well hello to you ${getUserName(session)}`);
        if (!isLoggedIn(session)) {
            session.beginDialog("login");
        }
    }, TIMEOUT_AWAIT);
};
