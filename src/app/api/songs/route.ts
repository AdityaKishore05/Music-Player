import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song } from "@/app/music/MusicContext";
import { getServerSession } from "next-auth";

const dataDir = path.join(process.cwd(), "data");

function getUserFilePath(email: string) {
    // Sanitize email to be safe for filename
    const safeEmail = email.replace(/[^a-zA-Z0-9@.-]/g, "_");
    return path.join(dataDir, `songs-${safeEmail}.json`);
}

async function getSongs(email: string) {
    const filePath = getUserFilePath(email);
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

async function saveSongs(email: string, songs: Song[]) {
    const filePath = getUserFilePath(email);
    if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
    }
    await writeFile(filePath, JSON.stringify(songs, null, 2));
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const songs = await getSongs(session.user.email);
        return NextResponse.json({ songs }, { status: 200 });
    } catch (error) {
        console.error("Error reading songs:", error);
        return NextResponse.json({ error: "Failed to read songs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { song } = await request.json();

        if (!song) {
            return NextResponse.json({ error: "No song data provided" }, { status: 400 });
        }

        const songs = await getSongs(session.user.email);
        songs.push(song);
        await saveSongs(session.user.email, songs);

        return NextResponse.json({ success: true, songs }, { status: 200 });
    } catch (error) {
        console.error("Error saving song:", error);
        return NextResponse.json({ error: "Failed to save song" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { songs } = await request.json();

        if (!songs) {
            return NextResponse.json({ error: "No songs data provided" }, { status: 400 });
        }

        await saveSongs(session.user.email, songs);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error updating songs:", error);
        return NextResponse.json({ error: "Failed to update songs" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { songId } = await request.json();
        console.log(`[DELETE] User: ${session.user.email}, SongID: ${songId}`);

        if (!songId) {
            return NextResponse.json({ error: "Song ID required" }, { status: 400 });
        }

        const songs = await getSongs(session.user.email);
        // Ensure type-safe comparison (ids are numbers, but let's be safe)
        const newSongs = songs.filter((s: Song) => String(s.id) !== String(songId));
        await saveSongs(session.user.email, newSongs);

        return NextResponse.json({ success: true, songs: newSongs }, { status: 200 });
    } catch (error) {
        console.error("Error deleting song:", error);
        return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
    }
}
