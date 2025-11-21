"use client";
import React, { createContext, useContext, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  file: string;
};

type PlayerContextType = {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
};
