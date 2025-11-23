"use client";

import Link from "next/link";
import React from "react";
import { Play, Music, Headphones, Radio } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-red-500 selection:text-white font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/40 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>

      {/* Navbar (Simple) */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
            <Music size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sonic<span className="text-red-500">Flow</span></span>
        </div>
        <Link href="/music">
            <button className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-sm font-medium transition-all cursor-pointer">
                Sign In
            </button>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        
        {/* Floating Icons (Decorative) */}
        <div className="absolute top-1/4 left-1/4 md:left-1/5 animate-bounce duration-[3000ms] opacity-50 hidden md:block">
            <Headphones size={32} className="text-purple-400" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 md:right-1/5 animate-bounce duration-[4000ms] delay-700 opacity-50 hidden md:block">
            <Radio size={32} className="text-red-400" />
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
            Feel the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-gradient-x">Rhythm</span>. <br />
            Live the <span className="text-white">Music</span>.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience sound like never before with our immersive, high-fidelity player. 
            Curate your vibe, discover new tracks, and let the music flow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/music">
              <button className="group relative cursor-pointer px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 flex items-center gap-3">
                <span className="relative z-10">Start Listening</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                    <Play size={16} fill="currentColor" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer / Bottom Bar */}
      <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 SonicFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
