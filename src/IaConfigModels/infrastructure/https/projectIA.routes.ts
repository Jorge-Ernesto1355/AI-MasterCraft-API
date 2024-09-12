import { Router } from "express";
import {
  createProjectAI,
  getAvailableIA,
  getById,
  getProjects,
} from "../../application";

const IARouter = Router();

IARouter.get("/:projectIAId", getById.run.bind(getById));

IARouter.get("/projects/:userId", getProjects.run.bind(getProjects));

IARouter.get(
  "/available-models/:userId",
  getAvailableIA.run.bind(getAvailableIA)
);

IARouter.post("/:userId", createProjectAI.run.bind(createProjectAI));

export default IARouter;
