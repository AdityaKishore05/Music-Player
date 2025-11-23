import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Favourite from "@/models/Favourite";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userFavourites = await Favourite.findOne({ userEmail: session.user.email });

        return NextResponse.json({ favourites: userFavourites ? userFavourites.songs : [] }, { status: 200 });
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

        await dbConnect();

        // Replace the entire favourites array
        await Favourite.findOneAndUpdate(
            { userEmail: session.user.email },
            { $set: { songs: favourites } },
            { upsert: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving favourites:", error);
        return NextResponse.json({ error: "Failed to save favourites" }, { status: 500 });
    }
}
