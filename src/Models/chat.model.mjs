import { Schema, model, Types } from "mongoose";

const chatSchema = Schema(
  {
    tripId: {
      type: Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    messages: [
      {
        sender: { type: Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const  Chat = model("Chat", chatSchema);
export default Chat;
