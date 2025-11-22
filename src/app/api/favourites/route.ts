import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Song } from "@/app/music/MusicContext";
import { getServerSession } from "next-auth";

const dataDir = path.join(process.cwd(), "data");

function getUserFilePath(email: string) {
    const safeEmail = email.replace(/[^a-zA-Z0-9@.-]/g, "_");
    return path.join(dataDir, `favourites-${safeEmail}.json`);
}

async function getFavourites(email: string) {
    const filePath = getUserFilePath(email);
    if (!existsSync(filePath)) {
        return [];
    }
    try {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing favourites data:", error);
        return [];
    }
}


async function saveFavourites(email: string, favourites: Song[] | null) {
    const filePath = getUserFilePath(email);
    if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
    }
    await writeFile(filePath, JSON.stringify(favourites, null, 2));
}

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const favourites = await getFavourites(session.user.email);
        return NextResponse.json({ favourites }, { status: 200 });
    } catch (error) {
        console.error("Error reading favourites:", error);
        return NextResponse.json({ error: "Failed to read favourites" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { favourites } = await request.json();

        if (!favourites) {
            return NextResponse.json({ error: "No favourites data provided" }, { status: 400 });
        }

        await saveFavourites(session.user.email, favourites);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving favourites:", error);
        return NextResponse.json({ error: "Failed to save favourites" }, { status: 500 });
    }
}
