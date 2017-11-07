var mongoose    = require("mongoose");

// SCHEMA SETUP
var postSchema = new mongoose.Schema({
   image: String,
   description: String,
   author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     username: String
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
       ],
    personal: Boolean,
    date: Date,
    likes: 
        {
            amount: Number,
            users: [
                {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                     },
                     username: String
                }
                ]
        }
});

module.exports = mongoose.model("Post", postSchema);