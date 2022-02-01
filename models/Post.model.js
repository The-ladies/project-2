const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema(
    {
        title: String,
        body: String,
        creatorId: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
          },
    },
    {
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;




