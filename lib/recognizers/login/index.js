import { isLoggedIn } from "../../utils/session";
import { TIMEOUT_AWAIT } from "../../utils/constants";

module.exports = (session) => {
    if (isLoggedIn(session)) {
        session.sendTyping();
        setTimeout(() => {
            session.send("Looks like you're already logged in !");
        }, TIMEOUT_AWAIT);
    } else {
        session.beginDialog("login");
    }
}
