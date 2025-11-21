import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song } from "@/app/music/MusicContext";

const playlistsFilePath = path.join(process.cwd(), "data", "playlists.json");

async function getPlaylists() {
    if (!existsSync(playlistsFilePath)) {
        return [];
    }
    const data = await readFile(playlistsFilePath, "utf-8");
    return JSON.parse(data);
}

async function savePlaylists(playlists:  Song[] | null) {
    await writeFile(playlistsFilePath, JSON.stringify(playlists, null, 2));
}

export async function GET() {
    try {
        const playlists = await getPlaylists();
        return NextResponse.json({ playlists }, { status: 200 });
    } catch (error) {
        console.error("Error reading playlists:", error);
        return NextResponse.json({ error: "Failed to read playlists" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { playlists } = await request.json();

        if (!playlists) {
            return NextResponse.json({ error: "No playlists data provided" }, { status: 400 });
        }

        await savePlaylists(playlists);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving playlists:", error);
        return NextResponse.json({ error: "Failed to save playlists" }, { status: 500 });
    }
}
