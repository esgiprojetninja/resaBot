import { unAuthorizedResponse } from "../start";
import { getUserData, isLoggedIn } from "../../utils/session";

module.exports = (session, args) => {
    session.beginDialog("mainMenu");
};
