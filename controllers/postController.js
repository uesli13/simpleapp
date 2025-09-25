// controllers/postController.js
const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Public (later can add auth)
const createPost = async (req, res, next) => {
  try {
    const { userId, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const post = await Post.create({ user: req.user._id, content });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "username email");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

//THis is an experiment
module.exports = { createPost, getPosts, getPostById };
