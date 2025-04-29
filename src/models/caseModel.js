const mongoose = require("mongoose");
const { Schema } = mongoose;

const CaseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed", "resolved"],
      default: "open",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    tags: [
      {
        type: String,
      },
    ],
    history: [
      {
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Case", CaseSchema);
