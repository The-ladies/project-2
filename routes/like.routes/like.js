const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
    {
        title: String,
        description: String,
        duration: String,
        isCompleted: { type: Boolean, default: false },
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Like = model("Like", likeSchema);

module.exports = Like;