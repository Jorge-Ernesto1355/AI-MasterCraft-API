import { Request, Response } from "express";
import { authService } from "../../infrastructure/auth/dependencies";
import { StatusCodes } from "http-status-codes";

export class Login {
  async run(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw new Error("Arguments must be defined");

      const user = await authService.login({ email, password });

      if (user instanceof Error) throw new Error(user.message);

      return res.status(StatusCodes.ACCEPTED).json(user);
    } catch (error) {
      if (error instanceof Error)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: error.message });

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  }
}
