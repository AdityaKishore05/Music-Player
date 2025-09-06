import React, { ReactNode } from "react";
import Sidebar from "./@sidebar/page";
import { MusicProvider } from "./MusicContext";

const MusicLayout = ({
  player,
  songs,
}: {
  children: ReactNode;
  player: ReactNode;
  songs: ReactNode;
}) => {
  return (
    <MusicProvider>
      <div className="flex bg-gray-900 h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto sm:ml-64">{songs}</div>
        <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700">
          {player}
        </div>
      </div>
    </MusicProvider>
  );
};

export default MusicLayout;
