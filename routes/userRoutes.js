const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUserById,
  loginUser
} = require("../controllers/userController");

// POST /api/users - register new user
router.post("/", registerUser);

// GET /api/users/:id - get user by id
router.get("/:id", getUserById);

// POST /api/users/login - login
router.post("/login", loginUser);

module.exports = router;
