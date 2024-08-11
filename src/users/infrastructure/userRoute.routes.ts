import { Router } from "express";
import { getUserbyId, login, register } from "../application";

const userRouter = Router();

userRouter.get("/:userId", getUserbyId.run.bind(getUserbyId));

userRouter.post("/register", register.run.bind(register));

userRouter.post("/login", login.run.bind(login));

export { userRouter };
