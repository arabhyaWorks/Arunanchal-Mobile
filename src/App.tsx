import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tribes from './pages/Tribes';
import Notifications from './pages/Notifications';
import FolkTales from './pages/FolkTales';
import Profile from './pages/Profile';
import VideoPlayer from './components/VideoPlayer';
import Videos from './pages/Videos';
import TribeDetail from './pages/TribeDetail';
import FolkTaleDetail from './pages/FolkTaleDetail';
import CuisineDetail from './pages/CuisineDetail';
import Music from './pages/Music';
import FestivalDetails from './pages/FestivalDetails';
import LikedContent from './pages/LikedContent';
import Login from './pages/Login';
import ContentStatus from './pages/ContentStatus';
import Dashboard from './pages/Dashboard';
import UploadContent from './pages/UploadContent';
import FolkMusicUpload from './pages/FolkMusicUpload';
import { LanguageProvider } from './contexts/LanguageContext';
import Festivals from './pages/Festivals';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './pages/PrivacyPolicy';

interface ApiResponse {
  data: {
    festivals: Array<any>;
    cuisine: Array<any>;
    tribes: {
      tribe_id: number;
      name: string;
      attributes: {
        'tribe-ThumbnailImage': TribeAttribute;
        'tribe-BannerImage': TribeAttribute;
        'tribe-Regions': TribeAttribute;
        'tribe-PopulationInNumbers': TribeAttribute;
      };
    }[];
    media: {
      images: Array<MediaItem>;
      audios: Array<MediaItem & {
        thumbnail_path: string;
        artist?: string;
      }>;
      videos: Array<{
        id: number;
        title: string;
        file_path: string;
        thumbnail_path: string;
      }>;
      documents: Array<any>;
    };
    counts: {
      active_festivals: number;
      active_folk_dance: number;
      active_folk_music: number;
      total_tribes: number;
    };
  };
}

interface TribeAttribute {
  attribute_id: number;
  attribute_name: string;
  attribute_type_id: number;
  attribute_value: { value: string | string[] };
}

interface MediaItem {
  id: number;
  title: string;
  file_path: string;
}
function App() {
  const [data, setData] = useState<ApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [festivals, setFestivals] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://arunachal.upstateagro.com/api')
      .then(response => response.json())
      .then((result: ApiResponse) => {
        console.log('API Response:', result);
        if (!result.data) {
          throw new Error('Invalid API response format');
        }
        setData(result.data);
        // Fetch festivals data
        fetch('https://arunachal.upstateagro.com/api/category/items?category_id=1')
          .then(response => response.json())
          .then(festivalData => {
            if (festivalData?.data) {
              const transformedFestivals = festivalData.data.map((festival: any) => ({
                id: festival.id,
                name: festival.name,
                description: festival.description,
                tribe: festival.attributes.find(
                  (attr: any) => attr.attribute_name === 'cat-Festivals-Tribe'
                )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe',
                date: festival.attributes.find(
                  (attr: any) => attr.attribute_name === 'cat-Festivals-DateOfCelebration'
                )?.attribute_value?.value || 'Unknown Date',
                duration: festival.attributes.find(
                  (attr: any) => attr.attribute_name === 'cat-Festivals-Duration'
                )?.attribute_value?.value || 'Duration not available',
                image: festival.attributes.find(
                  (attr: any) => attr.attribute_name === 'cat-Festivals-ImagesOfTheFestivals'
                )?.attribute_value?.value || null,
                district: festival.attributes.find(
                  (attr: any) => attr.attribute_name === 'cat-Festivals-Regions'
                )?.attribute_value?.value || 'Unknown Location',
              }));
              setFestivals(transformedFestivals);
            }
          })
          .catch(error => {
            console.error('Error fetching festivals:', error);
          });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="space-y-4 w-64">
          <div className="h-8 animate-shimmer rounded-lg"></div>
          <div className="h-6 w-3/4 animate-shimmer rounded-lg"></div>
          <div className="h-6 w-1/2 animate-shimmer rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error || 'Failed to load data. Please try again.'}
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home data={data} />} />
            <Route path="/tribes" element={<Tribes tribes={data.tribes} />} />
            <Route path="/folktales" element={<FolkTales />} />
            <Route path="/tribes/:tribeName" element={<TribeDetail />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/video/:id" element={<VideoPlayer videos={data?.media?.videos || []} />} />
            <Route path="/folktale/:id" element={<FolkTaleDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/music" element={<Music />} />
            <Route path="/liked-content" element={<LikedContent />} />
            <Route path="/cuisine/:id" element={<CuisineDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/festival/:id" element={<FestivalDetails festivals={festivals} />} />
            <Route path="/upload/3" element={<FolkMusicUpload />} />
            <Route path="/my-content" element={<ContentStatus />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadContent />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;