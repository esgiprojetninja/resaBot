import { unAuthorizedResponse } from "../start";
import { getUserData, isLoggedIn } from "../../utils/session";

module.exports = (session, args) => {
    session.endConversation("I can help you to find a mission. Simply ask it to me. Also, you can type 'main menu' to list what I can do fot you.");
};
