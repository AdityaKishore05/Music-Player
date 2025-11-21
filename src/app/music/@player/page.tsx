"use client";
<<<<<<< HEAD
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useMusic } from "../MusicContext";
=======
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const songs = [
  { id: 1, file: "/songs/kanye-cant-tell-me-nothing.mp3" },
  { id: 2, file: "/songs/kanye-runaway.mp3" },
  { id: 3, file: "/songs/kanye-i-wonder.mp3" },
  { id: 4, file: "/songs/kanye-bound-2.mp3" },
  { id: 5, file: "/songs/linkin-park-in-the-end.mp3" },
  { id: 6, file: "/songs/issam-hadal-ahbek.mp3" },
  { id: 7, file: "/songs/frank-sinatra-my-way.mp3" },
  { id: 8, file: "/songs/teddybears-punkrocker.mp3" },
  { id: 9, file: "/songs/tame-impala-let-it-happen.mp3" },
  { id: 10, file: "/songs/radiohead-let-down.mp3" },
  { id: 11, file: "/songs/a-ha-take-on-me.mp3" },
  { id: 12, file: "/songs/caramine-one-piece.mp3" },
  { id: 13, file: "/songs/lynyrd-skynyrd-free-bird.mp3" },
  { id: 14, file: "/songs/gorillaz-feel-good-inc.mp3" },
];
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const Player = () => {
<<<<<<< HEAD
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrev } =
    useMusic();
=======
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowRight") {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration,
            audioRef.current.currentTime + 5
          );
        }
      } else if (e.code === "ArrowLeft") {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(
            0,
            audioRef.current.currentTime - 5
          );
        }
      } else if (e.key === "n" || e.key === "N") {
        playNext();
      } else if (e.key === "p" || e.key === "P") {
        playPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlayPause, playNext, playPrev]);
=======
    const handleSongSelect = (event: CustomEvent<number>) => {
      setCurrentIndex(event.detail);
      setIsPlaying(true);
    };

    window.addEventListener("songSelect", handleSongSelect as EventListener);
    return () => {
      window.removeEventListener("songSelect", handleSongSelect as EventListener);
    };
  }, []);
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
<<<<<<< HEAD
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
        });
=======
        audioRef.current.play();
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
      } else {
        audioRef.current.pause();
      }
    }
<<<<<<< HEAD
  }, [isPlaying, currentSong]);
=======
  }, [isPlaying, currentIndex]);
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
      const progressPercent =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressPercent || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
<<<<<<< HEAD
      const newTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
      setCurrentTime(newTime);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-700 px-2 md:px-6 py-3 md:py-4 z-50">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        <audio
          ref={audioRef}
          src={currentSong.file}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
        />

        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={playPrev}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={20} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={togglePlayPause}
            className="text-white bg-red-600 p-2 md:p-3 rounded-full hover:bg-red-700 transition-colors shadow-md"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" className="md:w-6 md:h-6" /> : <Play size={20} fill="currentColor" className="md:w-6 md:h-6"/>}
          </button>
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{currentSong.title}</p>
          <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
        </div>

        <div className="w-full md:flex-1 flex items-center gap-2">
          <span className="text-gray-300 text-xs w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #dc2626 ${progress}%, #4b5563 ${progress}%)`,
              transition: "background 0.1s linear"
            }}
          />
          <span className="text-gray-300 text-xs w-10">
            {formatTime(duration)}
          </span>
        </div>
=======
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % songs.length;
    });
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + songs.length) % songs.length;
    });
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-[2%] lg:left-[22%] md:left-[32%] sm:left-[40%] left-[5%] right-[5%] bg-gray-800 p-4 flex flex-col items-center rounded-md">
      {currentIndex !== null && (
        <audio
          ref={audioRef}
          src={songs[currentIndex].file}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
        />
      )}

      <div className="w-full flex items-center gap-2">
        <span className="text-gray-300 text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="flex-1"
        />
        <span className="text-gray-300 text-sm">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button onClick={playPrev} className="text-white">
          <SkipBack size={24} />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={playNext} className="text-white">
          <SkipForward size={24} />
        </button>
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
      </div>
    </div>
  );
};

export default Player;
