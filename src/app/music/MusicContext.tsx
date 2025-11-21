"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Song {
  id: number;
  title: string;
  artist: string;
  file: string;
  time: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  image?: string;
}

interface MusicContextType {
  songs: Song[];
  filteredSongs: Song[];
  playlists: Playlist[];
  favourites: Song[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleFavourite: (song: Song) => void;
  playSong: (song: Song, contextSongs?: Song[]) => void;
  reorderSongs: (newSongs: Song[]) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  createPlaylist: (name: string) => void;
  uploadSong: (file: File) => Promise<void>;
  deleteSong: (id: number) => void;
  removeFromPlaylist: (playlistId: string, songId: number) => void;
  reorderPlaylist: (playlistId: string, newSongs: Song[]) => void;
  updatePlaylistImage: (playlistId: string, image: string) => void;
  reorderFavourites: (newFavourites: Song[]) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favourites, setFavourites] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletedSongIds, setDeletedSongIds] = useState<number[]>([]);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, deletedRes] = await Promise.all([
          fetch("/api/songs"),
          fetch("/api/deleted-songs")
        ]);

        const songsData = await songsRes.json();
        const deletedData = await deletedRes.json();

        const allSongs = songsData.songs || [];
        const deletedIds = deletedData.deletedSongs || [];

        setDeletedSongIds(deletedIds);
        setSongs(allSongs.filter((s: Song) => !deletedIds.includes(s.id)));
        
        // Load favourites and playlists from local storage or mock data for now
        // In a real app, these would also be API calls
        const storedFavs = localStorage.getItem("favourites");
        if (storedFavs) setFavourites(JSON.parse(storedFavs));

        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavourite = (song: Song) => {
    setFavourites((prev) => {
      const isFav = prev.some((s) => s.id === song.id);
      const newFavs = isFav
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song];
      localStorage.setItem("favourites", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const playSong = (song: Song, contextSongs?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (contextSongs) {
      setQueue(contextSongs);
    } else {
      // Default to all songs if no context provided
      setQueue(songs);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  const reorderSongs = (newSongs: Song[]) => {
    setSongs(newSongs);
    // Ideally save order to backend
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists((prev) => {
      const newPlaylists = prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songs.some((s) => s.id === song.id)) return pl;
          return { ...pl, songs: [...pl.songs, song] };
        }
        return pl;
      });
      localStorage.setItem("playlists", JSON.stringify(newPlaylists));
      return newPlaylists;
    });
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    setPlaylists((prev) => {
      const newPlaylists = [...prev, newPlaylist];
      localStorage.setItem("playlists", JSON.stringify(newPlaylists));
      return newPlaylists;
    });
  };

  const uploadSong = async (file: File) => {
    // Mock upload - in real app, send to API
    const formData = new FormData();
    // We need to construct the song object to send to API
    // For now, we'll just simulate it on client and assume API handles file storage
    // But wait, the API route expects { song: ... }
    
    // Since we can't easily do file upload logic here without a proper backend upload handler that saves files,
    // I will implement a basic version that assumes the file is handled.
    // For this specific task, the user asked to fix deletion. I will try to keep upload simple.
    
    // Let's assume we send metadata to /api/songs
    const newSong: Song = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Upload",
      file: URL.createObjectURL(file), // Temporary blob URL
      time: "0:00", // Placeholder
    };

    try {
        await fetch("/api/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ song: newSong }),
        });
        setSongs((prev) => [...prev, newSong]);
    } catch (e) {
        console.error("Upload failed", e);
    }
  };

  const deleteSong = async (id: number) => {
    // Optimistic update
    setSongs((prev) => prev.filter((s) => s.id !== id));
    setDeletedSongIds((prev) => [...prev, id]);

    try {
      await fetch("/api/deleted-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: id }),
      });
    } catch (error) {
      console.error("Failed to persist deletion:", error);
      // Revert on failure? For now, let's just log it.
    }
  };

  const removeFromPlaylist = (playlistId: string, songId: number) => {
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, songs: pl.songs.filter(s => s.id !== songId) };
              }
              return pl;
          });
          localStorage.setItem("playlists", JSON.stringify(newPlaylists));
          return newPlaylists;
      });
  };

  const reorderPlaylist = (playlistId: string, newSongs: Song[]) => {
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, songs: newSongs };
              }
              return pl;
          });
          localStorage.setItem("playlists", JSON.stringify(newPlaylists));
          return newPlaylists;
      });
  };

  const updatePlaylistImage = (playlistId: string, image: string) => {
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, image };
              }
              return pl;
          });
          localStorage.setItem("playlists", JSON.stringify(newPlaylists));
          return newPlaylists;
      });
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        filteredSongs,
        playlists,
        favourites,
        searchQuery,
        setSearchQuery,
        toggleFavourite,
        playSong,
        reorderSongs,
        addToPlaylist,
        createPlaylist,
        uploadSong,
        deleteSong,
        removeFromPlaylist,
        reorderPlaylist,
        updatePlaylistImage,
        reorderFavourites: (newFavourites: Song[]) => {
            setFavourites(newFavourites);
            localStorage.setItem("favourites", JSON.stringify(newFavourites));
        },
        currentSong,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrev
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
<<<<<<< HEAD
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
=======
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
};
