import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TranslatableText } from './TranslatableText';

interface VideoCardProps {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

const VideoCard = ({ id, title, thumbnail, videoUrl }: VideoCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex-none w-[160px] mr-4 last:mr-0 cursor-pointer" 
      onClick={() => navigate(`/video/${id}`)}
    >
      <div className="block">
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-[90px] object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors rounded-lg">
            <Play size={24} className="text-white" />
          </div>
        </div>
        <h3 className="mt-2 text-sm font-medium text-[#165263] line-clamp-2">
          <TranslatableText text={title} />
        </h3>
      </div>
    </div>
  );
}

export default VideoCard;