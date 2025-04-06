import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TranslatableText } from './TranslatableText';

interface CuisineCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  preparationTime: string;
}

const CuisineCard = ({ id, title, description, image, preparationTime }: CuisineCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cuisine/${id}`);
  };

  return (
    <div 
      className="flex-none w-[280px] mr-4 last:mr-0 cursor-pointer" 
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all">
        <div className="relative h-[180px]">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-xs">
              ⏱️ <TranslatableText text={preparationTime} />
            </p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[#165263] font-semibold text-lg mb-2 line-clamp-1">
            <TranslatableText text={title} />
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            <TranslatableText text={description} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default CuisineCard