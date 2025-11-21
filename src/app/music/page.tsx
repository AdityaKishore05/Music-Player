<<<<<<< HEAD
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Heart, Search, GripVertical, Plus, ListMusic, Upload, Trash2, Menu, X, Library } from "lucide-react";
import { useMusic, Song } from "./MusicContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Component
const SortableSongItem = ({
  song,
  isFavourite,
  toggleFavourite,
  playSong,
  onAddToPlaylist,
  onDelete,
}: {
  song: Song;
  isFavourite: boolean;
  toggleFavourite: (song: Song) => void;
  playSong: (song: Song) => void;
  onAddToPlaylist: (song: Song, rect: DOMRect) => void;
  onDelete: (songId: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center bg-gray-800/50 hover:bg-black/50 py-1 rounded-md text-lg hover:py-2 sm:px-4 my-2 duration-200 transition-all ease-in-out group border border-transparent hover:border-red-500 relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-gray-500 hover:text-white mr-2"
      >
        <GripVertical size={20} />
      </div>

      <div
        onClick={() => playSong(song)}
        className="flex items-center gap-2 md:gap-6 flex-1 cursor-pointer min-w-0"
      >
        <img
          src="https://picfiles.alphacoders.com/462/462928.jpg"
          alt={song.title}
          className="h-14 w-14 rounded-md flex-shrink-0 object-cover hidden md:block"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm md:text-lg font-semibold text-white truncate">
            {song.title}
          </p>
          <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 truncate">
            {song.artist}
          </p>
        </div>
      </div>

      <div className="text-md font-medium text-white flex gap-1 md:gap-3 items-center flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            onAddToPlaylist(song, rect);
          }}
          className="hover:text-amber-300 p-1 md:p-2 text-gray-400 hover:bg-black/20 rounded-full transition cursor-pointer"
          title="Add to Playlist"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(song);
          }}
          className="hover:text-amber-300 p-1 md:p-2 cursor-pointer"
        >
          {isFavourite ? (
            <Heart fill="currentColor" className="text-amber-300 w-[18px] h-[18px] md:w-5 md:h-5" />
          ) : (
            <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" />
          )}
        </button>
        <span className="hidden sm:inline w-10 md:w-12 text-right text-xs md:text-sm">{song.time}</span>
        <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${song.title}"?`)) {
                onDelete(song.id);
              }
            }}
            className="hover:text-red-500 p-1 md:p-2 text-red-400 transition-opacity cursor-pointer"
            title="Delete Song"
          >
            <Trash2 size={18} className="md:w-5 md:h-5" />
          </button>
      </div>
    </li>
  );
};

const SongsList = () => {
  const {
    filteredSongs,
    favourites,
    toggleFavourite,
    playSong,
    searchQuery,
    setSearchQuery,
    reorderSongs,
    songs,
    playlists,
    addToPlaylist,
    createPlaylist,
    uploadSong,
    deleteSong,
  } = useMusic();

  const [activeMenu, setActiveMenu] = useState<{ song: Song; position: { top: number; left: number } } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadSong(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = songs.findIndex((s) => s.id === active.id);
      const newIndex = songs.findIndex((s) => s.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSongs(arrayMove(songs, oldIndex, newIndex));
      }
    }
  };

  const handleAddToPlaylistClick = (song: Song, rect: DOMRect) => {
    const menuWidth = 200;
    let left = rect.right + window.scrollX - menuWidth;
    
    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 20;
    }
    
    if (left < 0) {
        left = 10;
    }

    setActiveMenu({
      song,
      position: {
        top: rect.bottom + window.scrollY + 5,
        left: left,
      },
    });
  };

  const handlePlaylistSelect = (playlistId: string) => {
    if (activeMenu) {
      addToPlaylist(playlistId, activeMenu.song);
      setActiveMenu(null);
    }
  };

  const handleCreateAndAdd = () => {
    if (activeMenu) {
      const name = prompt("Enter new playlist name:");
      if (name) {
        createPlaylist(name);
        alert(`Playlist "${name}" created! Please add the song again.`); 
      }
      setActiveMenu(null);
    }
  };

  const isFavourite = (id: number) => favourites.some((fav) => fav.id === id);

  return (
    <div className="w-full md:w-[96%] mx-auto px-2 md:px-4 pb-32 pt-6 relative">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl text-white font-bold">Songs Collection</h2>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm transition-colors"
              placeholder="Search songs or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer whitespace-nowrap"
            title="Upload Song"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredSongs.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {filteredSongs.map((song) => (
              <SortableSongItem
                key={song.id}
                song={song}
                isFavourite={isFavourite(song.id)}
                toggleFavourite={toggleFavourite}
                playSong={() => playSong(song)}
                onAddToPlaylist={handleAddToPlaylistClick}
                onDelete={deleteSong}
              />
            ))}
            {filteredSongs.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p>No songs found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Context Menu for Playlists */}
      {activeMenu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: activeMenu.position.top,
            left: activeMenu.position.left,
            zIndex: 100,
          }}
          className="bg-gray-800 border border-gray-700 rounded-md shadow-xl w-48 overflow-hidden"
        >
          <div className="p-2 border-b border-gray-700">
            <p className="text-xs text-gray-400 uppercase font-semibold">Add to Playlist</p>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {playlists.map((pl) => (
              <li
                key={pl.id}
                onClick={() => handlePlaylistSelect(pl.id)}
                className="px-4 py-2 hover:bg-red-600 text-white cursor-pointer text-sm flex items-center gap-2"
              >
                <ListMusic size={14} /> {pl.name}
              </li>
            ))}
            {playlists.length === 0 && (
               <li className="px-4 py-2 text-gray-500 text-sm italic">No playlists</li>
            )}
          </ul>
          <div
            onClick={handleCreateAndAdd}
            className="px-4 py-2 hover:bg-red-600 text-white cursor-pointer text-sm border-t border-gray-700 flex items-center gap-2"
          >
            <Plus size={14} /> Create New
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-black border-l border-gray-700 z-50 md:hidden overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Favourites Section */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Heart size={18} className="text-amber-300" />
                  Favourites
                </h3>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {favourites.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No favourites yet</p>
                ) : (
                  favourites.map((song) => (
                    <div
                      key={song.id}
                      className="flex gap-3 items-center hover:bg-black/20 rounded-md cursor-pointer px-2 py-1 transition"
                      onClick={() => {
                        playSong(song);
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <img
                        src="https://picfiles.alphacoders.com/462/462928.jpg"
                        className="h-8 w-8 rounded-md object-cover shadow-sm flex-shrink-0"
                        alt={song.title}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{song.title}</p>
                        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Playlists Section */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Library size={18} />
                  Your Library
                </h3>
                <button
                  onClick={() => {
                    const name = prompt("Enter playlist name:");
                    if (name) {
                      createPlaylist(name);
                    }
                  }}
                  className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                  title="Create Playlist"
                >
                  <Plus size={18} className="text-gray-400 hover:text-white" />
                </button>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {playlists.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No playlists yet</p>
                ) : (
                  playlists.map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/music/playlist/${playlist.id}`}
                      className="flex gap-3 items-center hover:bg-black/20 rounded-md px-2 py-2 transition group"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <img
                        src={playlist.image || "https://picfiles.alphacoders.com/462/462928.jpg"}
                        className="h-10 w-10 rounded-md object-cover shadow-sm flex-shrink-0"
                        alt={playlist.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                        <p className="text-gray-400 text-xs">{playlist.songs.length} songs</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
=======
import React from "react";
import SongsList from "./@songs/page";

const MusicPage = () => {
  return (
    <div className="text-white p-6">
      <SongsList />
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
    </div>
  );
};

<<<<<<< HEAD
export default SongsList;
=======
export default MusicPage;
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
