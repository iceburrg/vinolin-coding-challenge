import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const selectedVarieties = await request.json();
    const dataToSave = { selectedVarieties };
    const filePath = path.join(process.cwd(), "src/app/model/grapeVarietiesSelections.json");
    
    await writeFile(filePath, JSON.stringify(dataToSave, null, 2), "utf8");
    
    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving grape varieties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
} 