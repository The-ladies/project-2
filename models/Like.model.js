const { Schema, model, Types } = require("mongoose");

const likeSchema = new Schema(
    {
        post: {
            type: Types.ObjectId,
            ref: "Post",
            default: null,
        },
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

const Like = model("Like", likeSchema);

module.exports = Like;