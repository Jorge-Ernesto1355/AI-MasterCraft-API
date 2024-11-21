import { AIModelOutput } from "../entities/abstractAIModel";
import { IContent } from "../interfaces/Message.interface";
import { NotProcessed } from "./ContentFormatter";




export class contentFormatterCode {
    private languageDetector: Record<string, RegExp>
    private frameworkPatterns: Record<string, RegExp[]>    


    constructor(){
        this.languageDetector = {
            python: /^\s*def\s+|\bimport\s+\w+\s+from\s+/,
            typescript: /:\s*\w+\s*=|\bimport\s+{.*}\s+from\s+['"].*\.ts['"]/,
            javascript: /const\s+\w+\s*=|import\s+{.*}\s+from\s+['"].*\.js['"]/,
            java: /public\s+class\s+|\bimport\s+java\./,
          };

          this.frameworkPatterns =  {
            react: [
              /import\s+React(?:,?\s*{[^}]*})?\s+from\s+['"]react['"]/,
              /import\s+{[^}]*useState[^}]*}\s+from\s+['"]react['"]/,
              /export\s+default\s+function\s+\w+\(\)\s*{[\s\S]*return\s*<[A-Z]/,
              /const\s+\w+\s*=\s*\(\s*{[^}]*}\s*\)\s*=>\s*{[\s\S]*return\s*<[A-Z]/
            ],
            vue: [
              /import\s+{?\s*defineComponent\s*}?\s+from\s+['"]vue['"]/,
              /export\s+default\s+defineComponent\s*\(/
            ],
            angular: [
              /@Component\s*\(/,
              /import\s+{?\s*Component\s*}?\s+from\s+['"]@angular\/core['"]/
            ]
          };
    }
    


    public proccesor(output: AIModelOutput): IContent[] | Error {
        if (!(typeof output === "object" && output !== null && "output" in output)) 
          return new NotProcessed("text and code not processed");
    
        // Regex to capture full React component with complete div
        const codeBlockRegex = /((import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*)*\s*function\s+\w+\s*\(\)?\s*{[\s\S]*?return\s*<div[\s\S]*?<\/div>[\s\S]*?})/;
        const codeMatch = output.output.match(codeBlockRegex);
    
        if (codeMatch) {
          const contents: IContent[] = [];
          const textPart = output.output.replace(codeMatch[0], '').trim();
          const codePart = codeMatch[0].trim();
    
          // Add text part if exists
          if (textPart) {
            contents.push({
              type: 'text',
              data: textPart
            });
          }
    
          // Add code part
          contents.push({
            type: 'code',
            data: codePart,
            language: this.detectLanguage(codePart),
            framework: this.detectFramework(codePart)
          });
    
          return contents;
        }
    
        return new NotProcessed("text and code not processed");
      }
    

    private detectLanguage = (code: string): string => {
    

       
    
        for (const [lang, pattern] of Object.entries(this.languageDetector)) {
          if (pattern.test(code)) return lang;
        }
    
        return 'javascript'; // Default to JavaScript
      }

      private detectFramework = (code: string): string | undefined => {
       
    
        for (const [framework, patterns] of Object.entries(this.frameworkPatterns)) {
          if (patterns.some(pattern => pattern.test(code))) {
            return framework;
          }
        }
    
        return undefined;
      
    }

    
}