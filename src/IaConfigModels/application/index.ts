import { CreateProjectAI } from "./CreateProjectAI";
import { GenerateIA } from "./GenerateIA";
import { GetAvailableIA } from "./GetAvailableIA";
import { GetIAById } from "./GetIAById";
import { GetProjects } from "./GetProjects";

const getById = new GetIAById();
const createProjectAI = new CreateProjectAI();
const generateIA = new GenerateIA();
const getProjects = new GetProjects();
const getAvailableIA = new GetAvailableIA();
export { getById, createProjectAI, generateIA, getProjects, getAvailableIA };
