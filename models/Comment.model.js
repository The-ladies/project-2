const { Schema, model, Types} = require("mongoose");

const commentSchema = new Schema(
    {
        author: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
        },
        post: {
            type: Types.ObjectId,
            ref: "Post",
            default: null,
        },
        text: String,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;