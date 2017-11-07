var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends: [ {
            id: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User"
            },
            username: String
        }
    ],
    lowerusername: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
