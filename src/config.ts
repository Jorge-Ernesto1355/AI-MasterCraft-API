import express, { Application } from "express";
import cors from "cors";
import { corsOptions } from "./utilities/corsOptions";
import dotenv from "dotenv";
import { mongoDB } from "./db/mongoDb";
import { userRouter } from "./users/infrastructure/userRoute.routes";
import IARouter from "./IaConfigModels/infrastructure/projectIA.routes";

dotenv.config();

export class server {
  private port: number;
  private app: Application;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.middleware();
    this.runDB();
    this.routers();
  }

  private middleware(): void {
    this.app.use(express.json({ limit: "5mb" }));
    this.app.use(express.urlencoded({ limit: "5mb", extended: true }));
    this.app.use(cors(corsOptions));
  }

  private routers() {
    this.app.use("/users", userRouter);
    this.app.use("/projectIa", IARouter);
  }

  private async runDB() {
    const db = new mongoDB();
    try {
      await db.connect();
    } catch (error) {
      console.error(error);
      db.disconnect();
    }
  }

  public run(): void {
    this.app
      .listen(this.port, () =>
        console.log(`initializating on port: ${this.port} `)
      )
      .on("error", (e) => console.error("Something went wrong", e));
  }
}
