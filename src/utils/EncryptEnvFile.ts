const CryptoJS: any = require("crypto-js");
import * as fs from "fs";
import * as path from "path";

const configDir = path.resolve(__dirname, "..", "config");
const envFilePath = path.join(
  configDir,
  `.env${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}`
);

function readEnvLines(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  return content.split(/\r?\n/);
}

function writeEnvLines(filePath: string, lines: string[]): void {
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

export function encryptEnvFile(): void {
  const SALT: string = process.env.SALT || "defaultSALT";
  const envLines = readEnvLines(envFilePath);

  const encryptedLines = envLines.map((line: string) => {
    // Preserve blank lines and comments
    if (!line || line.trim().startsWith("#") || line.indexOf("=") === -1)
      return line;

    const idx = line.indexOf("=");
    const key = line.substring(0, idx);
    const value = line.substring(idx + 1);

    if (value === "") return line;

    const encryptedValue = CryptoJS.AES.encrypt(value, SALT).toString();
    return `${key}=${encryptedValue}`;
  });

  writeEnvLines(envFilePath, encryptedLines);
  console.log("Encryption complete. Updated .env file.");
}

export function decryptEnvFile(): void {
  const SALT: string = process.env.SALT || "defaultSALT";
  const envLines = readEnvLines(envFilePath);

  const decryptedLines = envLines.map((line: string) => {
    // Preserve blank lines and comments
    if (!line || line.trim().startsWith("#") || line.indexOf("=") === -1)
      return line;

    const idx = line.indexOf("=");
    const key = line.substring(0, idx);
    const value = line.substring(idx + 1);

    if (value === "") return line;

    try {
      const bytes = CryptoJS.AES.decrypt(value, SALT);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return `${key}=${decryptedValue}`;
    } catch (e) {
      // If decryption fails, keep original line
      return line;
    }
  });

  writeEnvLines(envFilePath, decryptedLines);
  console.log("Decryption complete. Updated .env file.");
}
