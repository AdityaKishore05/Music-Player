"use client";
import React, { createContext, useContext, useState } from "react";

// Define the shape of a song
export type Song = {
  id: number;
  title: string;
  artist: string;
  file: string;
  time?: string; // optional, since not all songs may have time
};

// Define the context type
type MusicContextType = {
  favourites: Song[];
  toggleFavourite: (song: Song) => void;
};

// Create context with correct type
const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [favourites, setFavourites] = useState<Song[]>([]);

  const toggleFavourite = (song: Song) => {
    setFavourites((prev) =>
      prev.find((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  return (
    <MusicContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
};
