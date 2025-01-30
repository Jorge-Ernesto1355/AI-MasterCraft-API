import "reflect-metadata";
import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { SSEService } from "../../application/services/SSEService";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { validate } from "../middleware/validate";

@injectable()
export class SSEController {
  private static readonly rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs,
    message: "Too many requests from this IP, please try again after an hour",
  });

  constructor(@inject(SSEService) private readonly sseService: SSEService) {}

  async connect(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).send("Unauthorized");
        return;
      }

      const client = await this.sseService.handleConnection(userId);
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      req.on("close", () => {
        this.sseService.handleDisconnection(client.id);
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  static readonly middleware = [
    SSEController.rateLimiter,
    validate(
      z.object({
        user: z.object({
          id: z.string(),
        }),
      })
    ),
  ];
}
