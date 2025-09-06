"use client";
import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { usePlayer } from "@/app/music/@context/PlayerContext";
import { useMusic } from "../MusicContext";

const songs = [
  {
    id: 1,
    artist: "Kanye West",
    title: "Can't Tell Me Nothing",
    time: "4:32",
    file: "/songs/kanye-cant-tell-me-nothing.mp3",
  },
  {
    id: 2,
    artist: "Kanye West",
    title: "Runaway",
    time: "9:08",
    file: "/songs/kanye-runaway.mp3",
  },
  {
    id: 3,
    artist: "Kanye West",
    title: "I Wonder",
    time: "4:03",
    file: "/songs/kanye-i-wonder.mp3",
  },
  {
    id: 4,
    artist: "Kanye West",
    title: "Bound 2",
    time: "3:49",
    file: "/songs/kanye-bound-2.mp3",
  },
  {
    id: 5,
    artist: "Linkin Park",
    title: "In The End",
    time: "3:36",
    file: "/songs/linkin-park-in-the-end.mp3",
  },
  {
    id: 6,
    artist: "Issam Alnajjar",
    title: "Hadal Ahbek",
    time: "3:45",
    file: "/songs/issam-hadal-ahbek.mp3",
  },
  {
    id: 7,
    artist: "Frank Sinatra",
    title: "My Way",
    time: "4:35",
    file: "/songs/frank-sinatra-my-way.mp3",
  },
  {
    id: 8,
    artist: "Teddybears",
    title: "Punkrocker",
    time: "3:38",
    file: "/songs/teddybears-punkrocker.mp3",
  },
  {
    id: 9,
    artist: "Tame Impala",
    title: "Let It Happen",
    time: "7:47",
    file: "/songs/tame-impala-let-it-happen.mp3",
  },
  {
    id: 10,
    artist: "Radiohead",
    title: "Let Down",
    time: "4:59",
    file: "/songs/radiohead-let-down.mp3",
  },
  {
    id: 11,
    artist: "a-ha",
    title: "Take On Me",
    time: "3:48",
    file: "/songs/a-ha-take-on-me.mp3",
  },
  {
    id: 12,
    artist: "Caramine",
    title: "One Piece",
    time: "3:12",
    file: "/songs/caramine-one-piece.mp3",
  },
  {
    id: 13,
    artist: "Lynyrd Skynyrd",
    title: "Free Bird",
    time: "9:07",
    file: "/songs/lynyrd-skynyrd-free-bird.mp3",
  },
  {
    id: 14,
    artist: "Gorillaz",
    title: "Feel Good Inc.",
    time: "3:41",
    file: "/songs/gorillaz-feel-good-inc.mp3",
  },
];

const SongsList = () => {
  const { setCurrentSong } = usePlayer();
  const { favourites, toggleFavourite } = useMusic();

  const isFavourite = (id: number) =>
    favourites.some((fav: any) => fav.id === id);

  return (
    <div className="w-[96%] mx-auto px-2 pb-24">
      <h2 className="text-3xl text-white my-3 font-bold mb-10">
        Songs Collection
      </h2>
      <ul className="space-y-4">
        {songs.map((song) => (
          <li
            key={song.id}
            className="flex justify-between items-center hover:bg-[#ec0000] rounded-md cursor-pointer text-lg hover:py-2 sm:px-4 my-4 duration-200 transition-all ease-in-out hover:text-amber-300"
          >
            <Link
              href={`/music/${song.id}`}
              onClick={() => setCurrentSong(song)}
              className="flex items-center gap-6 flex-1"
            >
              <img
                src="https://picfiles.alphacoders.com/462/462928.jpg"
                alt={song.title}
                className="h-16 w-16 rounded-md flex-shrink-0 object-cover"
              />
              <div>
                <p className="text-lg font-semibold text-white">{song.title}</p>
                <p className="text-sm text-gray-300">{song.artist}</p>
              </div>
            </Link>

            <div className="text-md font-medium text-white flex gap-3 items-center">
              <button
                onClick={() => toggleFavourite(song)}
                className="hover:text-amber-300"
              >
                {isFavourite(song.id) ? (
                  <Heart fill="currentColor" />
                ) : (
                  <Heart />
                )}
              </button>
              {song.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongsList;
