import type { CompilerOptions } from "typescript";

export type TsConfig = {
  extends?: string;
  compilerOptions?: CompilerOptions;
  include?: string[];
};

const matchHashComment = new RegExp(
  /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/,
  "gi"
);

const sanitizeJson = (json: string) => {
  // Remove trailing commas
  const withoutCommas = json.replace(/,(?=\s*?[\]}])/g, "");
  return withoutCommas
    .replace(matchHashComment, (match, g) => (g ? "" : match))
    .trim();
};

export const parseTsConfig = (data: Buffer) => {
  const json = sanitizeJson(data.toString("utf8"));
  try {
    const tsConfig: TsConfig = JSON.parse(json);
    return tsConfig;
  } catch (error) {
    console.log("Error: Unprocessable tsConfig file");
    process.exit(1);
  }
};
