const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
    {
        like: Boolean,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);
const Like = model("like", likeSchema);

module.exports = Like;