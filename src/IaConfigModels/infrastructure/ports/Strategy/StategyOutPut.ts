import { AIModelOutput } from "../../../domain/entities/abstractAIModel";

export interface OutputStrategy {
  processOutput(rawOutput: any): Promise<AIModelOutput>;
}

export class DefaultOutputStrategy implements OutputStrategy {
  async processOutput(rawOutput: any): Promise<AIModelOutput> {
    return { output: rawOutput.toString() };
  }
}

export class StreamingOutputStrategy implements OutputStrategy {
  async processOutput(output: any): Promise<AIModelOutput> {
    if (typeof output === "string") {
      return { output: output.replace(/\{\}/g, "").trim() };
    }

    // Handle streaming output
    let processedOutput = "";
    try {
      for await (const chunk of output) {
        if (chunk.data) {
          const text =
            typeof chunk.data === "string"
              ? chunk.data
              : JSON.stringify(chunk.data);
          processedOutput += text.replace(/\{\}/g, "").trim();
        }
      }
    } catch (error) {
      throw error;
    }

    return { output: processedOutput };
  }
}
