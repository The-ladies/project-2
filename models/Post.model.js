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
        likes: [{
            type: Types.ObjectId,
            ref: "User",
            default: null,
        }]
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Post = model("Post", postSchema);

module.exports = Post;




