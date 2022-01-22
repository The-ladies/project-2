const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        title: String,
        body: String,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;




