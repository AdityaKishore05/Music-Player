"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

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

interface CloudinaryResponse {
  secure_url: string;
  duration?: number;
  [key: string]: unknown;
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
  uploadProgress: number | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favourites, setFavourites] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    if (!session?.user?.email) {
        setSongs([]);
        setIsLoading(false);
        return;
    }

    const fetchData = async () => {
      try {
        const songsRes = await fetch("/api/songs");

        if (songsRes.ok) {
            const songsData = await songsRes.json();
            const allSongs = songsData.songs || [];
            setSongs(allSongs);

            // Load favourites and playlists from API
            const userEmail = session?.user?.email;
            if (userEmail) {
                fetch("/api/favourites")
                    .then(res => res.json())
                    .then(data => {
                        if (data.favourites) {
                             const validFavs = data.favourites.filter((fav: Song) => allSongs.some((s: Song) => s.id === fav.id));
                             setFavourites(validFavs);
                        }
                    })
                    .catch(err => console.error("Failed to load favourites", err));

                fetch("/api/playlists")
                    .then(res => res.json())
                    .then(data => {
                        if (data.playlists) {
                            // Filter songs in playlists
                            const cleanedPlaylists = data.playlists.map((pl: Playlist) => ({
                                ...pl,
                                songs: pl.songs.filter((s: Song) => allSongs.some((as: Song) => as.id === s.id))
                            }));
                            setPlaylists(cleanedPlaylists);
                        }
                    })
                    .catch(err => console.error("Failed to load playlists", err));
            }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavourite = (song: Song) => {
    if (!session?.user?.email) return;
    setFavourites((prev) => {
      const isFav = prev.some((s) => s.id === song.id);
      const newFavs = isFav
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song];
      
      fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favourites: newFavs }),
      }).catch(err => console.error("Failed to save favourites", err));

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
    if (session?.user?.email) {
        fetch("/api/songs", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ songs: newSongs }),
        }).catch(err => console.error("Failed to save order", err));
    }
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    if (!session?.user?.email) return;
    setPlaylists((prev) => {
      const newPlaylists = prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songs.some((s) => s.id === song.id)) return pl;
          return { ...pl, songs: [...pl.songs, song] };
        }
        return pl;
      });
      
      fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlists: newPlaylists }),
      }).catch(err => console.error("Failed to save playlists", err));

      return newPlaylists;
    });
  };

  const createPlaylist = (name: string) => {
    if (!session?.user?.email) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    setPlaylists((prev) => {
      const newPlaylists = [...prev, newPlaylist];
      
      fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlists: newPlaylists }),
      }).catch(err => console.error("Failed to save playlists", err));

      return newPlaylists;
    });
  };

  const deletePlaylist = (id: string) => {
    if (!session?.user?.email) return;
    setPlaylists((prev) => {
      const newPlaylists = prev.filter((pl) => pl.id !== id);
      
      fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlists: newPlaylists }),
      }).catch(err => console.error("Failed to save playlists", err));

      return newPlaylists;
    });
  };

  const uploadSongs = async (files: File[]) => {
    if (!session?.user?.email) return;
    setUploadProgress(0);

    try {
        const progressMap: Record<number, number> = {};
        const uploadPromises = files.map((file, index) => {
            return new Promise<Song>(async (resolve, reject) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "music-player"); 
                formData.append("cloud_name", "dlq3akqq4"); 

                try {
                    const data = await new Promise<CloudinaryResponse>((xhrResolve, xhrReject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "https://api.cloudinary.com/v1_1/dlq3akqq4/auto/upload");

                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const percent = (event.loaded / event.total) * 100;
                                progressMap[index] = percent;
                                
                                // Calculate total progress
                                const totalProgress = Object.values(progressMap).reduce((a, b) => a + b, 0) / files.length;
                                setUploadProgress(Math.round(totalProgress));
                            }
                        };

                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                xhrResolve(JSON.parse(xhr.responseText));
                            } else {
                                console.error("Cloudinary Error:", xhr.responseText);
                                xhrReject(new Error(`Upload failed: ${xhr.statusText}`));
                            }
                        };

                        xhr.onerror = () => xhrReject(new Error("Network error"));
                        xhr.send(formData);
                    });

                    const durationSeconds = data.duration || 0;
                    const minutes = Math.floor(durationSeconds / 60);
                    const seconds = Math.floor(durationSeconds % 60);
                    const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                    resolve({
                        id: Date.now() + Math.random(),
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        artist: "My Upload",
                        file: data.secure_url, 
                        time: duration,
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });

        const newSongs = await Promise.all(uploadPromises);

        if (newSongs.length > 0) {
            // Save all songs to DB in parallel
            await Promise.all(newSongs.map(song => 
                fetch("/api/songs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ song }),
                })
            ));
            
            setSongs((prev) => [...prev, ...newSongs]);
        }

    } catch (e: unknown) {
        console.error("Upload failed", e);
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        alert(`Upload failed: ${errorMessage}`);
    } finally {
        setUploadProgress(null);
    }
  };

  const deleteSong = async (id: number) => {
    if (!session?.user?.email) return;
    // Optimistic update
    setSongs((prev) => prev.filter((s) => s.id !== id));
    
    // Also remove from favourites and playlists
    setFavourites(prev => prev.filter(s => s.id !== id));
    setPlaylists(prev => prev.map(pl => ({
        ...pl,
        songs: pl.songs.filter(s => s.id !== id)
    })));

    try {
      await fetch("/api/songs", {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ songId: id }),
      });
    } catch (error) {
      console.error("Failed to persist deletion:", error);
      // Revert on failure? For now, let's just log it.
    }
  };

  const removeFromPlaylist = (playlistId: string, songId: number) => {
      if (!session?.user?.email) return;
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, songs: pl.songs.filter(s => s.id !== songId) };
              }
              return pl;
          });
          
          fetch("/api/playlists", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playlists: newPlaylists }),
          }).catch(err => console.error("Failed to save playlists", err));

          return newPlaylists;
      });
  };

  const reorderPlaylist = (playlistId: string, newSongs: Song[]) => {
      if (!session?.user?.email) return;
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, songs: newSongs };
              }
              return pl;
          });
          
          fetch("/api/playlists", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playlists: newPlaylists }),
          }).catch(err => console.error("Failed to save playlists", err));

          return newPlaylists;
      });
  };

  const updatePlaylistImage = (playlistId: string, image: string) => {
      if (!session?.user?.email) return;
      setPlaylists(prev => {
          const newPlaylists = prev.map(pl => {
              if (pl.id === playlistId) {
                  return { ...pl, image };
              }
              return pl;
          });
          
          fetch("/api/playlists", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playlists: newPlaylists }),
          }).catch(err => console.error("Failed to save playlists", err));

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
            if (!session?.user?.email) return;
            setFavourites(newFavourites);
            
            fetch("/api/favourites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favourites: newFavourites }),
            }).catch(err => console.error("Failed to save favourites", err));
        },
        currentSong,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrev,
        isLoading,
        uploadProgress
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
