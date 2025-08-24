import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import { sendContactEmail } from "./utils/mailer.js";
import measurementsRoutes from "./routes/measurementRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import pkg from "pg";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import http from "http";
import { Server } from "socket.io";
import PromoCodeRoutes from "./routes/PromoCodeRoutes.js"

const { Pool } = pkg;
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// Track connected users
const connectedUsers = {};
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Register userId for real-time notifications
  socket.on("register-user", (userId) => {
    connectedUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const [userId, sId] of Object.entries(connectedUsers)) {
      if (sId === socket.id) delete connectedUsers[userId];
    }
  });
});

// Make Socket.IO accessible in routes
app.set("io", io);
app.set("connectedUsers", connectedUsers);

// Swagger Configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Tailoring API",
      version: "1.0.0",
      description: "API documentation for Smart Tailoring project",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(bodyParser.json());

// Postgres pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// Contact form
app.post("/send-contact", async (req, res) => {
  try {
    await sendContactEmail(req.body);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email failed to send", error });
  }
});

// Update user info
app.put("/api/user/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;

  try {
    const result = await pool.query(
      'UPDATE smart_schema.users SET name=$1, email=$2, phone=$3, address=$4, "updatedAt"=NOW() WHERE id=$5 RETURNING *',
      [name, email, phone, address, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Routes
app.use("/api", authRoutes);
app.use("/api/me", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/measurements", measurementsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/promo",PromoCodeRoutes);

// Sync Sequelize models and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Tables synced successfully");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync tables:", err);
  });
