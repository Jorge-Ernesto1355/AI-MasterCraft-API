import fs from "fs";
import path from "path";

enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

class Logger {
  private logDir: string;
  private logFile: string;

  constructor(logDir: string = "logs") {
    this.logDir = logDir;
    this.logFile = path.join(logDir, "app.log");
    this.initializeLogDir();
  }

  private initializeLogDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: object
  ): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
    return `${timestamp} [${level}] ${message}${metadataStr}\n`;
  }

  private writeToFile(message: string): void {
    fs.appendFileSync(this.logFile, message);
  }

  private log(level: LogLevel, message: string, metadata?: object): void {
    const formattedMessage = this.formatMessage(level, message, metadata);
    this.writeToFile(formattedMessage);
  }

  error(message: string, metadata?: object): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  warn(message: string, metadata?: object): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message: string, metadata?: object): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message: string, metadata?: object): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }
}

export default Logger;
