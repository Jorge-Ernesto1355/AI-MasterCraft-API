import { Router } from "express";
import { generateIA, getMessages, ImprovePrompt } from "../../application";
import { accessTokenValidation } from "../../../users/infrastructure/auth/middlewares/accessTokenValidation";

const MessageRouter = Router();

MessageRouter.post(
  "/generateIA/:projectId",
  accessTokenValidation,
  generateIA.run.bind(generateIA)
);

MessageRouter.get(
  "/:projectId",
  accessTokenValidation,
  getMessages.run.bind(getMessages)
);

MessageRouter.post("/improvePrompt", ImprovePrompt.run.bind(ImprovePrompt));

export default MessageRouter;
