import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "0x01_AUDIO.SYS",
    artist: "PROC_01",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_cyber_pulse.ogg"
  },
  {
    id: 2,
    title: "0x02_KERNEL.PANIC",
    artist: "PROC_02",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_drone_loop.ogg"
  },
  {
    id: 3,
    title: "0x03_NULL.PTR",
    artist: "PROC_03",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_machine_room.ogg"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full bg-dark-bg p-4 flex flex-col gap-4 font-pixel text-xs">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        loop={false}
      />
      
      <div className="flex justify-between items-start border-b border-cyan pb-2">
        <div className="flex flex-col gap-1 overflow-hidden">
          <h3 className="text-magenta font-bold truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-cyan text-[10px]">SRC: {currentTrack.artist}</p>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 text-cyan hover:bg-magenta hover:text-dark-bg transition-none border border-cyan"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className="w-full h-2 bg-dark-bg border border-magenta relative">
        <div 
          className="h-full bg-cyan"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={prevTrack}
          className="p-2 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg transition-none"
        >
          <SkipBack size={16} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-3 border-2 border-magenta text-magenta hover:bg-magenta hover:text-dark-bg transition-none flex items-center justify-center"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="p-2 border border-cyan text-cyan hover:bg-cyan hover:text-dark-bg transition-none"
        >
          <SkipForward size={16} />
        </button>
      </div>
      
      <div className="text-center text-[8px] text-magenta mt-2">
        [AUDIO_STREAM_ACTIVE]
      </div>
    </div>
  );
}
