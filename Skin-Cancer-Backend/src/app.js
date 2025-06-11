import express from "express";
import { config } from "dotenv";
import dbconnect from "./config/dbConnection.js";
import userRoutes from "./routes/userRoute.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import helmet from "helmet";
import cors from 'cors'
config();

const PORT = process.env.PORT;
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true, 
}));

app.use(express.json());
app.use("/login", apiLimiter);
app.use("/",userRoutes);
app.use(helmet());

dbconnect();

export default app;
