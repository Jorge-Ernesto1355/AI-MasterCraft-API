// import { Response } from "express";

import { inject, injectable } from "tsyringe";
import { SSEService } from "../../../users/application/services/SSEService";
import Replicate from "replicate";

@injectable()
export class PromptImprover {
  private promptTemplate: string;

  constructor(
    @inject("improvePromptConfig")
    private config: { apiKey: string; apiUrl: string },
    @inject("SSEService") private sseService: SSEService
  ) {
    this.promptTemplate = `<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a prompt improvement specialist. Your role is to:
1. Analyze the given prompt
2. Enhance its clarity and specificity
3. Add necessary constraints
4. Consider edge cases
5. Improve the overall structure
6. Maintain the original intent

For each prompt, provide improvements in these categories:
- Enhanced Prompt: A clearer, more detailed version
- Added Constraints: Specific limitations and requirements
- Edge Cases: Important scenarios to consider
- Style Recommendations: Formatting and presentation guidance
<|eot_id|>

<|start_header_id|>user<|end_header_id|>
{prompt}
<|eot_id|>

<|start_header_id|>assistant<|end_header_id|>
### Enhanced Prompt:
{improved_prompt}

### Added Constraints:
- {constraint_1}
- {constraint_2}
- {constraint_3}

### Edge Cases to Consider:
- {edge_case_1}
- {edge_case_2}
- {edge_case_3}

### Style Recommendations:
- {style_rec_1}
- {style_rec_2}
- {style_rec_3}
<|eot_id|>`;
  }

  private createPromptTemplate(originalPrompt: string): string {
    return `Enhance the following prompt to be more specific and actionable:
  Original prompt: ${originalPrompt}
  
  Please provide an improved version that is clear, specific, and actionable.
  
  {prompt}`;
  }

  private extractContentFromChunk(chunkData: string): string {
    try {
      // Remove the "data: " prefix and trailing newlines
      const jsonString = chunkData.replace(/^data: /, "").trim();

      // Parse the JSON data
      const data = JSON.parse(jsonString);

      // Extract the content from the delta object in the first choice
      const content = data.choices[0]?.delta?.content || "";

      return content;
    } catch (error) {
      return "";
    }
  }

  async improvePrompt(prompt: string, userId: string) {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      const input = {
        prompt:
          "Given this prompt to analyze and improve: {originalPrompt}. Enhance it by:\n1. Adding specific context\n2. Making it more precise\n3. Including necessary constraints\n4. Considering edge cases\n\nProvide ONLY the improved prompt with no explanations.",
        system_prompt:
          "You are an expert prompt engineer. Your task is to analyze prompts and improve them for better clarity, specificity, and completeness. Focus on making prompts more precise and actionable while maintaining their original intent.",
        prompt_template:
          "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
        temperature: 0.7, // Balanced creativity and consistency
        top_p: 0.95, // Allows for some creative variations while staying focused
        top_k: 0, // Using top_p instead for better quality
        max_tokens: 512, // Generous token limit for comprehensive improvements
        max_new_tokens: 512,
        length_penalty: 1,
        presence_penalty: 0,
        stop_sequences: "<|end_of_text|>,<|eot_id|>",
        log_performance_metrics: false,
      };

      const response = replicate.stream("meta/meta-llama-3-8b-instruct", {
        input: {
          ...input,
          prompt: input.prompt.replace("{originalPrompt}", prompt),
        },
      });

      const readableStream = await this.crateReadableStream(response);
      await this.handleStream(userId, readableStream);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error in improvePrompt: " + error.message);
      }
      throw error;
    }
  }

  private async crateReadableStream(
    input: AsyncGenerator<{ data: string }>
  ): Promise<ReadableStream> {
    if (!input) throw new Error("invalid input");

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

  private async handleStream(userId: string, readableStream: ReadableStream) {
    let contentArray = "";
    let lastChunk = "";
    const self = this;

    await readableStream.pipeTo(
      new WritableStream({
        write: async (chunk) => {
          const text = new TextDecoder().decode(chunk);

          const parsedChunk = self.parseSSEChunk(text);
          if (!parsedChunk) return;

          await this.sseService.sendAIProgress(userId, 1, parsedChunk.data);

          contentArray += parsedChunk.data;
          lastChunk = parsedChunk.data;
        },
        close: async () => {
          await this.sseService.sendAIComplete(userId, lastChunk);
        },
      })
    );
    console.log(contentArray);
  }

  private parseSSEChunk(chunk: string): { data: string } | null {
    try {
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          return JSON.parse(data);
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing SSE chunk:", error);
      return null;
    }
  }
}
