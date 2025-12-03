// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const taskRoutes = require("./src/routes/task.routes");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();

// Kết nối DB
connectDB();

// Middleware chung
app.use(helmet());
app.use(cors()); // bạn có thể cấu hình origin cho chặt hơn
app.use(morgan("dev"));
app.use(express.json()); // parse JSON body

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Task Management API by Hau Dev" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Middleware xử lý lỗi (đặt cuối)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
