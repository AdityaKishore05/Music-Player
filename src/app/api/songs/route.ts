import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song } from "@/app/music/MusicContext";

const dataDir = path.join(process.cwd(), "data");

function getSessionFilePath(sessionId: string) {
    // Sanitize sessionId to prevent directory traversal
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9-]/g, "");
    return path.join(dataDir, `songs-${safeSessionId}.json`);
}

async function getSongs(sessionId: string) {
    const filePath = getSessionFilePath(sessionId);
    if (!existsSync(filePath)) {
        return [];
    }
    try {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing song data:", error);
        return [];
    }
}

async function saveSongs(sessionId: string, songs: Song[]) {
    const filePath = getSessionFilePath(sessionId);
    if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
    }
    await writeFile(filePath, JSON.stringify(songs, null, 2));
}

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.headers.get("x-session-id");
        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const songs = await getSongs(sessionId);
        return NextResponse.json({ songs }, { status: 200 });
    } catch (error) {
        console.error("Error reading songs:", error);
        return NextResponse.json({ error: "Failed to read songs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const sessionId = request.headers.get("x-session-id");
        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const { song } = await request.json();

        if (!song) {
            return NextResponse.json({ error: "No song data provided" }, { status: 400 });
        }

        const songs = await getSongs(sessionId);
        songs.push(song);
        await saveSongs(sessionId, songs);

        return NextResponse.json({ success: true, songs }, { status: 200 });
    } catch (error) {
        console.error("Error saving song:", error);
        return NextResponse.json({ error: "Failed to save song" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const sessionId = request.headers.get("x-session-id");
        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const { songs } = await request.json();

        if (!songs) {
            return NextResponse.json({ error: "No songs data provided" }, { status: 400 });
        }

        await saveSongs(sessionId, songs);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error updating songs:", error);
        return NextResponse.json({ error: "Failed to update songs" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const sessionId = request.headers.get("x-session-id");
        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const { songId } = await request.json();
        console.log(`[DELETE] Session: ${sessionId}, SongID: ${songId}`);

        if (!songId) {
            return NextResponse.json({ error: "Song ID required" }, { status: 400 });
        }

        const songs = await getSongs(sessionId);
        // Ensure type-safe comparison (ids are numbers, but let's be safe)
        const newSongs = songs.filter((s: Song) => String(s.id) !== String(songId));
        await saveSongs(sessionId, newSongs);

        return NextResponse.json({ success: true, songs: newSongs }, { status: 200 });
    } catch (error) {
        console.error("Error deleting song:", error);
        return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
    }
}
