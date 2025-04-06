import React from 'react';
import { Play } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

interface Song {
  id: number;
  title: string;
  file_path: string;
  thumbnail_path: string;
  artist?: string;
  tribe?: {
    name: string;
  };
}

interface MusicCardProps {
  id: number;
  title: string;
  thumbnail: string;
  audioUrl: string;
  artist?: string;
  onPlay: (song: Song) => void;
}

const MusicCard = ({ id, title, thumbnail, audioUrl, artist, onPlay }: MusicCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPlay({
      id,
      title,
      file_path: audioUrl,
      thumbnail_path: thumbnail,
      artist,
    });
  };

  return (
    <div className="flex-none w-[140px] mr-4 last:mr-0">
      <div onClick={handleClick} className="block cursor-pointer">
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-[140px] object-cover rounded-lg shadow-md"
          />
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#5DA9B7] rounded-full flex items-center justify-center shadow-lg">
            <Play size={16} className="text-white ml-0.5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium text-[#165263] line-clamp-1">
            <TranslatableText text={title} />
          </h3>
          {artist && (
            <p className="text-xs text-[#5DA9B7] mt-0.5 line-clamp-1">
              <TranslatableText text={artist} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicCard;