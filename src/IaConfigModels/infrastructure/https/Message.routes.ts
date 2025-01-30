import { Router } from "express";
import { generateIA, getMessages } from "../../application";
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

export default MessageRouter;
