import { Router } from "express";
import {
  createProjectAI,
  generateIA,
  getAvailableIA,
  getById,
  getProjects,
} from "../application";

const IARouter = Router();

IARouter.get("/:projectIAId", getById.run.bind(getById));

IARouter.get("/projects/:userId", getProjects.run.bind(getProjects));

IARouter.get(
  "/available-models/:userId",
  getAvailableIA.run.bind(getAvailableIA)
);

IARouter.post("/:userId", createProjectAI.run.bind(createProjectAI));

IARouter.post("/generateIA/:projectId", generateIA.run.bind(generateIA));

export default IARouter;
