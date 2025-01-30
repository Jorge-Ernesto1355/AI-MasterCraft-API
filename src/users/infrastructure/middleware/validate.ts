import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super("Validation Error");
    this.name = "RequestValidationError";
  }
}
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user,
        headers: req.headers,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Transformamos los errores de Zod a un formato más amigable
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          type: "ValidationError",
          message: "Invalid request data",
          errors: validationErrors,
        });
      }

      // Si no es un error de validación, lo pasamos al siguiente middleware de error
      return next(error);
    }
  };
};
