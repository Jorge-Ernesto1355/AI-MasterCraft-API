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
  async processOutput(rawOutput: AsyncIterable<any>): Promise<AIModelOutput> {
    let fullOutput = "";
    const chunks: string[] = [];

    for await (const chunk of rawOutput) {
      const processedChunk = chunk.data.toString();
      fullOutput += processedChunk;
      chunks.push(processedChunk);
    }

    return {
      output: fullOutput,
      stream: (async function* () {
        for (const chunk of chunks) {
          yield chunk;
        }
      })(),
    };
  }
}
