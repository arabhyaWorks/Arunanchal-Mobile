import React, { useState } from 'react';
import Header from '../components/Header';
import QuickFacts from '../components/QuickFacts';
import TribesMarquee from '../components/TribesMarquee';
import VideoCard from '../components/VideoCard';
import MusicCard from '../components/MusicCard';
import CuisineCard from '../components/CuisineCard';
import AudioPlayer from '../components/AudioPlayer';
import Bannerimg from '../components/Banner 6_v5.jpg'
import { TranslatableText } from '../components/TranslatableText';

interface HomeProps {
  data: ApiResponse['data'];
}

const Home = ({ data }: HomeProps) => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);

  return (
    <div className="pb-20">
      <Header />
      <div>
        <div className="relative w-full h-[220px] overflow-hidden">
          <img
            src={Bannerimg}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <TribesMarquee tribes={data.tribes} />
      <QuickFacts counts={data.counts} />
      <div className="bg-white py-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[#165263] text-xl font-semibold">
            <TranslatableText text="Featured Videos" />
          </h2>
          <button className="text-[#5DA9B7] text-sm font-medium">
            <TranslatableText text="See All" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex overflow-x-auto px-4 no-scrollbar">
            {data.media.videos.slice(0, 8).map((video) => (
              <VideoCard
                key={video.id}
                id={video.associated_category_item_id}
                title={video.title}
                thumbnail={video.thumbnail_path}
                videoUrl={video.file_path}
              />
            ))}
          </div>
          <div className="flex overflow-x-auto px-4 no-scrollbar">
            {data.media.videos.slice(8, 16).map((video) => (
              <VideoCard
                key={video.id}
                id={video.associated_category_item_}
                title={video.title}
                thumbnail={video.thumbnail_path}
                videoUrl={video.file_path}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white py-6 mt-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[#165263] text-xl font-semibold">
            <TranslatableText text="Featured Music" />
          </h2>
          <button className="text-[#5DA9B7] text-sm font-medium">
            <TranslatableText text="See All" />
          </button>
        </div>
        <div className="flex overflow-x-auto px-4 no-scrollbar">
          {data.media.audios?.slice(0, 10).map((music) => (
            <MusicCard
              key={music.id}
              title={music.title}
              id={music.id}
              thumbnail={music.thumbnail_path}
              audioUrl={music.file_path}
              artist={music.artist}
              onPlay={() => {
                setCurrentSong({
                  id: music.id,
                  title: music.title,
                  file_path: music.file_path,
                  thumbnail_path: music.thumbnail_path,
                  artist: music.artist
                });
                setIsPlayerMinimized(false);
              }}
              // onPlay={(song) => {
              //   setCurrentSong(song);
              //   setIsPlayerMinimized(false);
              // }}
            />
          ))}
        </div>
      </div>
      {currentSong && (
        <AudioPlayer
          song={currentSong}
          onClose={() => setCurrentSong(null)}
          isMinimized={isPlayerMinimized}
          onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
        />
      )}
      <div className="bg-white py-6 mt-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[#165263] text-xl font-semibold">
            <TranslatableText text="Featured Cuisines" />
          </h2>
          <button className="text-[#5DA9B7] text-sm font-medium">
            <TranslatableText text="See All" />
          </button>
        </div>
        <div className="flex overflow-x-auto px-4 pb-4 no-scrollbar">
          {data.cuisine?.slice(0, 10).map((cuisine) => (
            <CuisineCard
              key={cuisine.item_id}
              id={cuisine.item_id}
              title={cuisine.name}
              description={cuisine.description}
              image={cuisine.attributes['cat-Cuisine/Delicacies-Image'].attribute_value.value}
              preparationTime={cuisine.attributes['cat-Cuisine/Delicacies-TimeForPreparation'].attribute_value.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home