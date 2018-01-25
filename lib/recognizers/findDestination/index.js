import { unAuthorizedResponse } from "../start";
import { isMsgIntentIfNotPrefixed } from "../../utils/userIntent";

module.exports = (session, args) => {
    if(!isMsgIntentIfNotPrefixed(session)) return;
    if (!sessionUtils.isLoggedIn(session)) {
        unAuthorizedResponse(session, args);
        return;
    }
    console.log("Matched FindADestination intent !");
};
