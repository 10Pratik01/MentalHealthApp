import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    anonymous: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Post = mongoose.model("Post", postSchema);
export default Post;
