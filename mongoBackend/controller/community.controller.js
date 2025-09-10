import Post from "../models/community.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Fetch all posts (most recent first)
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name email"); // optional: fetch author info
  res.status(200).json({ success: true, posts });
});

// ✅ Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { content, anonymous } = req.body;

  if (!content || content.trim() === "") {
    res.status(400);
    throw new Error("Post content cannot be empty");
  }

  const post = await Post.create({
    author: req.user._id,
    content: content.trim(),
    anonymous: anonymous || false,
  });

  res.status(201).json({ success: true, post });
});

// ✅ Like a post
export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  post.likes += 1;
  await post.save();
  res.status(200).json({ success: true, likes: post.likes });
});

// ✅ Add comment count (optional)
export const addCommentCount = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  post.commentsCount += 1;
  await post.save();
  res.status(200).json({ success: true, commentsCount: post.commentsCount });
});
