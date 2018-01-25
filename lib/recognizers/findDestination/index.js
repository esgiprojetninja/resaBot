import { unAuthorizedResponse } from "../start";

module.exports = (session, args) => {
    if (!sessionUtils.isLoggedIn(session)) {
        unAuthorizedResponse(session, args);
        return;
    }
    console.log("Matched FindADestination intent !");
};
