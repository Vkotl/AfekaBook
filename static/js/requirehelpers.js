/* Helper module to keep requiring the helpers in one location. */

var requireHelpersObj = {};

requireHelpersObj.checkInFriendsObj = require("./checkfriend");
requireHelpersObj.postFunctionsObj = require("./postRoutesFunctions");

module.exports = requireHelpersObj;