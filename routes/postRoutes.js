const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
} = require("../controllers/postController");

// POST /api/posts - create new post
router.post("/", protect, createPost);

// GET /api/posts - get all posts
router.get("/", getPosts);

// GET /api/posts/:id - get single post by id
router.get("/:id", getPostById);

module.exports = router;
