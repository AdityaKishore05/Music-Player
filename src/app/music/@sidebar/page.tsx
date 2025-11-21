"use client";
import { Heart, Home } from "lucide-react";
import React from "react";
import { useMusic } from "../MusicContext";
import Link from "next/link";

const Sidebar = () => {
  const { favourites } = useMusic();

  return (
    <aside className="w-60 bg-[#ec0000] text-white sm:flex flex-col h-screen fixed left-0 top-0 hidden p-2">
      <section className="mb-2">
        <h2 className=" mt-1 flex justify-center mr-4 text-3xl font-bold mb-6">
          MENU
        </h2>
        <Link href={"/music"}>
          <nav>
            <ul className="flex flex-col gap-2">
              <li className="flex gap-3 items-center hover:bg-gray-900 rounded-md cursor-pointer text-lg p-2 transition mb-2">
                <Home /> Discover
              </li>
            </ul>
          </nav>
        </Link>
      </section>

      <section className="flex-1 overflow-y-auto px-2 pb-4">
        <h2 className="flex gap-3 items-center text-lg mb-3">
          <Heart /> Favourites
        </h2>
        <ul className="space-y-3">
          {favourites.length === 0 && (
            <p className="text-gray-300 text-sm px-2">No favourites yet</p>
          )}
          {favourites.map(
            (
              song
            ) => (
              <Link
                key={song.id}
                href={`/music/${song.id}`}
                className="flex gap-3 items-center hover:bg-gray-900 rounded-md cursor-pointer px-2 py-2 transition"
              >
                <img
                  src="https://picfiles.alphacoders.com/462/462928.jpg"
                  className="h-10 w-10 rounded-md"
                  alt={song.title}
                />
                <div>
                  <p className="text-white text-sm font-medium">{song.title}</p>
                  <p className="text-white text-xs font-serif">{song.artist}</p>
                </div>
              </Link>
            )
          )}
        </ul>
      </section>
    </aside>
  );
};
export default Sidebar;
