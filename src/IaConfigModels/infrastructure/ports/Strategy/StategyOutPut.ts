import { AIModelOutput } from "../../../domain/entities/abstractAIModel";
import { MessageDTO } from "../../../domain/entities/Message";
import { IContent } from "../../persistence/Message";

export interface OutputStrategy {
  processOutput(rawOutput: any): Promise<AIModelOutput>;
}

export class DefaultOutputStrategy implements OutputStrategy {
  async processOutput(rawOutput: any): Promise<AIModelOutput> {
    return { output: rawOutput.toString() };
  }
}

interface StreamChunk {
  data: string | Record<string, unknown>;
}

export class streamingOutputStrategy implements OutputStrategy {
  private listeners: Set<(text: string) => void> = new Set();
  private textBuffer: string = "";

  /**
   * Adds a listener for streaming text updates
   * @param listener Callback function that receives text chunks
   */

  addListener(listener: (text: string) => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: (text: string) => void): void {
    this.listeners.delete(listener);
  }

  clearListeners(): void {
    this.listeners.clear();
  }

  private notifyListeners(text: string): void {
    if (!text.trim()) return;
    this.listeners.forEach((listener) => listener(text));
  }

  private processTextChunk(text: string): {
    sentences: string[];
    remaining: string;
  } {
    const sentencePattern = /[^.!?]+[.!?]+/g;
    const sentences = text.match(sentencePattern) || [];
    const remaining = text.replace(sentencePattern, "").trim();

    return { sentences, remaining };
  }

  private formatChunkData(data: StreamChunk["data"]): string {
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  }

  parseSSEChunk(chunk: Uint8Array): IContent | null {
    const text = new TextDecoder().decode(chunk);
    const dataMatch = text.match(/data: (.*)\n\n/);
    if (!dataMatch) return null;

    try {
      const jsonData = JSON.parse(dataMatch[1]);

      if (jsonData.data) {
        const content: IContent = {
          type: "text", // or determine based on content
          data:
            typeof jsonData.data === "string"
              ? jsonData.data
              : JSON.stringify(jsonData.data),
        };
        return content;
      }

      return null;
    } catch (error) {
      console.error("Error parsing SSE chunk:", error);
      return null;
    }
  }

  async processOutput(
    output: AsyncGenerator<StreamChunk>
  ): Promise<AIModelOutput> {
    let fullOutput = "";

    try {
      for await (const chunk of output) {
        if (!chunk.data) continue;

        const cleanText = this.formatChunkData(chunk.data)
          .replace(/\{\}/g, "")
          .trim();

        this.textBuffer += cleanText;

        const { sentences, remaining } = this.processTextChunk(this.textBuffer);

        sentences.forEach((sentence) => {
          fullOutput += sentence;
          this.notifyListeners(sentence);
        });

        this.textBuffer = remaining;
      }

      // Handle any remaining text in buffer
      if (this.textBuffer) {
        fullOutput += this.textBuffer;
        this.notifyListeners(this.textBuffer);
        this.textBuffer = "";
      }

      return { output: fullOutput };
    } catch (error) {
      console.error("Error processing stream:", error);
      throw new Error("Stream processing failed");
    }
  }

  createSSEStream(input: AsyncGenerator<StreamChunk>): ReadableStream {
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of input) {
            if (!chunk.data) continue;

            const event = new TextEncoder().encode(
              `data: ${JSON.stringify(chunk)}\n\n`
            );
            controller.enqueue(event);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}
