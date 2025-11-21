import { ReactNode } from "react";
import Sidebar from "./@sidebar/page";
import { MusicProvider } from "./MusicContext";

export default function MusicLayout({
  sidebar,
<<<<<<< HEAD
  children,
  player,
}: {
  sidebar: ReactNode;
  children: ReactNode;
=======
  songs,
  player,
}: {
  sidebar: ReactNode;
  songs: ReactNode;
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
  player: ReactNode;
}) {
  return (
    <MusicProvider>
      <div className="flex bg-gray-900 h-screen overflow-hidden">
        {/* Sidebar slot */}
        <div className="fixed top-0 left-0 h-full w-64">
          {sidebar || <Sidebar />}
        </div>

<<<<<<< HEAD
        {/* Main Content (Songs or Playlist) */}
        <div className="flex-1 overflow-y-auto sm:ml-64">
          {children}
=======
        {/* Songs or children */}
        <div className="flex-1 overflow-y-auto sm:ml-64">
          {songs}
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
        </div>

        {/* Player at bottom */}
        <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700">
          {player}
        </div>
      </div>
    </MusicProvider>
  );
}
