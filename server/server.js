import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";
import contactRoutes from "./routes/contact.js";
import submissionRoutes from "./routes/submissions.js";
import ticketRoutes from "./routes/tickets.js";
import profileRoutes from "./routes/profiles.js";
import workerRoutes from "./routes/workers.js";
import serviceRoutes from "./routes/services.js";
import projectRoutes from "./routes/projects.js";
import uploadRoutes from "./routes/uploads.js";

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const blogRoutes = require('./routes/blogs');
// const contactRoutes = require('./routes/contact');
// const submissionRoutes = require('./routes/submissions');
// const ticketRoutes = require('./routes/tickets');
// const profileRoutes = require('./routes/profiles');
// const workerRoutes = require('./routes/workers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
