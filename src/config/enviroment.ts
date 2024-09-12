import dotenv from "dotenv";

dotenv.config();

export const environment = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/yourdatabase",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
};
