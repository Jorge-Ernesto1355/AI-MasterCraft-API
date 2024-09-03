import { Email } from "../values/Email";
import { Password } from "../values/Password";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  password?: string; // Inclúyelo solo si es relevante para tu caso
}

export class User {
  private readonly _id: string;
  private readonly username: string;
  private readonly email: Email;
  private password?: Password;

  constructor(
    _id: string,
    username: string,
    email: Email,
    password?: Password
  ) {
    this._id = _id;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  public static async create(
    _id: string,
    username: string,
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    const emailObj = new Email(email);
    const passwordObj = await Password.create(plainTextPassword);
    return new User(_id, username, emailObj, passwordObj);
  }

  public getId() {
    return this._id;
  }

  public getUsername() {
    return this.username;
  }

  public getPassword() {
    return this.password?.getPassword();
  }
  public getEmail() {
    return this.email.getEmail();
  }

  public static isValidEmail(email: string): boolean {
    return Email.isValid(email);
  }

  public static isValidPassword(password: string) {
    return Password.validatePassword(password);
  }

  public comparePassword(password: string) {
    return this.password?.comparePassword(password);
  }

  public async updatePassword(newPlainTextPassword: string): Promise<void> {
    this.password = await Password.create(newPlainTextPassword);
  }

  public toJSON(): UserDTO {
    return {
      id: this._id,
      username: this.username,
      email: this.getEmail(),
    };
  }
}
