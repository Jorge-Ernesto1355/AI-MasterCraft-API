type customErrorConstructor = new (message?: string) => Error;

export function createCustomError(name: string): customErrorConstructor {
  return class CustomError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = name;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }

      Object.setPrototypeOf(this, new.target.prototype);
    }
  };
}
