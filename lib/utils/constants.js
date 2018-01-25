const TIMEOUT_AWAIT = 2500;
const INTENT_PREFIX = "devwayBot,";

module.exports.TIMEOUT_AWAIT = TIMEOUT_AWAIT;
module.exports.INTENT_PREFIX = INTENT_PREFIX;
module.exports.getLoggedInIntentOptions = () => ["Find a mission", "Find a destination", "Find a mission"];
module.exports.getAnonymousOptions = () => ["Login"];