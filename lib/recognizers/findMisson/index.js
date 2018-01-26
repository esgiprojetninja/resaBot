import { unAuthorizedResponse } from "../start";
import { getUserData, isLoggedIn } from "../../utils/session";

module.exports = (session, args) => {
    if (!isLoggedIn(session)) {
        unAuthorizedResponse(session, args);
    }
    else {
        session.beginDialog("search");
    }
};
