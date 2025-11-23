import mongoose, { Schema, model, models } from 'mongoose';

const FavouriteSchema = new Schema({
    userEmail: { type: String, required: true, unique: true },
    songs: { type: Array, default: [] }, // Array of Song objects
}, { timestamps: true });

const Favourite = models.Favourite || model('Favourite', FavouriteSchema);

export default Favourite;
