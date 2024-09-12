import { CreateProjectAI } from "./CreateProjectAI";
import { GenerateIA } from "./GenerateIA";
import { GetAvailableIA } from "./GetAvailableIA";
import { GetIAById } from "./GetIAById";
import { GetMessages } from "./getMessages";
import { GetProjects } from "./GetProjects";

const getById = new GetIAById();
const createProjectAI = new CreateProjectAI();
const generateIA = new GenerateIA();
const getProjects = new GetProjects();
const getAvailableIA = new GetAvailableIA();
const getMessages = new GetMessages();
export {
  getById,
  createProjectAI,
  generateIA,
  getProjects,
  getAvailableIA,
  getMessages,
};
