import { Request, Response } from "express";
import { UserServiceFactory } from "../infrastructure/dependencies";
import { StatusCodes } from "http-status-codes";

export class GetUserById {
  async run(req: Request, res: Response) {
    try {
      const userService = await UserServiceFactory.createUserService(
        req.params.userId
      );

      const user = userService.getUser();

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      if (error instanceof Error)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  }
}
