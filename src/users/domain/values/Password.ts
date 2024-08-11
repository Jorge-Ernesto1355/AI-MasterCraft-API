import bycript from "bcrypt";

export class Password {
  private static readonly SALT_ROUNDS: number = 10;
  private static readonly MIN_PASSWORD_LENGTH: number = 8;
  private static readonly MAX_PASSWORD_LENGTH: number = 20;

  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  public static async create(password: string): Promise<Password> {
    if (!Password.validatePassword(password))
      throw new Error("Password not valid");
    const hashedPassword = await Password.encryptPassword(password);
    if (!(hashedPassword instanceof Error)) return new Password(hashedPassword);
    throw new Error("Error Creating Password ");
  }

  public getPassword() {
    return this.password;
  }

  public static async encryptPassword(
    password: string
  ): Promise<string | Error> {
    try {
      const passwordHash = bycript.hashSync(password, Password.SALT_ROUNDS);
      return passwordHash;
    } catch (error) {
      throw new Error("Something went wrong with encripting");
    }
  }

  public comparePassword(comparePassword: string): Boolean | Error {
    try {
      const isEqualPassword = bycript.compareSync(
        comparePassword,
        this.password
      );
      return isEqualPassword;
    } catch (error) {
      throw new Error("Something went wrong with verifying");
    }
  }

  public static validatePassword(password: string): boolean {
    if (
      typeof password !== "string" ||
      password.length < Password.MIN_PASSWORD_LENGTH ||
      password.length > Password.MAX_PASSWORD_LENGTH
    )
      return false;
    return true;
  }
}
