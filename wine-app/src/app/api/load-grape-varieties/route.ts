import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/app/model/grapeVarietiesSelections.json");
    const fileContent = await readFile(filePath, "utf8");
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    // If file doesn't exist or can't be read, return empty array
    return NextResponse.json([]);
  }
} 