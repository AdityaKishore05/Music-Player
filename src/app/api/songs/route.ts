import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserSongs from "@/models/Song";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userSongs = await UserSongs.findOne({ userEmail: session.user.email });

        return NextResponse.json({ songs: userSongs ? userSongs.songs : [] }, { status: 200 });
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

        await dbConnect();

        // Find and update, or create if doesn't exist
        const userSongs = await UserSongs.findOneAndUpdate(
            { userEmail: session.user.email },
            { $push: { songs: song } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, songs: userSongs.songs }, { status: 200 });
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

        await dbConnect();

        // Replace the entire songs array (for reordering)
        await UserSongs.findOneAndUpdate(
            { userEmail: session.user.email },
            { $set: { songs: songs } },
            { upsert: true }
        );

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

        if (!songId) {
            return NextResponse.json({ error: "Song ID required" }, { status: 400 });
        }

        await dbConnect();

        const userSongs = await UserSongs.findOneAndUpdate(
            { userEmail: session.user.email },
            { $pull: { songs: { id: songId } } },
            { new: true }
        );

        return NextResponse.json({ success: true, songs: userSongs ? userSongs.songs : [] }, { status: 200 });
    } catch (error) {
        console.error("Error deleting song:", error);
        return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
    }
}
