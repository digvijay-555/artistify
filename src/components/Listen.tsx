'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaHeart, FaVolumeDown, FaVolumeUp, FaVolumeOff, FaVolumeMute, FaFastForward, FaFastBackward } from 'react-icons/fa';
import { styled, Typography, Slider, Paper, Stack, Box } from '@mui/material';

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#18181a',
  padding: theme.spacing(2),
  borderRadius: '8px',
  position: 'relative',
  bottom: 0,
  width: '100%',
}));

const PSlider = styled(Slider)(() => ({
  color: '#5b5bd5',
  height: 2,
  '&:hover': {
    cursor: 'auto',
  },
  '& .MuiSlider-thumb': {
    width: '13px',
    height: '13px',
    // display: props.thumbless ? 'none' : 'block',
  }
}));

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
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(30);
  const [mute, setMute] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/api/getSongs');
        setSongs(response.data.songs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;
    }

    if (isPlaying) {
      const interval = setInterval(() => {
        const _duration = Math.floor(audioPlayer.current?.duration || 0);
        const _elapsed = Math.floor(audioPlayer.current?.currentTime || 0);

        setDuration(_duration);
        setElapsed(_elapsed);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [volume, isPlaying]);

  const handlePlayPause = (songCid: string) => {
    if (currentSong === songCid && isPlaying) {
      audioPlayer.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(songCid);
      audioPlayer.current?.play();
      setIsPlaying(true);
    }
  };

  const handleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const newLikedSongs = new Set(prev);
      if (newLikedSongs.has(songId)) {
        newLikedSongs.delete(songId);
      } else {
        newLikedSongs.add(songId);
      }
      return newLikedSongs;
    });
  };

  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
      const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

      return `${minutes}:${seconds}`;
    }
    return '00:00';
  };

  return (
    <div className="w-full min-h-screen bg-[#18181a] text-white p-8">
      <h1 className="text-3xl font-semibold mb-8">Listen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="bg-[#232328] p-4 rounded-lg shadow-md relative">
            <img src={`https://ipfs.infura.io/ipfs/${song.thumbnail}`} alt={song.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold">{song.name}</h2>
            {/* <p className="text-gray-400">{song.user.userInfo.name}</p> */}
            <div className="flex items-center justify-center gap-12 mt-4">
              <button onClick={() => handlePlayPause(song.songCid)} className="text-[] flex items-center gap-2">
                {currentSong === song.songCid && isPlaying ? <FaPause /> : <FaPlay />}
                {currentSong === song.songCid && isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => handleLike(song.id)}
                className={`flex items-center gap-2 transition-colors duration-300 ${likedSongs.has(song.id) ? 'text-red-500' : 'text-gray-500'}`}
              >
                <FaHeart />
                Like
              </button>
            </div>
            {currentSong === song.songCid && (
              <CustomPaper>
                <audio src={`https://ipfs.infura.io/ipfs/${song.songCid}`} ref={audioPlayer} muted={mute} autoPlay />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Stack direction='row' spacing={1}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      width: '25%',
                      alignItems: 'center'
                    }}
                  >
                    <VolumeBtns volume={volume} setVolume={setVolume} mute={mute} setMute={setMute} />

                    <PSlider min={0} max={100} value={volume}
                      onChange={(e, v) => setVolume(v as number)}
                    />
                  </Stack>

                  <Stack direction='row' spacing={1}
                    sx={{
                      display: 'flex',
                      width: '40%',
                      alignItems: 'center'
                    }}>
                    <FaFastBackward style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => audioPlayer.current!.currentTime -= 10} />

                    {!isPlaying
                      ? <FaPlay fontSize={'large'} style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => { audioPlayer.current!.play(); setIsPlaying(true); }} />
                      : <FaPause fontSize={'large'} style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => { audioPlayer.current!.pause(); setIsPlaying(false); }} />
                    }

                    <FaFastForward style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => audioPlayer.current!.currentTime += 10} />
                  </Stack>

                  <Stack sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }} />
                </Box>
                <Stack spacing={1} direction='row' sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography sx={{ color: 'white' }}>{formatTime(elapsed)}</Typography>
                  <PSlider sx={{color:'#5b5bd5'}} value={elapsed} max={duration} />
                  <Typography sx={{ color: 'white' }}>{formatTime(duration - elapsed)}</Typography>
                </Stack>
              </CustomPaper>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface VolumeBtnsProps {
  volume: number;
  setVolume: (volume: number) => void;
  mute: boolean;
  setMute: (mute: boolean) => void;
}

function VolumeBtns({ volume, mute, setMute }: VolumeBtnsProps) {
  return mute
    ? <FaVolumeOff style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => setMute(!mute)} />
    : volume <= 20 ? <FaVolumeMute style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => setMute(!mute)} />
      : volume <= 75 ? <FaVolumeDown style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => setMute(!mute)} />
        : <FaVolumeUp style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} onClick={() => setMute(!mute)} />
}

export default Listen;