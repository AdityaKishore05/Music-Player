"use client";
import React, { createContext, useContext, useState } from "react";

const MusicContext = createContext<any>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [favourites, setFavourites] = useState<any[]>([]);

  const toggleFavourite = (song: any) => {
    setFavourites(
      (prev) =>
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
