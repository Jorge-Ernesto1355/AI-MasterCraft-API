import { userService } from "../services/userService";
import { userRepository } from "./userRepository.interface";

export interface UserService {
  getUser(): Object;
}
