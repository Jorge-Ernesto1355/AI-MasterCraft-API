import { Router } from "express";
import {
  createProjectAI,
  getAvailableIA,
  getById,
  getProjects,
  searchModelByName,
} from "../../application";

const IARouter = Router();

IARouter.get("/:projectIAId", getById.run.bind(getById));

IARouter.get("/projects/:userId", getProjects.run.bind(getProjects));

IARouter.get(
  "/models/available",
  getAvailableIA.run.bind(getAvailableIA)
);

IARouter.post("/:userId", createProjectAI.run.bind(createProjectAI));

IARouter.get('/search/:userId', searchModelByName
  .run.bind(searchModelByName))


export default IARouter;
