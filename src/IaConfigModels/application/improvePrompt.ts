import { Request, Response } from "express";
import { messageService } from "../infrastructure/dependecies";

export default class improvePrompt {
  public async run(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      const { userId } = req.params;

      const validatedPrompt = this.validatePrompt(prompt);

      await messageService.improvePrompt(validatedPrompt, userId);
    } catch (error) {
      this.handleError(error, res);
    }
  }
  private validatePrompt(prompt: string): string {
    if (!prompt) throw new Error("Prompt must be defined");
    if (typeof prompt !== "string") throw new Error("Prompt must be a string");
    return prompt;
  }
  private handleError(error: unknown, res: Response): Response {
    if (error instanceof Error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
}
