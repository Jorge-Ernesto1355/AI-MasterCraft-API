import { CreateProjectAI } from "./CreateProjectAI";
import { GenerateIA } from "./GenerateIA";
import { GetIAById } from "./GetIAById";

const getById = new GetIAById();
const createProjectAI = new CreateProjectAI();
const generateIA = new GenerateIA();

export { getById, createProjectAI, generateIA };
