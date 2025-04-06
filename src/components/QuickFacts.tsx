import React from 'react';
import { PartyPopper, Music, Users, Sparkles } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

interface QuickFactsProps {
  counts: {
    active_festivals: number;
    active_folk_dance: number;
    active_folk_music: number;
    total_tribes: number;
  };
}

const QuickFacts = ({ counts }: QuickFactsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <div className="flex items-center gap-2 mb-3">
          <PartyPopper className="w-5 h-5 text-[#FF6B6B]" />
          <h3 className="text-[#165263] font-semibold text-sm uppercase tracking-wide">
            <TranslatableText text="Festivals" />
          </h3>
        </div>
        <p className="text-3xl font-bold text-[#FF6B6B]">{counts.active_festivals}</p>
      </div>
      <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#4ECDC4]" />
          <h3 className="text-[#165263] font-semibold text-sm uppercase tracking-wide">
            <TranslatableText text="Folk Dance" />
          </h3>
        </div>
        <p className="text-3xl font-bold text-[#4ECDC4]">{counts.active_folk_dance}</p>
      </div>
      <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-[#45B7D1]" />
          <h3 className="text-[#165263] font-semibold text-sm uppercase tracking-wide">
            <TranslatableText text="Folk Music" />
          </h3>
        </div>
        <p className="text-3xl font-bold text-[#45B7D1]">{counts.active_folk_music}</p>
      </div>
      <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-[#96CEB4]" />
          <h3 className="text-[#165263] font-semibold text-sm uppercase tracking-wide">
            <TranslatableText text="Total Tribes" />
          </h3>
        </div>
        <p className="text-3xl font-bold text-[#96CEB4]">{counts.total_tribes}</p>
      </div>
    </div>
  );
};

export default QuickFacts