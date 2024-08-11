import { authRepository as AuthRepository } from "../../domain/repositories/authRepository";
import { userRepository as UserRepository } from "../../domain/repositories/userRepository";
import { AuthService } from "../../domain/services/AuthService";
import { mongoRepository as MongoRepository } from "../persistence/mongoRepository";
import { JWTService } from "./JwtService";

const jwtService = new JWTService();
const mongoRepository = new MongoRepository();
const userRepository = new UserRepository(mongoRepository);
const authRepository = new AuthRepository(jwtService, userRepository);
export const authService = new AuthService(userRepository, authRepository);
