import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song } from "@/app/music/MusicContext";

const songsFilePath = path.join(process.cwd(), "data", "songs.json");

async function getSongs() {
    if (!existsSync(songsFilePath)) {
        return [];
    }
    const data = await readFile(songsFilePath, "utf-8");
    return JSON.parse(data);
}

async function saveSongs(songs:  Song[] | null) {
    await writeFile(songsFilePath, JSON.stringify(songs, null, 2));
}

export async function GET() {
    try {
        const songs = await getSongs();
        return NextResponse.json({ songs }, { status: 200 });
    } catch (error) {
        console.error("Error reading songs:", error);
        return NextResponse.json({ error: "Failed to read songs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { song } = await request.json();

        if (!song) {
            return NextResponse.json({ error: "No song data provided" }, { status: 400 });
        }

        const songs = await getSongs();
        songs.push(song);
        await saveSongs(songs);

        return NextResponse.json({ success: true, songs }, { status: 200 });
    } catch (error) {
        console.error("Error saving song:", error);
        return NextResponse.json({ error: "Failed to save song" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { songs } = await request.json();

        if (!songs) {
            return NextResponse.json({ error: "No songs data provided" }, { status: 400 });
        }

        await saveSongs(songs);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error updating songs:", error);
        return NextResponse.json({ error: "Failed to update songs" }, { status: 500 });
    }
}
