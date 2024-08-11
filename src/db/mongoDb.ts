import mongoose from "mongoose";

interface MongoDBConfig {
  PORT_DB?: string;
  DB_NAME?: string;
}

type MongoDBError = Error & { code?: string };

export class mongoDB {
  private readonly PORT_DB: string | undefined;
  private readonly DB_NAME: string | undefined;

  constructor(config: MongoDBConfig = {}) {
    this.PORT_DB = config.PORT_DB || process.env.PORT_DB || "27017";
    this.DB_NAME = config.DB_NAME || process.env.DB_NAME || "test";

    this.validateConfig();
  }

  async connect(): Promise<void> {
    try {
      mongoose.connect(this.getUriDB());
      console.log(`connected to mongo on ${this.DB_NAME}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const mongoError = error as MongoDBError;
        throw new Error(
          `Failed to connect to MongoDB:${mongoError.name}. ${mongoError.message} `
        );
      }
      throw new Error("An unknown error occurred while connecting to MongoDB");
    }
  }

  private getUriDB() {
    return `mongodb${this.PORT_DB}${this.DB_NAME}`;
  }

  private validateConfig() {
    if (!this.PORT_DB) throw new Error("DB_TYPE is not defined");

    if (!this.DB_NAME) throw new Error("DB_NAME is not defined");
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to disconnect from MongoDB: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while disconnecting from MongoDB"
        );
      }
    }
  }
}
