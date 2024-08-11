import { createCustomError } from "../../utilities/ErrorFactory";

export const NotFoundUserMsg = "Not Found User";
export const NotFoundUser = createCustomError(NotFoundUserMsg);
