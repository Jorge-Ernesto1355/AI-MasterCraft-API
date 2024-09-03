import { createCustomError } from "../../../utilities/ErrorFactory";

const NotProcessed = createCustomError("NotProcessed");

interface IContent {
  type: "text" | "image" | "audio" | "video" | "file";
  data: string;
  mimeType?: string;
}

type OutputProcessor = (output: unknown) => IContent[] | Error;

class ContentFormatter {
  private processors: OutputProcessor[];

  constructor() {
    this.processors = [
      this.processArray,
      this.processStringOutput,
      this.processDefault,
    ];
  }

  public format(output: unknown): IContent[] {
    for (const processor of this.processors) {
      const result = processor(output);
      if (!(result instanceof NotProcessed)) return result;
    }
    return this.processDefault(output);
  }

  private processArray(output: unknown): IContent[] | Error {
    if (Array.isArray(output) && this.isValidContentArray(output))
      return output;
    return new NotProcessed("array not processed");
  }

  private processStringOutput(output: unknown): IContent[] | Error {
    if (typeof output === "object" && output !== null && "output" in output) {
      const { output: stringOutput } = output as { output: unknown };
      if (typeof stringOutput === "string") {
        return [{ type: "text", data: stringOutput }];
      }
    }
    return new NotProcessed("string output not processed");
  }

  private processDefault(output: unknown): IContent[] {
    return [{ type: "text", data: JSON.stringify(output) }];
  }

  private isValidContentArray(arr: unknown[]): arr is IContent[] {
    return arr.every((item) => typeof item === "string");
  }
}

export default ContentFormatter;
