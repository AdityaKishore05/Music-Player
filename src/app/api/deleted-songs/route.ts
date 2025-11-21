import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const deletedSongsFilePath = path.join(process.cwd(), "data", "deleted-songs.json");

async function getDeletedSongs() {
    if (!existsSync(deletedSongsFilePath)) {
        return [];
    }
    const data = await readFile(deletedSongsFilePath, "utf-8");
    try {
        return JSON.parse(data);
    } catch (_) {
        return [];
    }
}

async function saveDeletedSongs(deletedSongs: number[]) {
    await writeFile(deletedSongsFilePath, JSON.stringify(deletedSongs, null, 2));
}

export async function GET() {
    try {
        const deletedSongs = await getDeletedSongs();
        return NextResponse.json({ deletedSongs }, { status: 200 });
    } catch (error) {
        console.error("Error reading deleted songs:", error);
        return NextResponse.json({ error: "Failed to read deleted songs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { songId } = await request.json();

        if (!songId) {
            return NextResponse.json({ error: "No song ID provided" }, { status: 400 });
        }

        const deletedSongs = await getDeletedSongs();
        if (!deletedSongs.includes(songId)) {
            deletedSongs.push(songId);
            await saveDeletedSongs(deletedSongs);
        }

        return NextResponse.json({ success: true, deletedSongs }, { status: 200 });
    } catch (error) {
        console.error("Error saving deleted song:", error);
        return NextResponse.json({ error: "Failed to save deleted song" }, { status: 500 });
    }
}
