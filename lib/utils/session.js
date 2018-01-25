function getUserData(session) {
    if (!session || !session.userData) return;
    return session.userData;
}
function getUserName(session) {
    if (!session) return;
    return session.userData.username || session.message.user.name
}

function isLoggedIn(session) {
    if (!session) return false;
    return !!session.userData.token;
}

module.exports.getUserData = getUserData;
module.exports.getUserName = getUserName;
module.exports.isLoggedIn = isLoggedIn;