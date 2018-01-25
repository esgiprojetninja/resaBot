import { unAuthorizedResponse } from "../start";
import { getUserData } from "../../utils/session";

module.exports = (session, args) => {
    if (!sessionUtils.isLoggedIn(session)) {
        unAuthorizedResponse(session, args);
        return;
    }
    console.log("Matched FindAMission intent !", getUserData(session));
};
