import { unAuthorizedResponse } from "../start";
import { isMsgIntentIfNotPrefixed } from "../../utils/userIntent";

module.exports = (session, args) => {
    if(!isMsgIntentIfNotPrefixed(session)) return;
    if (!sessionUtils.isLoggedIn(session)) {
        unAuthorizedResponse(session, args);
        return;
    }
    session.endConversation("This feature is not implmented yet. Check back soon !");
};
