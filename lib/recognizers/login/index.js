import { isLoggedIn } from "../../utils/session";
import { TIMEOUT_AWAIT } from "../../utils/constants";
import { isMsgIntentPrefixed } from "../../utils/userIntent";

module.exports = (session) => {
    if (isMsgIntentPrefixed(session)) {
        if (isLoggedIn(session)) {
            session.sendTyping();
            setTimeout(() => {
                session.send("Looks like you're already logged in !");
            }, TIMEOUT_AWAIT);
        } else {
            session.beginDialog("login");
        }
    }
}
