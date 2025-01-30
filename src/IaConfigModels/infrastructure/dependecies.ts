import { container } from "tsyringe";
import { MessageService } from "../application/services/MessageService";
import { IaServiceFactory } from "../domain/IAService";

//Servicies
export const messageService = container.resolve(MessageService);
export const iaServiceFactory = container.resolve(IaServiceFactory);
