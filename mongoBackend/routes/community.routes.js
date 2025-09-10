import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentCount, createPost, getPosts, likePost } from "../controller/community.controller.js";

const communityRouter = express.Router();



// Get all posts
communityRouter.get("/getPost",protect, getPosts);

// Create new post
communityRouter.post("/createPost",protect, createPost);

// Like a post
communityRouter.post("/:id/like",protect, likePost);

// Increment comment count
communityRouter.post("/:id/comment",protect, addCommentCount);

export default communityRouter;
