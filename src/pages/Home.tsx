import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QuickFacts from '../components/QuickFacts';
import TribesMarquee from '../components/TribesMarquee';
import VideoCard from '../components/VideoCard';
import MusicCard from '../components/MusicCard';
import CuisineCard from '../components/CuisineCard';
import AudioPlayer from '../components/AudioPlayer';
import Bannerimg from '../components/Banner 6_v5.jpg'
import { TranslatableText } from '../components/TranslatableText';
import AboutDepartment from '../components/AboutDepartment';

interface HomeProps {
  data: ApiResponse['data'];
}

const Home = ({ data }: HomeProps) => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const navigate = useNavigate();
  const handlelearnMore = () => {
    navigate('/about-department');}

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
            {/* About Department Section */}
      <div className="bg-white py-6 mt-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[#165263] text-xl font-semibold">
            <TranslatableText text="About Department" />
          </h2>
        </div>
        
        <div className="px-4">
          <div className="bg-gradient-to-br from-[#165263] to-[#5DA9B7] rounded-2xl p-6 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src="https://indigenous.arunachal.gov.in/images/517104185_1151998350283342_3734064986980923111_n.jpg"
                  alt="Department of Indigenous Affairs"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl font-bold mb-2">
                  <TranslatableText text="Department of Indigenous Affairs" />
                </h3>
                <p className="text-lg font-medium mb-2 opacity-90">
                  <TranslatableText text="Government of Arunachal Pradesh" />
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                  <TranslatableText text="Preserving and promoting the rich cultural heritage, traditions, and indigenous knowledge of Arunachal Pradesh's diverse tribal communities for future generations." />
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">26+</div>
                  <div className="text-xs opacity-80">
                    <TranslatableText text="Major Tribes" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-xs opacity-80">
                    <TranslatableText text="Sub-Tribes" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs opacity-80">
                    <TranslatableText text="Languages" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">365+</div>
                  <div className="text-xs opacity-80">
                    <TranslatableText text="Cultural Events" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button 
              onClick={handlelearnMore}
              className="bg-white text-[#165263] px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors">
                <TranslatableText text="Learn More" />

              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home