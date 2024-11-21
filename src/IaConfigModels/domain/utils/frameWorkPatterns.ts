export const  frameworkPatterns = {
    react: [
      /import\s+React(?:,?\s*{[^}]*})?\s+from\s+['"]react['"]/,
      /import\s+{[^}]*useState[^}]*}\s+from\s+['"]react['"]/,
      /export\s+default\s+function\s+\w+\(\)\s*{[\s\S]*return\s*<[A-Z]/,
      /const\s+\w+\s*=\s*\(\s*{[^}]*}\s*\)\s*=>\s*{[\s\S]*return\s*<[A-Z]/
    ],
    vue: [
      /import\s+{?\s*defineComponent\s*}?\s+from\s+['"]vue['"]/,
      /export\s+default\s+defineComponent\s*\(/,
      /<template>[\s\S]*<\/template>/,
      /createApp\s*\(/
    ],
    angular: [
      /@Component\s*\(/,
      /import\s+{?\s*Component\s*}?\s+from\s+['"]@angular\/core['"]/,
      /selector:\s*['"][\w-]+['"]/
    ],
    nextjs: [
      /import\s+{?\s*GetServerSideProps\s*}?\s+from\s+['"]next\/types['"]/,
      /export\s+default\s+function\s+\w+Page\(/
    ],
    svelte: [
      /<script[\s\S]*>\s*(?:import|export)\s/,
      /\$:\s*\w+\s*=\s*/
    ]
  };