import { CreateProjectAI } from "./CreateProjectAI";
import EditConfigProject from "./EditConfigProject";
import { GenerateIA } from "./GenerateIA";
import { GetAvailableIA } from "./GetAvailableIA";
import { GetIAById } from "./GetIAById";
import { GetMessages } from "./GetMessages";
import { GetProjects } from "./GetProjects";
import improvePrompt from "./improvePrompt";
import { SearchModelByName } from "./searchModelByName";

const getById = new GetIAById();
const createProjectAI = new CreateProjectAI();
const generateIA = new GenerateIA();
const getProjects = new GetProjects();
const getAvailableIA = new GetAvailableIA();
const getMessages = new GetMessages();
const searchModelByName = new SearchModelByName();
const editConfigProject = new EditConfigProject();
const ImprovePrompt = new improvePrompt();

export {
  getById,
  createProjectAI,
  generateIA,
  getProjects,
  getAvailableIA,
  getMessages,
  searchModelByName,
  editConfigProject,
  ImprovePrompt,
};
