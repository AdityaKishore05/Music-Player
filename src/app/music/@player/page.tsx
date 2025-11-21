"use client";
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

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const Player = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleSongSelect = (event: CustomEvent<number>) => {
      setCurrentIndex(event.detail);
      setIsPlaying(true);
    };

    window.addEventListener("songSelect", handleSongSelect as EventListener);
    return () => {
      window.removeEventListener("songSelect", handleSongSelect as EventListener);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

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
      </div>
    </div>
  );
};

export default Player;
