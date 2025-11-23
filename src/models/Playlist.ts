import mongoose, { Schema, model, models } from 'mongoose';

const SinglePlaylistSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    songs: { type: Array, default: [] },
    image: { type: String },
}, { _id: false });

const UserPlaylistsSchema = new Schema({
    userEmail: { type: String, required: true, unique: true, index: true },
    playlists: { type: [SinglePlaylistSchema], default: [] },
}, { timestamps: true });

const UserPlaylists = models.UserPlaylists || model('UserPlaylists', UserPlaylistsSchema);

export default UserPlaylists;
