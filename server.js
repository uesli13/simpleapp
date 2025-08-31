const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init express app
const app = express();

app.use(cors()); 

// static frontend
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes.js"));

// Error handler (will add later)
const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
