import type { ReactNode } from "react";
import Sidebar from "./@sidebar/page";
import { MusicProvider } from "./MusicContext";

// @ts-ignore: Ignore Next.js LayoutProps type mismatch
export default function MusicLayout(
  {
    children,
    sidebar,
    songs,
    player,
  }: {
    children: ReactNode;
    sidebar: ReactNode;
    songs: ReactNode;
    player: ReactNode;
  },
  // @ts-ignore: context is required by Next.js but unused here
  _context: unknown
) {
  return (
    <MusicProvider>
      <div className="flex bg-gray-900 h-screen overflow-hidden">
        {/* Sidebar slot */}
        <div className="fixed top-0 left-0 h-full w-64">
          {sidebar || <Sidebar />}
        </div>

        {/* Songs or children */}
        <div className="flex-1 overflow-y-auto sm:ml-64">
          {songs || children}
        </div>

        {/* Player at bottom */}
        <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700">
          {player}
        </div>
      </div>
    </MusicProvider>
  );
}
