import { ReactNode } from "react";
import Sidebar from "./@sidebar/page";
import { MusicProvider } from "./MusicContext";

export default function MusicLayout({
  sidebar,
  songs,
  player,
}: {
  sidebar: ReactNode;
  songs: ReactNode;
  player: ReactNode;
}) {
  return (
    <MusicProvider>
      <div className="flex bg-gray-900 h-screen overflow-hidden">
        {/* Sidebar slot */}
        <div className="fixed top-0 left-0 h-full w-64">
          {sidebar || <Sidebar />}
        </div>

        {/* Songs or children */}
        <div className="flex-1 overflow-y-auto sm:ml-64">
          {songs}
        </div>

        {/* Player at bottom */}
        <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700">
          {player}
        </div>
      </div>
    </MusicProvider>
  );
}
