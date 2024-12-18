import { createCustomError } from "../../../utilities/ErrorFactory";
import { AIModelOutput } from "../entities/abstractAIModel";
import { IContent } from "../interfaces/Message.interface";
import { contentFormatterCode } from "./ContentFormatteCode";
export const NotProcessed = createCustomError("NotProcessed");

type OutputProcessor = (output: AIModelOutput) => IContent[] | Error;

class ContentFormatter {
  private processors: OutputProcessor[];
  private contentFormatterCode: contentFormatterCode;

  constructor() {
    this.contentFormatterCode = new contentFormatterCode();

    this.processors = [
      this.processArray,
      this.contentFormatterCode.proccesor.bind(this.contentFormatterCode),
      this.processStringOutput,
      this.processDefault,
    ];
  }

  public format(output: AIModelOutput): IContent[] {
    for (const processor of this.processors) {
      const result = processor(output);
      if (!(result instanceof NotProcessed)) {
        return result instanceof Error ? this.processDefault(output) : result;
      }
    }
    return this.processDefault(output);
  }

  private processArray(output: unknown): IContent[] | Error {
    if (Array.isArray(output) && this.isValidContentArray(output))
      return output;
    return new NotProcessed("array not processed");
  }

  private processStringOutput(output: AIModelOutput): IContent[] | Error {
    if (typeof output === "object" && output !== null && "output" in output) {
      if (typeof output.output === "string" && !output.output.includes("```")) {
        return [{ type: "text", data: output.output }];
      }
    }
    return new NotProcessed("string output not processed");
  }

  private processDefault(output: unknown): IContent[] {
    return [{ type: "text", data: JSON.stringify(output) }];
  }

  private isValidContentArray(arr: unknown[]): arr is IContent[] {
    return arr.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        "data" in item
    );
  }
}

export default ContentFormatter;
