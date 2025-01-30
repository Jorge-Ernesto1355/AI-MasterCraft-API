export const AIResponseConfigurations = {
  normal: {
    system_prompt:
      "You are a helpful, balanced AI assistant. Provide clear, straightforward answers that are easy to understand.",
    min_tokens: 20,
    max_tokens: 300,
    temperature: 0.5,
    top_p: 0.7,
    top_k: 50,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop_sequences: ["\\n\\n", "Human:"],
  },
  concise: {
    system_prompt:
      "Provide extremely brief and direct answers. Use minimal words to convey the most important information.",
    min_tokens: 10,
    max_tokens: 150,
    temperature: 0.3,
    top_p: 0.6,
    top_k: 30,
    presence_penalty: 0.3,
    frequency_penalty: 0.2,
    stop_sequences: ["."],
  },
  formal: {
    system_prompt:
      "Respond with academic precision. Use sophisticated language, professional terminology, and maintain a scholarly tone.",
    min_tokens: 30,
    max_tokens: 350,
    temperature: 0.2,
    top_p: 0.5,
    top_k: 20,
    presence_penalty: 0.4,
    frequency_penalty: 0.3,
    stop_sequences: ["\\n", "References:"],
  },
  explanatory: {
    system_prompt:
      "Provide comprehensive, in-depth explanations. Break down complex topics, offer multiple perspectives, and include relevant examples.",
    min_tokens: 50,
    max_tokens: 600,
    temperature: 0.6,
    top_p: 0.8,
    top_k: 80,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
    stop_sequences: ["\\n\\n\\n", "In conclusion:"],
  },
  creative: {
    system_prompt:
      "Generate highly innovative and imaginative responses. Use unexpected analogies, creative language, and novel approaches.",
    min_tokens: 40,
    max_tokens: 400,
    temperature: 1.0,
    top_p: 0.9,
    top_k: 100,
    presence_penalty: 0.5,
    frequency_penalty: 0.4,
    stop_sequences: ["---", "Alternative perspective:"],
  },
  technical: {
    system_prompt:
      "Provide precise, technical answers. Use exact terminology, include specific details, and maintain a structured approach.",
    min_tokens: 30,
    max_tokens: 500,
    temperature: 0.3,
    top_p: 0.6,
    top_k: 40,
    presence_penalty: 0.2,
    frequency_penalty: 0.3,
    stop_sequences: ["```", "Key parameters:"],
  },
};

export type typeConfig = "normal" | "concise" | "explanatory" | "formal";
