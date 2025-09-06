"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

const songs = [
  {
    id: 1,
    artist: "Kanye West",
    title: "Can't Tell Me Nothing",
    file: "/songs/kanye-cant-tell-me-nothing.mp3",
  },
  {
    id: 2,
    artist: "Kanye West",
    title: "Runaway",
    file: "/songs/kanye-runaway.mp3",
  },
  {
    id: 3,
    artist: "Kanye West",
    title: "I Wonder",
    file: "/songs/kanye-i-wonder.mp3",
  },
  {
    id: 4,
    artist: "Kanye West",
    title: "Bound 2",
    file: "/songs/kanye-bound-2.mp3",
  },
  {
    id: 5,
    artist: "Linkin Park",
    title: "In The End",
    file: "/songs/linkin-park-in-the-end.mp3",
  },
  {
    id: 6,
    artist: "Issam Alnajjar",
    title: "Hadal Ahbek",
    file: "/songs/issam-hadal-ahbek.mp3",
  },
  {
    id: 7,
    artist: "Frank Sinatra",
    title: "My Way",
    file: "/songs/frank-sinatra-my-way.mp3",
  },
  {
    id: 8,
    artist: "Teddybears",
    title: "Punkrocker",
    file: "/songs/teddybears-punkrocker.mp3",
  },
  {
    id: 9,
    artist: "Tame Impala",
    title: "Let It Happen",
    file: "/songs/tame-impala-let-it-happen.mp3",
  },
  {
    id: 10,
    artist: "Radiohead",
    title: "Let Down",
    file: "/songs/radiohead-let-down.mp3",
  },
  {
    id: 11,
    artist: "a-ha",
    title: "Take On Me",
    file: "/songs/a-ha-take-on-me.mp3",
  },
  {
    id: 12,
    artist: "Caramine",
    title: "One Piece",
    file: "/songs/caramine-one-piece.mp3",
  },
  {
    id: 13,
    artist: "Lynyrd Skynyrd",
    title: "Free Bird",
    file: "/songs/lynyrd-skynyrd-free-bird.mp3",
  },
  {
    id: 14,
    artist: "Gorillaz",
    title: "Feel Good Inc.",
    file: "/songs/gorillaz-feel-good-inc.mp3",
  },
];

const SongPage = () => {
  const params = useParams();
  const song = songs.find((s: any) => s.id === Number(params.id));

  useEffect(() => {
    if (song) {
      window.dispatchEvent(
        new CustomEvent("songSelect", { detail: song.id - 1 })
      );
    }
  }, [song]);

  if (!song) return <div className="text-white p-6">Song not found</div>;

  return (
    <div className="flex flex-col items-center pb-20 md:pr-12 px-5 justify-center h-full text-white">
      <h1 className="text-3xl font-bold">{song.title}</h1>
      <p className="text-gray-900">{song.artist}</p>
      <img
        src="https://picfiles.alphacoders.com/462/462928.jpg"
        alt="cover"
        className="mt-6 rounded-xl shadow-lg w-96"
      />
    </div>
  );
};

export default SongPage;
