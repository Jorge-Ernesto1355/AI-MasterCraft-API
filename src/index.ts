import "reflect-metadata";
import { server } from "./config";
import dotenv from "dotenv";

dotenv.config();

const serverMain: server = new server(3080);

serverMain.run();
