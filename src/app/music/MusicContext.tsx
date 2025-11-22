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
  deletePlaylist: (id: string) => void;
  uploadSongs: (files: File[]) => Promise<void>;
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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Deduplicate songs based on ID
        const uniqueSongs = Array.from(new Map(allSongs.map((s: Song) => [s.id, s])).values()) as Song[];
        
        setSongs(uniqueSongs.filter((s) => !deletedIds.includes(s.id)));
        
        // Load favourites and playlists from local storage or mock data for now
        // In a real app, these would also be API calls
        const storedFavs = localStorage.getItem("favourites");
        if (storedFavs) {
            const parsedFavs: Song[] = JSON.parse(storedFavs);
            setFavourites(parsedFavs.filter((s) => !deletedIds.includes(s.id)));
        }

        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) {
            const parsedPlaylists: Playlist[] = JSON.parse(storedPlaylists);
            const cleanedPlaylists = parsedPlaylists.map(pl => ({
                ...pl,
                songs: pl.songs.filter(s => !deletedIds.includes(s.id))
            }));
            setPlaylists(cleanedPlaylists);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => {
      const newPlaylists = prev.filter((pl) => pl.id !== id);
      localStorage.setItem("playlists", JSON.stringify(newPlaylists));
      return newPlaylists;
    });
  };

  const uploadSongs = async (files: File[]) => {
    try {
        const newSongs: Song[] = [];

        for (const file of files) {
            // 1. Upload file to server
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                console.error(`Failed to upload ${file.name}`);
                continue;
            }

            const { url } = await uploadRes.json();

            // Calculate duration
            const duration = await new Promise<string>((resolve) => {
                const audio = new Audio(url);
                audio.onloadedmetadata = () => {
                    const minutes = Math.floor(audio.duration / 60);
                    const seconds = Math.floor(audio.duration % 60);
                    resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                };
                audio.onerror = () => resolve("0:00");
            });

            // 2. Create song object with persistent URL
            const newSong: Song = {
                id: Date.now() + Math.random(),
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: "Local Upload",
                file: url, 
                time: duration,
            };
            newSongs.push(newSong);
        }

        if (newSongs.length === 0) return;

        // 3. Save song metadata (using POST loop to append)
        for (const song of newSongs) {
             await fetch("/api/songs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ song }),
            });
        }

        setSongs((prev) => [...prev, ...newSongs]);
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
        deletePlaylist,
        uploadSongs,
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
        playPrev,
        isLoading
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
