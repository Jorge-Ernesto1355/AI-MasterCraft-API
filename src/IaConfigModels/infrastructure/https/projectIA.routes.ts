import { Router } from "express";
import {
  createProjectAI,
  editConfigProject,
  getAvailableIA,
  getById,
  getProjects,
  searchModelByName,
} from "../../application";
import { accessTokenValidation } from "../../../users/infrastructure/auth/middlewares/accessTokenValidation";

const IARouter = Router();

IARouter.get("/:projectIAId", accessTokenValidation, getById.run.bind(getById));

IARouter.get(
  "/projects/:userId",
  accessTokenValidation,
  getProjects.run.bind(getProjects)
);

IARouter.get("/models/available", getAvailableIA.run.bind(getAvailableIA));

IARouter.post(
  "/:userId",
  accessTokenValidation,
  createProjectAI.run.bind(createProjectAI)
);

IARouter.get("/search/:userId", searchModelByName.run.bind(searchModelByName));

IARouter.put(
  "/edit/config/:projectIAId",
  editConfigProject.run.bind(editConfigProject)
);

export default IARouter;
