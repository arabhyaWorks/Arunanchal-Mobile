import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, MoreVertical, Minimize2, Maximize2, Repeat, Shuffle, Heart } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

interface AudioPlayerProps {
  song: {
    id: number;
    title: string;
    file_path: string;
    thumbnail_path: string;
    tribe?: {
      name: string;
    };
  } | null;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ song, onClose, isMinimized, onToggleMinimize }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('mediaSession' in navigator && song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.tribe?.name || 'Unknown Artist',
        artwork: [
          {
            src: song.thumbnail_path || 'https://arunachal.upstateagro.com/logo_ap.png',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
        setIsPlaying(true);
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (audioRef.current) {
          const newTime = Math.max(audioRef.current.currentTime - 10, 0);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      });

      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (audioRef.current) {
          const newTime = Math.min(audioRef.current.currentTime + 10, duration);
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      });
    }
  }, [song, duration]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Playback error:', error);
        setIsPlaying(false);
      }); 
    } else {
      audioRef.current.pause();
    }
  }, [isMinimized, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      
      // Update media session position state
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: audioRef.current.duration,
          position: audioRef.current.currentTime,
          playbackRate: audioRef.current.playbackRate,
        });
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const pos = Math.max(0, Math.min(1, clickPosition));
      audioRef.current.currentTime = pos * audioRef.current.duration;
      setCurrentTime(pos * audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!song) return null;

  const minimizedPlayer = (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 bg-gradient-to-br from-[#165263] to-[#0e7b90] rounded-xl shadow-lg p-3 z-50">
      <div className="flex items-center gap-3">
        <img
          src={song.thumbnail_path}
          alt={song.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">
            <TranslatableText text={song.title} />
          </h4>
          {song.tribe && (
            <p className="text-sm text-white/70 truncate">
              <TranslatableText text={song.tribe.name} />
            </p>
          )}
        </div>
        <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full">
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
        <button onClick={onToggleMinimize} className="p-2 hover:bg-white/10 rounded-full">
          <Maximize2 className="w-6 h-6 text-white" />
        </button>
      </div>
      <div 
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="mt-2 h-1 bg-white/20 rounded-full cursor-pointer"
      >
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );

  const fullPlayer = (
    <div className="fixed inset-0 bg-gradient-to-b from-[#165263] to-[#0e7b90] z-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-6 py-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between text-white/90 mb-12">
          <button onClick={onToggleMinimize} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Minimize2 className="w-6 h-6" />
          </button>
          <h2 className="text-base font-medium">
            <TranslatableText text="Now Playing" />
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Menu">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center mb-12">
          <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={song.thumbnail_path}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Song Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h3 className="text-white text-xl font-semibold mb-1">
              <TranslatableText text={song.title} />
            </h3>
            {song.tribe && (
              <p className="text-white/70 text-sm">
                <TranslatableText text={song.tribe.name} />
              </p>
            )}
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="h-1.5 bg-white/20 rounded-full cursor-pointer relative"
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              <div 
                className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                style={{ transform: 'translate(50%, -50%)' }}
              />
            </div>
          </div>
          <div className="flex justify-between text-white/70 text-sm mt-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => setIsShuffling(!isShuffling)}
            className={`p-3 rounded-full ${
              isShuffling ? 'bg-white/20 text-white' : 'text-white/70'
            }`}
          >
            <Shuffle className="w-6 h-6" />
          </button>
          <button className="p-3 text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-8 h-8" />
          </button>
          <button
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-[#165263] hover:scale-105 transition-transform shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          <button className="p-3 text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-8 h-8" />
          </button>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-3 rounded-full ${
              isLooping ? 'bg-white/20 text-white' : 'text-white/70'
            }`}
          >
            <Repeat className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4">
          <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
            <Volume2 className="w-6 h-6" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>
      </div>

    </div>
  );

  return (
    <>
      {isMinimized ? minimizedPlayer : fullPlayer}
      <audio
        ref={audioRef}
        src={song.file_path}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio error:', e)}
      />
    </>
  );
};

export default AudioPlayer;