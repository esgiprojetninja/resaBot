import { TIMEOUT_AWAIT } from "../../utils/constants";
import { getUserName } from "../../utils/session";

module.exports = (session, args) => {
    session.sendTyping();
    setTimeout(() => {
        session.send(`Well hello to you ${getUserName(session)}`);
    }, TIMEOUT_AWAIT);
};
