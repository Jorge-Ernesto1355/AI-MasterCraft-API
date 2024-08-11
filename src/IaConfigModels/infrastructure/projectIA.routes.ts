import { Router } from "express";
import { createProjectAI, generateIA, getById } from "../application";

const IARouter = Router();

IARouter.get("/:projectIAId", getById.run.bind(getById));

IARouter.post("/:userId", createProjectAI.run.bind(createProjectAI));

IARouter.post("/generateIA/:projectId", generateIA.run.bind(generateIA));

export default IARouter;
