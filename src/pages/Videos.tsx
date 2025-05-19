import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, TrendingUp, Filter, Play, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TranslatableText } from '../components/TranslatableText';

interface Video {
  id: number;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path: string;
  views_count: number;
  created_at: string;
  tribe: {
    name: string;
    thumbnail: string;
  };
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTribe, setSelectedTribe] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [tribes, setTribes] = useState<string[]>([]);
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          'https://arabhaya2.bidabhadohi.com/api/category/items?category_id=2'
        );
        const data = await response.json();
        console.log('Fetched video data:', data);

        // Transform video data to include tribe information
        if (data?.data) {
          const transformedVideos = data.data.map((item: any) => ({
            data: item.id,
            title: item.name,
            description: item.description,
            views_count: item.view_count || 0,
            created_at: item.created_at,
            ...(item.attributes?.find(
              (attr: any) =>
                attr.attribute_name === 'cat-FolkDance-VideoOfTheDance'
            )?.attribute_value?.value?.[0] || {}),
            tribe: {
              name:
                item.attributes?.find(
                  (attr: any) => attr.attribute_name === 'cat-FolkDance-Tribe'
                )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe',
              thumbnail: 'https://arabhaya2.bidabhadohi.com/logo_ap.png',
            },
          }));

          console.log(data.data);
          console.log(transformedVideos);
          setVideos(transformedVideos);
          setVideoData(transformedVideos);

          // Extract unique tribe names
          const uniqueTribes = Array.from(
            new Set(
              transformedVideos
                .map((video) => video.tribe.name)
                .filter((name) => name !== 'Unknown Tribe')
            )
          );
          setTribes(uniqueTribes);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTribe = !selectedTribe || video.tribe.name === selectedTribe;
    return matchesSearch && matchesTribe;
  });

  // Get trending videos sorted by views
  const trendingVideos = [...filteredVideos]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 4);

  // Get new videos sorted by creation date
  const newVideos = [...filteredVideos]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] p-4">
        <div className="space-y-6">
          {/* Shimmer for filters */}
          <div className="h-12 animate-shimmer rounded-lg w-full"></div>

          {/* Shimmer for trending section */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video animate-shimmer rounded-lg"
              ></div>
            ))}
          </div>

          {/* Shimmer for video grid */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`grid-${i}`} className="space-y-2">
                <div className="aspect-video animate-shimmer rounded-lg"></div>
                <div className="h-4 animate-shimmer rounded w-3/4"></div>
                <div className="h-4 animate-shimmer rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FFFF] pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="text-[#165263]" />
            </Link>
            <h1 className="text-[#165263] text-xl font-semibold">
              <TranslatableText text="Videos" />
            </h1>
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Filter className="text-[#165263]" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#5DA9B7] transition-colors"
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-red-500 h-5 w-5" />
          <h2 className="text-lg font-semibold text-[#165263]">
            <TranslatableText text="Trending Now" />
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingVideos.map((video) => (
            <a
              key={video.id}
              onClick={() => navigate(`/video/${video.data}`)}
              className="relative group aspect-video"
            >
              <img
                src={video.thumbnail_path}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                <Play className="text-white h-8 w-8" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                {video.views_count ? video.views_count.toLocaleString() : '0'}{' '}
                views
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* New Videos Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-[#165263]">
            <TranslatableText text="Latest Uploads" />
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {newVideos.map((video) => (
            <a
              key={video.id}
              onClick={() => navigate(`/video/${video.data}`)}
              className="group space-y-2"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail_path}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                  <Play className="text-white h-8 w-8" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  {video.views_count ? video.views_count.toLocaleString() : '0'}{' '}
                  views
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={video.tribe.thumbnail}
                    alt={video.tribe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#165263] line-clamp-2">
                    <TranslatableText text={video.title} />
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{video.tribe.name}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-[#165263] mb-4">
          <TranslatableText text="All Videos" />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredVideos.map((video) => (
            <a
              key={video.id}
              onClick={() => navigate(`/video/${video.data}`)}
              className="group"
            >
              <div className="relative aspect-video mb-2">
                <img
                  src={video.thumbnail_path}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                  <Play className="text-white h-6 w-6" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  {video.views_count ? video.views_count.toLocaleString() : '0'}{' '}
                  views
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={video.tribe.thumbnail}
                    alt={video.tribe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#165263] line-clamp-2">
                    <TranslatableText text={video.title} />
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{video.tribe.name}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#165263]">
                <TranslatableText text="Filter Videos" />
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-[#165263]" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <TranslatableText text="Select Tribe" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tribes.map((tribe) => (
                    <button
                      key={tribe}
                      onClick={() => {
                        setSelectedTribe(tribe === selectedTribe ? '' : tribe);
                        setShowFilters(false);
                      }}
                      className={`p-2 rounded-lg border text-sm ${
                        tribe === selectedTribe
                          ? 'border-[#5DA9B7] bg-[#5DA9B7]/10 text-[#5DA9B7]'
                          : 'border-gray-200 hover:border-[#5DA9B7] text-gray-700'
                      }`}
                    >
                      {tribe}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
