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
      console.log(content);
      return this.extractImprovedPrompt(content);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error("Error in improvePrompt: " + error.message);
      }
      throw error;
    }
  }
}
