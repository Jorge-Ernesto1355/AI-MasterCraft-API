// import { Response } from "express";

interface ChunkCallback {
  (chunk: string): void;
}

export class PromptImprover {
  private apiKey: string | undefined;
  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private createPromptTemplate(originalPrompt: string): string {
    return `Enhance the following prompt to be more specific and actionable:

Original: """
${originalPrompt}
"""

Return only an improved version in this exact format:
improved_prompt: "{your improved version}"

Requirements:
- Add clear context and constraints
- Specify expected outputs and formats
- Include edge cases to consider
- Remove ambiguity
- Keep it concise

DO NOT include explanations, notes, or any text besides the improved prompt in the required format.`;
  }

  private extractContentFromChunk(chunkData: string): string {
    try {
      // Parse the JSON data
      const data = JSON.parse(chunkData);

      // Extract the content from the delta object in the first choice
      const content = data.choices[0]?.delta?.content || "";

      return content;
    } catch (error) {
      console.error("Error parsing chunk data:", error);
      return "";
    }
  }

  private extractImprovedPrompt(content: string): string | Error {
    const match = content.match(/improved_prompt:\s*"([^"]+)"/);
    return match ? match[1] : new Error("Improved prompt not found");
  }

  async improvePrompt(prompt: string): Promise<string | Error> {
    try {
      const response = await fetch(
        "https://huggingface.co/api/inference-proxy/together/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-ai/DeepSeek-R1",
            messages: [
              {
                role: "user",
                content: "test",
              },
            ],
            stream: true,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error("No body in response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = this.extractContentFromChunk(chunk);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";

      return this.extractImprovedPrompt(content);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error("Error in improvePrompt: " + error.message);
      }
      throw error;
    }
  }

  private async crateReadableStream(
    apiResponse: Response
  ): Promise<ReadableStream> {
    if (!apiResponse.body) throw new Error("no body in response");

    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();
    const self = this;

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const parsedChunk = self.extractContentFromChunk(chunk);
            if (!parsedChunk) continue;
            const event = new TextEncoder().encode(
              `data: ${JSON.stringify(parsedChunk)}\n\n`
            );
            controller.enqueue(event);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
      cancel() {
        reader.cancel();
      },
    });
  }
}
