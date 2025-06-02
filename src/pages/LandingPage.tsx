import React from 'react';
import { Button } from "../components/ui/button";
import {
  Play,
  Music,
  Zap,
  Search,
  Volume2,
  ChevronRight,
  Star,
  ArrowRight,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

export default function LandingPage() {
  const genres = ["Tech House", "EDM", "Drum & Bass", "Progressive House", "Techno", "Deep House", "Trance", "Dubstep"];

  const featuredSetlists = [
    {
      title: "John Summit @ Club Space Miami 2025",
      genre: "Tech House",
      duration: "2h 15m",
      tracks: 32,
    },
    {
      title: "Charlotte de Witte @ Tomorrowland 2024",
      genre: "Techno",
      duration: "1h 45m",
      tracks: 28,
    },
    {
      title: "Above & Beyond @ ABGT500",
      genre: "Trance",
      duration: "3h 00m",
      tracks: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SetPlanner</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#tools" className="text-gray-300 hover:text-white transition-colors">
                Tools
              </a>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Plan your next
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}DJ set with AI
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate perfect setlists and discover new music with our AI-powered platform
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Try SetPlanner Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Genre Selection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Popular Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((genre, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 text-center hover:from-purple-800/50 hover:to-pink-800/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">{genre}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Setlists */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Featured Setlists</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredSetlists.map((setlist, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-md text-sm">
                    {setlist.genre}
                  </span>
                  <Play className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{setlist.title}</h3>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>{setlist.duration}</span>
                  <span>{setlist.tracks} tracks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SetPlanner</span>
              </div>
              <p className="text-gray-400 text-sm">AI-powered set planning and music discovery for DJs.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} SetPlanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 