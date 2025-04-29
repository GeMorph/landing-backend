const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firebase_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePictureUrl: {
      type: String,
    },
    cases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Case",
      },
    ],
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
