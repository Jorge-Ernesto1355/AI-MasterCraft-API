import { IContent } from "../interfaces/Message.interface";
import ContentFormatter from "./ContentFormatter";

export class StreamingContentFormatter extends ContentFormatter {
  private currentChunk: string = "";
  private isInsideCodeBlock: boolean = false;
  private codeLanguage: string = "";
  private pendingCodeLine: string = "";
  private languageDetector: Record<string, RegExp>;
  private frameworkPatterns: Record<string, RegExp[]>;
  private accumulatedCode: string = "";

  constructor() {
    super();
    this.languageDetector = {
      python: /^\s*def\s+|\bimport\s+\w+\s+from\s+/,
      typescript: /:\s*\w+\s*=|\bimport\s+{.*}\s+from\s+['"].*\.ts['"]/,
      javascript: /const\s+\w+\s*=|import\s+{.*}\s+from\s+['"].*\.js['"]/,
      java: /public\s+class\s+|\bimport\s+java\./,
    };

    this.frameworkPatterns = {
      react: [
        /import\s+React(?:,?\s*{[^}]*})?\s+from\s+['"]react['"]/,
        /import\s+{[^}]*useState[^}]*}\s+from\s+['"]react['"]/,
        /export\s+default\s+function\s+\w+\(\)\s*{[\s\S]*return\s*<[A-Z]/,
        /const\s+\w+\s*=\s*\(\s*{[^}]*}\s*\)\s*=>\s*{[\s\S]*return\s*<[A-Z]/,
      ],
      vue: [
        /import\s+{?\s*defineComponent\s*}?\s+from\s+['"]vue['"]/,
        /export\s+default\s+defineComponent\s*\(/,
      ],
      angular: [
        /@Component\s*\(/,
        /import\s+{?\s*Component\s*}?\s+from\s+['"]@angular\/core['"]/,
      ],
    };
  }

  private detectLanguage(code: string): string {
    for (const [lang, pattern] of Object.entries(this.languageDetector)) {
      if (pattern.test(code)) return lang;
    }
    return "javascript";
  }

  private detectFramework(code: string): string | undefined {
    for (const [framework, patterns] of Object.entries(
      this.frameworkPatterns
    )) {
      if (patterns.some((pattern) => pattern.test(code))) {
        return framework;
      }
    }
    return undefined;
  }

  private createCodeContent(code: string): IContent {
    this.accumulatedCode += code;
    const codeContent: IContent & { type: "code" } = {
      type: "code",
      data: code,
      language: this.codeLanguage || this.detectLanguage(this.accumulatedCode),
    };

    const framework = this.detectFramework(this.accumulatedCode);
    if (framework) {
      codeContent.framework = framework;
    }

    return codeContent;
  }

  public processChunk(chunk: string): IContent[] {
    const contents: IContent[] = [];

    // Handle code block opening
    if (chunk.includes("```") && !this.isInsideCodeBlock) {
      this.isInsideCodeBlock = true;
      const parts = chunk.split("```");

      // Add any text before the code block
      if (parts[0]) {
        contents.push({
          type: "text",
          data: this.currentChunk,
        });
      }

      // Handle language identifier if present in this chunk
      if (parts[1]) {
        const lines = parts[1].split("\n");
        const potentialLanguage = lines[0].trim();
        if (/^[a-zA-Z]+$/.test(potentialLanguage)) {
          this.codeLanguage = potentialLanguage;
          // If there's more code after the language identifier
          if (lines.length > 1) {
            contents.push(this.createCodeContent(lines.slice(1).join("\n")));
          }
        } else {
          contents.push(this.createCodeContent(parts[1]));
        }
      }

      this.currentChunk = "";
      return contents;
    }

    // Handle code block closing
    if (chunk.includes("```") && this.isInsideCodeBlock) {
      this.isInsideCodeBlock = false;
      const parts = chunk.split("```");

      if (parts[0]) {
        contents.push(this.createCodeContent(parts[0]));
      }

      if (parts[1]) {
        contents.push({
          type: "text",
          data: parts[1],
        });
      }

      this.currentChunk = "";
      this.codeLanguage = "";
      this.accumulatedCode = "";
      return contents;
    }

    // Inside code block
    if (this.isInsideCodeBlock) {
      contents.push(this.createCodeContent(chunk));
      return contents;
    }

    // Regular text
    this.currentChunk += chunk;
    return [
      {
        type: "text",
        data: chunk,
      },
    ];
  }

  public reset(): void {
    this.currentChunk = "";
    this.isInsideCodeBlock = false;
    this.codeLanguage = "";
    this.pendingCodeLine = "";
    this.accumulatedCode = "";
  }
}
