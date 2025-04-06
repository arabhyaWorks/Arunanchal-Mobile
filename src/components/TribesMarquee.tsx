import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

interface Tribe {
  tribe_id: number;
  name: string;
  attributes: {
    'tribe-ThumbnailImage': {
      attribute_value: {
        value: string;
      };
    };
  };
}

interface TribesMarqueeProps {
  tribes: Tribe[];
}

const TribesMarquee = ({ tribes }: TribesMarqueeProps) => {
  return (
    <div className="py-6 overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 mb-6">
        <h2 className="text-[#165263] text-xl font-semibold">
          <TranslatableText text="Tribes of Arunachal" />
        </h2>
        <Link to="/tribes" className="flex items-center text-[#5DA9B7] text-sm font-medium">
          <TranslatableText text="See All" />
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-scroll">
          {[...tribes, ...tribes].map((tribe, index) => (
            <Link
              key={`${tribe.tribe_id}-${index}`}
              to={`/tribes/${tribe.name.toLowerCase()}`}
              className="flex-none mx-4 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#5DA9B7] group-hover:border-[#165263] transition-colors">
                <img
                  src={tribe.attributes['tribe-ThumbnailImage'].attribute_value.value}
                  alt={tribe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm mt-2 text-[#165263] font-medium group-hover:text-[#5DA9B7] transition-colors">
                <TranslatableText text={tribe.name.replace(' Tribe', '')} />
              </p>
            </Link>
          ))}
        </div>
        <div className="flex animate-scroll" aria-hidden="true">
          {[...tribes, ...tribes].map((tribe, index) => (
            <Link
              key={`${tribe.tribe_id}-${index}-duplicate`}
              to={`/tribes/${tribe.name.toLowerCase()}`}
              className="flex-none mx-4 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#5DA9B7] group-hover:border-[#165263] transition-colors">
                <img
                  src={tribe.attributes['tribe-ThumbnailImage'].attribute_value.value}
                  alt={tribe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm mt-2 text-[#165263] font-medium group-hover:text-[#5DA9B7] transition-colors">
                <TranslatableText text={tribe.name.replace(' Tribe', '')} />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TribesMarquee