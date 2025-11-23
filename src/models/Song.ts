import mongoose, { Schema, model, models } from 'mongoose';

const SingleSongSchema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    file: { type: String, required: true },
    time: { type: String, required: true },
}, { _id: false }); // Disable _id for subdocuments if we want to keep original IDs

const UserSongsSchema = new Schema({
    userEmail: { type: String, required: true, unique: true, index: true },
    songs: { type: [SingleSongSchema], default: [] },
}, { timestamps: true });

const UserSongs = models.UserSongs || model('UserSongs', UserSongsSchema);

export default UserSongs;
