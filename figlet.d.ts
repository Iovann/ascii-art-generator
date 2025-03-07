declare module "figlet" {
  export function textSync(text: string, options?: any): string;
  export function parseFont(font: string, fontData: any): void;
}
