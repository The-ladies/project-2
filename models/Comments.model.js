const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        user: String,
        post: String,
        text: String,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Comment = model("comment", commentSchema);

module.exports = Comment;