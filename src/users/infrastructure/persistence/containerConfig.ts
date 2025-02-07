import "reflect-metadata";
import { container } from "tsyringe";
import { defaultRedisConfig, RedisClient } from "./Redis";
import { RedisClientRepository } from "../ports/RedisClientRepository";
import Logger from "../../../utilities/logger";
import { SSEEventEmitter } from "../ports/SSEEventEmitter";
import { SSEService } from "../../application/services/SSEService";
import { messageRepository } from "../../../IaConfigModels/domain/repositories/messageRepository";
import { IARepository } from "../../../IaConfigModels/domain/repositories/IARepositories";
import { messageMongoRepository } from "../../../IaConfigModels/infrastructure/persistence/messageMongoRepository";
import { mongoRepository } from "./mongoRepository";
import { IAMongoRepository } from "../../../IaConfigModels/infrastructure/persistence/IAMongoRepository";
import { userRepository } from "../../domain/repositories/userRepository";

import {
  DefaultOutputStrategy,
  OutputStrategy,
} from "../../../IaConfigModels/infrastructure/ports/Strategy/StategyOutPut";
import { ReplicateAdapter } from "../../../IaConfigModels/infrastructure/ports/ReplicateAdapter";
import { IEventEmitter } from "../../domain/services/IEventEmitter";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { PromptImprover } from "../../../IaConfigModels/application/services/PromptImprover";
import dotenv from "dotenv";
dotenv.config();
const config = {
  apiKey: process.env.HUGGINGFACE_API_KEY,
  apiUrl:
    "https://huggingface.co/api/inference-proxy/together/v1/chat/completions",
};

container.register("improvePromptConfig", { useValue: config });
container.register("RedisConfig", { useValue: defaultRedisConfig });

container.register("Logger", { useClass: Logger });

container.register("RedisClient", {
  useFactory: (c) =>
    new RedisClient(c.resolve("RedisConfig"), c.resolve("Logger")),
});

container.register<IEventEmitter>("IEventEmitter", {
  useClass: SSEEventEmitter,
});

container.register<IClientRepository>("IClientRepository", {
  useClass: RedisClientRepository,
});

container.register<SSEService>("SSEService", {
  useClass: SSEService,
});

container.register<PromptImprover>("PromptImprover", {
  useClass: PromptImprover,
});

container.register<messageRepository>("messageRepository", {
  useClass: messageRepository,
});

container.register<IARepository>("IARepository", {
  useClass: IARepository,
});

container.register<messageMongoRepository>("messageRepositorydb", {
  useClass: messageMongoRepository,
});

container.register<mongoRepository>("UserMongoRepository", {
  useClass: mongoRepository,
});

container.register<IAMongoRepository>("IAMongoRepository", {
  useClass: IAMongoRepository,
});

container.register<userRepository>("UserRepository", {
  useClass: userRepository,
});

container.register<IARepository>("IARepository", {
  useClass: IARepository,
});

container.register<OutputStrategy>("OutputStrategy", {
  useClass: DefaultOutputStrategy,
});

container.register("ReplicateAdapterFactory", {
  useFactory: (dependencyContainer) => {
    return (organization: string, modelName: string) =>
      new ReplicateAdapter(
        dependencyContainer.resolve("OutputStrategy"),
        dependencyContainer.resolve("SSEService"),
        organization,
        modelName
      );
  },
});
