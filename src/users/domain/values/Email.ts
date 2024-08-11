import { createCustomError } from "../../../utilities/ErrorFactory";

export const NotValidEmail = createCustomError("Not Valid Email");

export class Email {
  private readonly email: string;

  constructor(email: string) {
    if (!Email.isValid(email)) throw NotValidEmail;
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValid(): boolean {
    return Email.isValid(this.email);
  }
}
