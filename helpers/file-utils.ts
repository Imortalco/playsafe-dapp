import { promises } from "fs";
import fs from 'fs';

export function getPemKeyFromFile(filePath: string) {
    const pemText = fs.readFileSync(filePath, { encoding: "utf8" });
    return pemText;
}