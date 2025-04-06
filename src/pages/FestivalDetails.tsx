import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Users, Clock, MapPin, PartyPopper, Share2, Image, Video, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

interface FestivalDetailsProps {
  festivals: Array<{
    id: number;
    name: string;
    description: string;
    tribe: string;
    date: string;
    duration: string;
    image: string;
    district: string;
  }>;
}

const FestivalDetails = ({ festivals }: FestivalDetailsProps) => {
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  console.log('Festivals data:', festivals);
  console.log('Current festival ID:', id);
  const festival = festivals.find(f => f.id === Number(id));
  console.log('Found festival:', festival);

  if (!festival) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="text-[#165263] text-xl">
          <TranslatableText text="Festival not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Hero Section with Image */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <img 
          src={festival.image || 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d'} 
          alt={festival.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Navigation Buttons */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <Link 
            to="/festivals" 
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Link>
          
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: festival.name,
                  text: festival.description,
                  url: window.location.href,
                });
              }
            }}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
          >
            <Share2 className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Festival Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">
            <TranslatableText text={festival.name} />
          </h1>
          <div className="flex items-center gap-2 text-white/90">
            <Users className="h-5 w-5" />
            <TranslatableText text={`${festival.tribe} Tribe`} />
          </div>
        </div>
      </div>

      {/* Festival Details */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#FF6B6B]" />
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Date" />
                </p>
                <p className="text-[#165263] font-medium">
                  <TranslatableText text={festival.date} />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-[#4ECDC4]" />
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Duration" />
                </p>
                <p className="text-[#165263] font-medium">
                  <TranslatableText text={festival.duration} />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-[#45B7D1]" />
              <div>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Location" />
                </p>
                <p className="text-[#165263] font-medium">
                  <TranslatableText text={festival.district} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-4">
            <PartyPopper className="h-6 w-6 text-[#FF6B6B]" />
            <h2 className="text-2xl font-bold text-[#165263]">
              <TranslatableText text="About the Festival" />
            </h2>
          </div>
          <div className="relative">
            <div 
              className={`prose prose-lg max-w-none overflow-hidden transition-all duration-300 ${
                expanded ? 'max-h-none' : 'max-h-[120px]'
              }`}
            >
              <TranslatableText 
                text={festival.description} 
                className="text-gray-600 leading-relaxed"
              />
            </div>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
            <button
              onClick={() => setExpanded(!expanded)} 
              className="relative z-10 mt-2 text-[#5DA9B7] hover:text-[#165263] font-medium transition-colors flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <TranslatableText text="Show Less" />
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <TranslatableText text="Read More" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Media Sections */}
        <div className="space-y-8">
          {/* Festival Images Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-y-2 mb-6">
              <div className="flex items-center gap-2 min-w-0">
                <Image className="h-6 w-6 text-[#4ECDC4]" />
                <h2 className="text-2xl font-bold text-[#165263] truncate">
                  <TranslatableText text="Festival Gallery" />
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-yellow-500 font-medium">
                  <TranslatableText text="Coming Soon" />
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center">
              <Image className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                <TranslatableText text="A beautiful gallery of festival moments will be available here soon" />
              </p>
            </div>
          </div>

          {/* Festival Videos Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-y-2 mb-6">
              <div className="flex items-center gap-2 min-w-0">
                <Video className="h-6 w-6 text-[#FF6B6B]" />
                <h2 className="text-2xl font-bold text-[#165263] truncate">
                  <TranslatableText text="Festival Videos" />
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-yellow-500 font-medium">
                  <TranslatableText text="Coming Soon" />
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center">
              <Video className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                <TranslatableText text="Watch captivating videos of the festival celebrations soon" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetails;