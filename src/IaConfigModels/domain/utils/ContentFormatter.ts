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
      this.proccessImageOutput,
      this.processAudioOutput,
      this.processVideoOutput,
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

  private proccessImageOutput(output: AIModelOutput): IContent[] | Error {
    if (
      !(typeof output === "object" && output !== null && "output" in output)
    ) {
      return new NotProcessed("image output not processed");
    }

    if (typeof output.output !== "string") {
      return new NotProcessed("image output not processed");
    }

    const imageUrlRegex =
      /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    // Check if the URL matches image file extensions
    if (imageUrlRegex.test(output.output)) {
      return [
        {
          type: "image",
          data: output.output,
        },
      ];
    }

    return new NotProcessed("image output not processed");
  }
  private processAudioOutput(output: AIModelOutput): IContent[] | Error {
    // Check if output is an object with an 'output' property
    if (
      !(typeof output === "object" && output !== null && "output" in output)
    ) {
      return new NotProcessed("audio output not processed");
    }

    // Ensure output is a string
    if (typeof output.output !== "string") {
      return new NotProcessed("audio output not processed");
    }

    // Regular expression to match common audio file extensions
    const audioUrlRegex =
      /^https?:\/\/.*\.(mp3|wav|ogg|flac|aac|m4a|webm|opus)(\?.*)?$/i;

    // Check if the URL matches audio file extensions
    if (audioUrlRegex.test(output.output)) {
      return [
        {
          type: "audio",
          data: output.output,
        },
      ];
    }

    return new NotProcessed("audio output not processed");
  }

  private processVideoOutput(output: AIModelOutput): IContent[] | Error {
    // Check if output is an object with an 'output' property
    if (
      !(typeof output === "object" && output !== null && "output" in output)
    ) {
      return new NotProcessed("video output not processed");
    }

    // Ensure output is a string
    if (typeof output.output !== "string") {
      return new NotProcessed("video output not processed");
    }

    // Regular expression to match common video file extensions
    const videoUrlRegex =
      /^https?:\/\/.*\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v|mpeg|mpg)(\?.*)?$/i;

    // Check if the URL matches video file extensions
    if (videoUrlRegex.test(output.output)) {
      return [
        {
          type: "video",
          data: output.output,
        },
      ];
    }

    return new NotProcessed("video output not processed");
  }
}

export default ContentFormatter;
