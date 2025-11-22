"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; //  <-- FIX
import {
  ArrowLeft,
  Play,
  Trash2,
  GripVertical,
  Camera,
  Heart,
} from "lucide-react";
import { useMusic, Song } from "../../MusicContext";
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

const SortablePlaylistSongItem = ({
  song,
  index,
  playlistId,
  playSong,
  playlistSongs,
  removeFromPlaylist,
  toggleFavourite,
  favourites,
}: {
  song: Song;
  index: number;
  playlistId: string;
  playSong: (song: Song, contextSongs: Song[]) => void;
  playlistSongs: Song[];
  removeFromPlaylist: (playlistId: string, songId: number) => void;
  toggleFavourite: (song: Song) => void;
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
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center hover:bg-white/10 rounded-md p-2 group transition-colors bg-gray-900/40 mb-1"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white"
        >
          <GripVertical size={16} />
        </div>

        <div
          className="flex items-center gap-4 flex-1 cursor-pointer"
          onClick={() => playSong(song, playlistSongs)}
        >
          <span className="text-gray-400 w-6 text-center group-hover:hidden">
            {index + 1}
          </span>
          <Play
            size={16}
            className="text-white w-6 hidden group-hover:block"
            fill="currentColor"
          />

          <img
            src="https://picfiles.alphacoders.com/462/462928.jpg"
            alt={song.title}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="text-white font-medium">{song.title}</p>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{song.time}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(song);
          }}
          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title={
            favourites.find((f) => f.id === song.id)
              ? "Remove from favourites"
              : "Add to favourites"
          }
        >
          <Heart
            size={18}
            fill={
              favourites.find((f) => f.id === song.id) ? "currentColor" : "none"
            }
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFromPlaylist(playlistId, song.id);
          }}
          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove from playlist"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
};

const PlaylistPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = useParams();
  const {
    playlists,
    playSong,
    removeFromPlaylist,
    reorderPlaylist,
    updatePlaylistImage,
    toggleFavourite,
    favourites,
  } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playlist = playlists.find((p) => p.id === id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && playlist) {
      const oldIndex = playlist.songs.findIndex((s) => s.id === active.id);
      const newIndex = playlist.songs.findIndex((s) => s.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderPlaylist(
          playlist.id,
          arrayMove(playlist.songs, oldIndex, newIndex)
        );
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && playlist) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePlaylistImage(playlist.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!playlist) {
    return (
      <div className="text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Playlist not found</h2>
        <Link
          href="/music"
          className="text-red-500 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[96%] mx-auto px-2 pb-32 pt-6">
      <div className="mb-8">
        <Link
          href="/music"
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="flex items-end gap-6">
          <div
            className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-900 rounded-md shadow-lg flex items-center justify-center relative group cursor-pointer overflow-hidden"
            onClick={handleImageClick}
          >
            {playlist.image ? (
              <img
                src={playlist.image}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {playlist.name.charAt(0)}
              </span>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={32} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white uppercase tracking-wider">
              Playlist
            </p>
            <h1 className="text-5xl font-bold text-white mb-4">
              {playlist.name}
            </h1>
            <p className="text-gray-300">{playlist.songs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4">
        {playlist.songs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>This playlist is empty.</p>
            <Link
              href="/music"
              className="text-red-500 hover:underline mt-2 inline-block"
            >
              Find songs to add
            </Link>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={playlist.songs.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {playlist.songs.map((song, index) => (
                  <SortablePlaylistSongItem
                    key={song.id}
                    song={song}
                    index={index}
                    playlistId={playlist.id}
                    playSong={playSong}
                    playlistSongs={playlist.songs}
                    removeFromPlaylist={removeFromPlaylist}
                    toggleFavourite={toggleFavourite}
                    favourites={favourites}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
