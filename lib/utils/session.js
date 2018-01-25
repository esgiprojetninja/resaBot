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

function saveUserData(session, data) {
    session.userData = {
        ...session.userData,
        ...data
    };
    console.log("########## SAVED USERDATA ##########");
    console.log(session.userData);
}

module.exports.getUserData = getUserData;
module.exports.getUserName = getUserName;
module.exports.isLoggedIn = isLoggedIn;
module.exports.saveUserData = saveUserData;