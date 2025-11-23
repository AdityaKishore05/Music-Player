import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserPlaylists from "@/models/Playlist";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userPlaylists = await UserPlaylists.findOne({ userEmail: session.user.email });

        return NextResponse.json({ playlists: userPlaylists ? userPlaylists.playlists : [] }, { status: 200 });
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

        await dbConnect();

        // Replace the entire playlists array
        await UserPlaylists.findOneAndUpdate(
            { userEmail: session.user.email },
            { $set: { playlists: playlists } },
            { upsert: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving playlists:", error);
        return NextResponse.json({ error: "Failed to save playlists" }, { status: 500 });
    }
}
