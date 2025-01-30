import "reflect-metadata";
import { Router } from "express";
import { getUserbyId, login, refreshToken, register } from "../../application";
import { establishSSEConnection } from "./EstablishConnection";
import { accessTokenValidation } from "../auth/middlewares/accessTokenValidation";

const userRouter = Router();

userRouter.get("/:userId", getUserbyId.run.bind(getUserbyId));

userRouter.post("/register", register.run.bind(register));

userRouter.post("/login", login.run.bind(login));

userRouter.post("/refreshToken/:userId", refreshToken.run.bind(refreshToken));

userRouter.get(
  "/comunication/sse",
  accessTokenValidation,
  establishSSEConnection
);

export { userRouter };
