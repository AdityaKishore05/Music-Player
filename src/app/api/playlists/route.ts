import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song, Playlist } from "@/app/music/MusicContext";
import { getServerSession } from "next-auth";

const dataDir = path.join(process.cwd(), "data");

function getUserFilePath(email: string) {
    const safeEmail = email.replace(/[^a-zA-Z0-9@.-]/g, "_");
    return path.join(dataDir, `playlists-${safeEmail}.json`);
}

async function getPlaylists(email: string) {
    const filePath = getUserFilePath(email);
    if (!existsSync(filePath)) {
        return [];
    }
    try {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing playlists data:", error);
        return [];
    }
}

async function savePlaylists(email: string, playlists: Playlist[]) {
    const filePath = getUserFilePath(email);
    if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
    }
    await writeFile(filePath, JSON.stringify(playlists, null, 2));
}

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const playlists = await getPlaylists(session.user.email);
        return NextResponse.json({ playlists }, { status: 200 });
    } catch (error) {
        console.error("Error reading playlists:", error);
        return NextResponse.json({ error: "Failed to read playlists" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { playlists } = await request.json();

        if (!playlists) {
            return NextResponse.json({ error: "No playlists data provided" }, { status: 400 });
        }

        await savePlaylists(session.user.email, playlists);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving playlists:", error);
        return NextResponse.json({ error: "Failed to save playlists" }, { status: 500 });
    }
}
