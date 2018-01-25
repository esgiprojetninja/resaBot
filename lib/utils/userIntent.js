import { recognizer } from "./../recognizers/start";
import { INTENT_PREFIX } from "./constants";

/**
 * https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.iintentrecognizer.html
 * @param {IIntentRecognizer} result
 */
function doesUserIntentToCancel(luisResult) {
    if (!luisResult || !luisResult.intents || !luisResult.intents.length) return false;

    const abortOpIntentMatch = luisResult.intents.find(i => i.intent === "AbortOperation");
    return abortOpIntentMatch.score > 0.61;
}

/** 
 * 
https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#sendtyping
 * @param {Session} session
 */
function cancelConversationIfAbortIntentMatched(session, callback) {
    recognizer.recognize(session, (err, result) => {
        if (err) {
            console.log("Login couldn't contact luis, err: ", err);
            callback();
            return;
        }
        if (doesUserIntentToCancel(result)) {
            session.endConversation("You asked for a cancel, operation aborted.");
        } else {
            callback();
        }
    });
}

/**
 * Know if message is prefixed
 * @return {boolean}
 */
function isMsgIntentPrefixed(session) {
    if(!session || !session.message || !session.message.text) return true;
    return session.message.text.indexOf(INTENT_PREFIX) === 0;
}

module.exports.cancelConversationIfAbortIntentMatched = cancelConversationIfAbortIntentMatched;
module.exports.doesUserIntentToCancel = doesUserIntentToCancel;
module.exports.isMsgIntentPrefixed = isMsgIntentPrefixed;
