import { Router } from "express";
import {
  createProjectAI,
  generateIA,
  getAvailableIA,
  getById,
  getProjects,
  searchModelByName,
} from "../application";

const IARouter = Router();

IARouter.get("/:projectIAId", getById.run.bind(getById));

IARouter.get("/projects/:userId", getProjects.run.bind(getProjects));

IARouter.get(
  "/available-models",
  getAvailableIA.run.bind(getAvailableIA)
);

IARouter.post("/:userId", createProjectAI.run.bind(createProjectAI));

IARouter.post("/generateIA/:projectId", generateIA.run.bind(generateIA));

IARouter.get('/search/:userId', searchModelByName.run.bind(searchModelByName))

export default IARouter;
