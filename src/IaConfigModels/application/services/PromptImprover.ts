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

  private extractImprovedPrompt(content: string): string | null {
    const match = content.match(/improved_prompt:\s*"([^"]+)"/);
    return match ? match[1] : null;
  }

  async improvePromptWithStream(
    prompt: string,
    onChunk: ChunkCallback
  ): Promise<string | undefined> {
    try {
      let fullResponse = "";

      const response = await fetch(
        "https://huggingface.co/api/inference-proxy/together/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey!}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-ai/DeepSeek-R1",
            messages: [
              {
                role: "user",
                content: this.createPromptTemplate(prompt),
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

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") continue;

            try {
              const jsonData = JSON.parse(jsonStr);
              const content = jsonData.choices[0]?.delta?.content || "";
              fullResponse += content;

              // Try to extract improved prompt from accumulated response
              const improvedPrompt = this.extractImprovedPrompt(fullResponse);
              if (improvedPrompt) {
                onChunk(improvedPrompt);
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }

      // Final extraction attempt
      const finalImprovedPrompt = this.extractImprovedPrompt(fullResponse);
      return finalImprovedPrompt || undefined;
    } catch (error) {
      console.error("Error in improvePromptWithStream:", error);
      return undefined;
    }
  }

  async improvePrompt(prompt: string): Promise<string | null> {
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
                content: this.createPromptTemplate(prompt),
              },
            ],
            stream: false,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      return this.extractImprovedPrompt(content);
    } catch (error) {
      console.error("Error in improvePrompt:", error);
      return null;
    }
  }
}
