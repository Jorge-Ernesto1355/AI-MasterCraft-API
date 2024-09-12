import { Router } from "express";
import { generateIA, getMessages } from "../../application";

const MessageRouter = Router();

MessageRouter.post("/generateIA/:projectId", generateIA.run.bind(generateIA));

MessageRouter.get("/:projectId", getMessages.run.bind(getMessages));

export default MessageRouter;
