const { Schema, model, Types } = require("mongoose");

const likeSchema = new Schema(
    {
        title: String,
        
        creatorId: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
          },
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Like = model("Like", likeSchema);

module.exports = Like;