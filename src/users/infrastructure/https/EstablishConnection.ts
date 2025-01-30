// src/controllers/sseController.ts
import "reflect-metadata";
import { Request, Response, NextFunction, response } from "express";
import { container } from "tsyringe";
import { rateLimit } from "express-rate-limit";

import Logger from "../../../utilities/logger";
import { SSEService } from "../../application/services/SSEService";

// Rate limiter middleware
const sseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many connections, please try again later" },
});

// Error handler middleware
const handleSSEError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = container.resolve<Logger>("Logger");
  logger.error("SSE Connection Error", { error: err, userId: req.user?.id });

  // If headers haven't been sent yet, send error response
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  next(err);
};

const handleConnection = async (req: Request, res: Response) => {
  const sseService = container.resolve(SSEService);
  const logger = container.resolve<Logger>("Logger");

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    const client = await sseService.handleConnection(req.user!.id, res);
    if (!client) return res.end();
    logger.info("SSE Connection established", {
      clientId: client.id,
      userId: req.user!.id,
    });

    // Setup ping interval (keep-alive)
    const pingInterval = setInterval(() => {
      if (!res.writableEnded) {
        res.write(`: ping\n\n`);
      }
    }, 30000); // 30 seconds

    // Handle client disconnect
    req.on("close", async () => {
      clearInterval(pingInterval);
      await sseService.handleDisconnection(client.id);
      logger.info("SSE Connection closed", {
        clientId: client.id,
        userId: req.user!.id,
      });
    });
  } catch (error) {
    logger.error("Error establishing SSE connection", {
      error,
      userId: req.user?.id,
    });

    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to establish connection" });
    }
  }
};

// Export the middleware stack
export const establishSSEConnection = [
  sseLimiter,
  handleConnection,
  handleSSEError,
];
