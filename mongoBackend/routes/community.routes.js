import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentCount, createPost, getPosts, likePost } from "../controller/community.controller.js";

const communityRouter = express.Router();

// All routes require authentication
communityRouter.use(protect);

// Get all posts
communityRouter.get("/getPost", getPosts);

// Create new post
communityRouter.post("/createPost", createPost);

// Like a post
communityRouter.post("/:id/like", likePost);

// Increment comment count
communityRouter.post("/:id/comment", addCommentCount);

export default communityRouter;
