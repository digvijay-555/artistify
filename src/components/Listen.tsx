'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  songCid: string;
  length: number;
  user: {
    userInfo: {
      name: string;
      profilePicture: string;
    };
  };
}

const Listen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/getSongs');
      setSongs(response.data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError('Failed to load songs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handlePlayPause = useCallback((songCid: string) => {
    if (currentSong === songCid && isPlaying) {
      audioPlayer.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(songCid);
      setIsPlaying(true);
      // Use a slight delay to ensure audio element is ready
      setTimeout(() => {
        audioPlayer.current?.play();
      }, 100);
    }
  }, [currentSong, isPlaying]);

  const handleLike = useCallback((songId: string) => {
    setLikedSongs((prev) => {
      const newLikedSongs = new Set(prev);
      if (newLikedSongs.has(songId)) {
        newLikedSongs.delete(songId);
      } else {
        newLikedSongs.add(songId);
      }
      return newLikedSongs;
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-lg">Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={fetchSongs}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-semibold mb-8">Listen</h1>
        <p className="text-gray-400 mb-6">{songs.length} songs available</p>
        
        {songs.length === 0 ? (
          <div className="flex items-center justify-center pt-20">
            <p className="text-gray-400 text-lg">No songs available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {songs.map((song) => (
            <div key={song.id} className="bg-[#131316] p-4 rounded-lg shadow-md relative hover:bg-[#1a1a1f] transition-colors">
              <img 
                src={`https://ipfs.infura.io/ipfs/${song.thumbnail}`} 
                alt={song.name} 
                className="w-full h-40 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <h2 className="text-xl font-semibold">{song.name}</h2>
              <div className="flex items-center justify-center gap-12 mt-4">
                <button 
                  onClick={() => handlePlayPause(song.songCid)} 
                  className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {currentSong === song.songCid && isPlaying ? <FaPause /> : <FaPlay />}
                  {currentSong === song.songCid && isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => handleLike(song.id)}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    likedSongs.has(song.id) ? 'text-orange-500' : 'text-gray-400 hover:text-orange-400'
                  }`}
                >
                  <FaHeart />
                  Like
                </button>
              </div>
              
              {/* Audio element for currently playing song */}
              {currentSong === song.songCid && (
                <audio 
                  ref={audioPlayer}
                  src={`https://ipfs.infura.io/ipfs/${song.songCid}`}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => {
                    setIsPlaying(false);
                    console.error('Error playing audio');
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default React.memo(Listen);