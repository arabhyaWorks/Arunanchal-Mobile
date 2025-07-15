import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Filter, Play, Heart, X, Music2, Headphones } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import { TranslatableText } from '../components/TranslatableText';

interface Song {
  id: number;
  title: string;
  file_path: string;
  thumbnail_path: string;
  artist?: string;
  tribe?: {
    name: string;
  };
}

const genres = [
  { name: 'Folk', color: 'bg-[#FF6B6B]' },
  { name: 'Festival', color: 'bg-[#4ECDC4]' },
  { name: 'Ritual', color: 'bg-[#45B7D1]' },
  { name: 'Dance', color: 'bg-[#96CEB4]' },
];

const Music = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items?category_id=3');
      const data = await response.json();
      if (data?.data) {
        const transformedSongs = data.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          file_path: item.attributes?.find(
            (attr: any) => attr.attribute_name === 'cat-FolkMusic-FolkMusic'
          )?.attribute_value?.value?.[0]?.file_path || '',
          thumbnail_path: item.attributes?.find(
            (attr: any) => attr.attribute_name === 'cat-FolkMusic-FolkMusic'
          )?.attribute_value?.value?.[0]?.thumbnail_path || '',
          tribe: {
            name: item.attributes?.find(
              (attr: any) => attr.attribute_name === 'cat-FolkMusic-Tribe'
            )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe'
          }
        }));
        setSongs(transformedSongs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || song.tribe?.name === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => ({
      ...prev,
      [songId]: !prev[songId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] p-4">
        <div className="space-y-6">
          <div className="h-12 animate-shimmer rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square animate-shimmer rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FFFF] pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="text-[#165263]" />
            </Link>
            <h1 className="text-[#165263] text-xl font-semibold">
              <TranslatableText text="Folk Music" />
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

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search folk music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#5DA9B7] transition-colors"
          />
        </div>
      </div>

      {/* Genres */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#165263]/10 rounded-lg">
            <Headphones className="h-5 w-5 text-[#165263]" />
          </div>
          <h2 className="text-lg font-semibold text-[#165263]">
            <TranslatableText text="Music Categories" />
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {genres.map(genre => (
            <button
              key={genre.name}
              onClick={() => setSelectedGenre(genre.name === selectedGenre ? '' : genre.name)}
              className={`p-4 rounded-xl ${genre.color} bg-opacity-10 hover:bg-opacity-20 transition-colors
                ${genre.name === selectedGenre ? 'ring-2 ring-offset-2 ring-[#165263]' : ''}`}
            >
              <h3 className="text-[#165263] font-medium mb-1">{genre.name}</h3>
              <p className="text-sm text-gray-600">
                <TranslatableText text={`Traditional ${genre.name.toLowerCase()} music`} />
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid */}
      <div className="px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#165263]/10 rounded-lg">
            <Music2 className="h-5 w-5 text-[#165263]" />
          </div>
          <h2 className="text-lg font-semibold text-[#165263]">
            <TranslatableText text="All Songs" />
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
          {filteredSongs.map(song => (
            <div key={song.id} className="flex-none w-[160px] group relative">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                <img
                  src={song.thumbnail_path || 'https://arunachal.upstateagro.com/logo_ap.png'}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setCurrentSong(song);
                        setIsPlayerMinimized(false);
                      }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Play className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleLike(song.id)}
                    className="absolute top-2 right-2 p-2 bg-black/20 rounded-full"
                  >
                    <Heart
                      className={`h-5 w-5 ${likedSongs[song.id] ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-[#165263] line-clamp-1">
                  {song.title}
                </h3>
                {song.tribe && (
                  <p className="text-xs text-[#5DA9B7] mt-0.5 line-clamp-1">
                    {song.tribe.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <Music2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              <TranslatableText text="No songs found" />
            </p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#165263]">
                <TranslatableText text="Filter Songs" />
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-[#165263]" />
              </button>
            </div>
            {/* Add filter options here */}
          </div>
        </div>
      )}
      
      {currentSong && (
        <AudioPlayer
          song={currentSong}
          onClose={() => setCurrentSong(null)}
          isMinimized={isPlayerMinimized}
          onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
        />
      )}
    </div>
  );
};

export default Music;