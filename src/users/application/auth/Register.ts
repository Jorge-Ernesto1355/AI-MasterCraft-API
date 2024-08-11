import { StatusCodes } from "http-status-codes";
import { authService } from "../../infrastructure/auth/dependencies";
import { Request, Response } from "express";

export class Register {
  async run(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password)
        throw new Error("arguments must be defined");

      const user = await authService.register({ email, username, password });

      if (user instanceof Error) throw new Error(user.message);

      return res.status(StatusCodes.CREATED).json(user);
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
