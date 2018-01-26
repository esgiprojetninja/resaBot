import { TIMEOUT_AWAIT } from "../../utils/constants";

module.exports = (session, args) => {
    session.sendTyping();
    setTimeout(() => {
        session.send("Sorry, I couldn't understand your request. I am only here to help you use Devaway's services. You can type 'help' anytime to get started.");
    }, TIMEOUT_AWAIT);
};
