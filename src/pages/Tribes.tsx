import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TribesProps {
  tribes: Array<{
    tribe_id: number;
    name: string;
    attributes: {
      'tribe-ThumbnailImage': {
        attribute_value: {
          value: string;
        };
      };
      'tribe-Regions': {
        attribute_value: {
          value: string[];
        };
      };
      'tribe-PopulationInNumbers': {
        attribute_value: {
          value: string;
        };
      };
    };
  }>;
}

const Tribes = ({ tribes }: TribesProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FFFF] to-white pb-20">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-[#165263]" />
          </Link>
          <h1 className="text-[#165263] text-xl font-semibold tracking-tight">Tribes of Arunachal</h1>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-4 animate-fade-in max-w-2xl mx-auto">
        {tribes.map((tribe) => (
          <Link
            key={tribe.tribe_id}
            to={`/tribes/${tribe.name.toLowerCase()}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={tribe.attributes['tribe-ThumbnailImage'].attribute_value.value}
                alt={tribe.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold mb-2 text-lg">
                {tribe.name.replace(' Tribe', '')}
              </h3>
              <div className="flex items-center text-white/90 text-sm mb-3">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {tribe.attributes['tribe-PopulationInNumbers']?.attribute_value.value || 'N/A'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tribes;