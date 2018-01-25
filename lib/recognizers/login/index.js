const bot = require("../../app");

module.exports = (session) => {
    session.beginDialog("login");
}