import { CreateProjectAI } from "./CreateProjectAI";
import { GenerateIA } from "./GenerateIA";
import { GetAvailableIA } from "./GetAvailableIA";
import { GetIAById } from "./GetIAById";
import { GetMessages } from "./getMessages";
import { GetProjects } from "./GetProjects";
import { SearchModelByName } from "./searchModelByName";

const getById = new GetIAById();
const createProjectAI = new CreateProjectAI();
const generateIA = new GenerateIA();
const getProjects = new GetProjects();
const getAvailableIA = new GetAvailableIA();
const getMessages = new GetMessages();
const searchModelByName = new SearchModelByName()
export {
  getById,
  createProjectAI,
  generateIA,
  getProjects,
  getAvailableIA,
  getMessages,
  searchModelByName
};
