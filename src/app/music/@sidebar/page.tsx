"use client";
import {
  Heart,
  Home,
  Library,
  Plus,
  ListMusic,
  Search,
  GripVertical,
} from "lucide-react";
import React, { useState } from "react";
import { useMusic, Song, Playlist } from "../MusicContext";
import Link from "next/link";
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

// Sortable Favourite Song Item
const SortableFavouriteSong = ({
  song,
  playSong,
  favourites,
}: {
  song: Song;
  playSong: (song: Song, contextSongs: Song[]) => void;
  favourites: Song[];
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 items-center border border-transparent hover:border-red-500 rounded-md cursor-pointer px-2 py-1 transition group"
      onClick={() => playSong(song, favourites)}
    >
      <img
        src="https://picfiles.alphacoders.com/462/462928.jpg"
        className="h-8 w-8 rounded-md object-cover shadow-sm flex-shrink-0 group-hover:text-amber-300"
        alt={song.title}
      />
      <div className="overflow-hidden min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">{song.title}</p>
        <p className="text-white/80 text-xs truncate">{song.artist}</p>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </div>
    </div>
  );
};

// Sortable Playlist Item
const SortablePlaylistItem = ({ playlist }: { playlist: Playlist }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: playlist.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Link
      ref={setNodeRef}
      style={style}
      href={`/music/playlist/${playlist.id}`}
      className="flex gap-3 items-center hover:bg-black/20 rounded-md cursor-pointer px-2 py-2 transition group border border-transparent hover:border-red-500"
    >
      <div className="h-8 w-8 rounded-md bg-red-900 flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <ListMusic size={16} />
      </div>
      <div className="overflow-hidden min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">
          {playlist.name}
        </p>
        <p className="text-white/80 text-xs truncate">
          {playlist.songs.length} songs
        </p>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const {
    favourites,
    playlists,
    createPlaylist,
    playSong,
    reorderFavourites,
    reorderPlaylist,
  } = useMusic();
  const [favSearch, setFavSearch] = useState("");
  const [libSearch, setLibSearch] = useState("");

  const handleCreatePlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) {
      createPlaylist(name);
    }
  };

  const filteredFavourites = favourites.filter(
    (s) =>
      s.title.toLowerCase().includes(favSearch.toLowerCase()) ||
      s.artist.toLowerCase().includes(favSearch.toLowerCase())
  );

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(libSearch.toLowerCase())
  );

  const favSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const playlistSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFavDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = favourites.findIndex((s) => s.id === active.id);
      const newIndex = favourites.findIndex((s) => s.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFavourites(arrayMove(favourites, oldIndex, newIndex));
      }
    }
  };

  const handlePlaylistDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = playlists.findIndex((p) => p.id === active.id);
      const newIndex = playlists.findIndex((p) => p.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        // We need a reorderPlaylists function in context
        const newOrder = arrayMove(playlists, oldIndex, newIndex);
        // For now, we'll need to add this to context
        // reorderPlaylists(newOrder);
      }
    }
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-black text-white h-screen fixed left-0 top-0 z-40 overflow-hidden">
      {/* Fixed Header Section */}
      <section className="p-4 pb-2 flex-shrink-0">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          Music App
        </h2>
        <nav>
          <ul className="flex flex-col gap-2">
            <Link href={"/music"}>
              <li className="flex gap-3 items-center hover:bg-black/20 rounded-md cursor-pointer text-lg p-2 transition font-medium">
                <Home size={22} /> Discover
              </li>
            </Link>
          </ul>
        </nav>
      </section>

      {/* Favourites Section (Scrollable) - Increased height */}
      <section className="flex-[1.2] flex flex-col min-h-0 px-4 pb-2 border-b border-red-800/50">
        <div className="flex-shrink-0 mb-2">
          <h2 className="flex gap-3 items-center text-lg mb-2 font-semibold opacity-90">
            <Heart size={20} /> Favourites
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-2 text-red-200" />
            <input
              type="text"
              placeholder="Search favourites..."
              className="w-full bg-red-900/50 text-white text-xs rounded-md pl-7 pr-2 py-1.5 focus:outline-none focus:bg-red-900 placeholder-red-300"
              value={favSearch}
              onChange={(e) => setFavSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent pr-1">
          {filteredFavourites.length === 0 && (
            <p className="text-white/60 text-sm px-2 italic mt-2">
              {favourites.length === 0 ? "No favourites yet" : "No matches"}
            </p>
          )}
          <DndContext
            sensors={favSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFavDragEnd}
          >
            <SortableContext
              items={filteredFavourites.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {filteredFavourites.map((song) => (
                  <SortableFavouriteSong
                    key={song.id}
                    song={song}
                    playSong={playSong}
                    favourites={favourites}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>

      {/* Library Section (Scrollable) - Increased height */}
      <section className="flex-[1.2] flex flex-col min-h-0 px-4 pt-4 pb-4">
        <div className="flex-shrink-0 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="flex gap-3 items-center text-lg font-semibold opacity-90">
              <Library size={20} /> Your Library
            </h2>
            <button
              onClick={handleCreatePlaylist}
              className="hover:bg-black/20 p-1 rounded-full transition cursor-pointer"
              title="Create Playlist"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-2 text-red-200" />
            <input
              type="text"
              placeholder="Search playlists..."
              className="w-full bg-red-900/50 text-white text-xs rounded-md pl-7 pr-2 py-1.5 focus:outline-none focus:bg-red-900 placeholder-red-300"
              value={libSearch}
              onChange={(e) => setLibSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent pr-1">
          {filteredPlaylists.length === 0 && (
            <p className="text-white/60 text-sm px-2 italic mt-20">
              {playlists.length === 0
                ? "Create your first playlist"
                : "No matches"}
            </p>
          )}
          <DndContext
            sensors={playlistSensors}
            collisionDetection={closestCenter}
            onDragEnd={handlePlaylistDragEnd}
          >
            <SortableContext
              items={filteredPlaylists.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="">
                {filteredPlaylists.map((playlist) => (
                  <SortablePlaylistItem key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>
    </aside>
  );
};
export default Sidebar;
