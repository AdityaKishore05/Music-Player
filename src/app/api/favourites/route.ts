import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const favouritesFilePath = path.join(process.cwd(), "data", "favourites.json");

async function getFavourites() {
    if (!existsSync(favouritesFilePath)) {
        return [];
    }
    const data = await readFile(favouritesFilePath, "utf-8");
    return JSON.parse(data);
}

async function saveFavourites(favourites: null | any[]) {
    await writeFile(favouritesFilePath, JSON.stringify(favourites, null, 2));
}

export async function GET() {
    try {
        const favourites = await getFavourites();
        return NextResponse.json({ favourites }, { status: 200 });
    } catch (error) {
        console.error("Error reading favourites:", error);
        return NextResponse.json({ error: "Failed to read favourites" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { favourites } = await request.json();

        if (!favourites) {
            return NextResponse.json({ error: "No favourites data provided" }, { status: 400 });
        }

        await saveFavourites(favourites);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving favourites:", error);
        return NextResponse.json({ error: "Failed to save favourites" }, { status: 500 });
    }
}
