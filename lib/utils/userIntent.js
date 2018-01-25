/* global module */
import { recognizer } from "../recognizers/start";

/**
 * https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.iintentrecognizer.html
 * @param {IIntentRecognizer} result
 */
export function doesUserIntentToCancel(luisResult) {
    if (!luisResult || !luisResult.intents || !luisResult.intents.length) {
         return false;
    }

    const abortOpIntentMatch = luisResult.intents.find(i => i.intent === "AbortOperation");
    return abortOpIntentMatch.score > 0.61;
}

/**
 *
https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#sendtyping
 * @param {Session} session
 */
function cancelConversationIfAbortIntentMatched(session, callback) {
    console.log("ptin");
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

module.exports.cancelConversationIfAbortIntentMatched = cancelConversationIfAbortIntentMatched;
module.exports.doesUserIntentToCancel = doesUserIntentToCancel;
