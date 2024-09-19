import express, { Application } from "express";
import { IncomingMessage, ServerResponse } from "http";
import cors from "cors";
import { corsOptions } from "./utilities/corsOptions";
import dotenv from "dotenv";
import { mongoDB } from "./db/mongoDb";
import { userRouter } from "./users/infrastructure/userRoute.routes";
import IARouter from "./IaConfigModels/infrastructure/https/projectIA.routes";
import MessageRouter from "./IaConfigModels/infrastructure/https/Message.routes";
import bodyParser from "body-parser";

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
    this.app.use(
      bodyParser.json({
        strict: true,
        verify: (
          req: IncomingMessage,
          res: ServerResponse,
          buf: Buffer,
          encoding: string
        ) => {
          try {
            JSON.parse(buf.toString(encoding as BufferEncoding)); // Verificar si el JSON es válido
          } catch (e) {
            res.statusCode = 400;
            res.end("Invalid JSON"); // Responder con 400 si el JSON es inválido
            throw new Error("Invalid JSON"); // Lanzar un error si el JSON es inválido
          }
        },
      })
    );
  }

  private routers() {
    this.app.use("/v1/users", userRouter);
    this.app.use("/v1/projectIa", IARouter);
    this.app.use("/v1/message", MessageRouter);
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
