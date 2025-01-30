import { Request, Response } from "express";
import { iaServiceFactory } from "../infrastructure/dependecies";
import { typeConfig } from "../infrastructure/persistence/AIResponseConfiguration";

export default class EditConfigProject {
  public async run(req: Request, res: Response) {
    const { projectIAId } = req.params;
    const { typeConfig } = req.query;

    try {
      const validatedTypeConfig = this.validateTypeconfig(typeConfig);

      const IAService = await iaServiceFactory.create();
      if (IAService instanceof Error) throw new Error(IAService.message);
      await IAService.editConfigProject(projectIAId, validatedTypeConfig);

      return res.status(200).json({ message: "Project configuration updated" });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private validateTypeconfig(typeConfig: any): typeConfig {
    if (!typeConfig) throw new Error("TypeConfig must be defined");
    if (typeof typeConfig !== "string")
      throw new Error("TypeConfig must be a string");

    const typeConfigLowerCase = typeConfig.toLowerCase();
    const validTypes = ["normal", "concise", "explanatory", "formal"];
    if (!validTypes.includes(typeConfigLowerCase))
      throw new Error("Invalid typeConfig");
    return typeConfigLowerCase as typeConfig;
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
