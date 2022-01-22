// models/User.model.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true  
    },
    password: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
