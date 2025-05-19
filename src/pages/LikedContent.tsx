import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Utensils, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TranslatableText } from '../components/TranslatableText';

interface LikedContent {
  id: number;
  type: 'tribe' | 'recipe';
  title: string;
  thumbnail: string;
  description: string;
}

const LikedContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [followedTribes, setFollowedTribes] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [activeTab, setActiveTab] = useState<'all' | 'tribes' | 'recipes'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing userData:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Fetch user's favorites
  useEffect(() => {
    if (!user?.id) return;

    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://arabhaya2.bidabhadohi.com/api/users/favorites?user_id=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setFollowedTribes(data.data.followed_tribes || []);
          setLikedItems(
            (data.data.liked_category_items || []).filter(
              (item: any) => item.category_id === 5
            )
          );
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFollowedTribes([]);
        setLikedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Combine tribes and cuisine items
  const content: LikedContent[] = [
    ...followedTribes.map((tribe: any) => ({
      id: tribe.tribe_id,
      type: 'tribe',
      title: tribe.name,
      thumbnail: tribe.attributes['tribe-ThumbnailImage']?.attribute_value?.value || '',
      description: tribe.attributes['tribe-About']?.attribute_value?.value || 'No description available',
    })),
    ...likedItems.map((item: any) => ({
      id: item.item_id,
      type: 'recipe',
      title: item.name,
      thumbnail: item.attributes['cat-Cuisine/Delicacies-Image']?.attribute_value?.value || '',
      description: item.description || 'No description available',
    })),
  ];

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => 
        activeTab === 'tribes' ? item.type === 'tribe' : item.type === 'recipe'
      );

  const handleUnlike = async (content: LikedContent) => {
    if (!user?.id) return;

    try {
      if (content.type === 'tribe') {
        const response = await fetch('https://arabhaya2.bidabhadohi.com/api/tribe/follow', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tribe_id: content.id, user_id: user.id }),
        });
        if (response.ok) {
          setFollowedTribes(prev => prev.filter((tribe: any) => tribe.tribe_id !== content.id));
        }
      } else {
        const response = await fetch('https://arabhaya2.bidabhadohi.com/api/category/items/like', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_id: content.id, user_id: user.id }),
        });
        if (response.ok) {
          setLikedItems(prev => prev.filter((item: any) => item.item_id !== content.id));
        }
      }
    } catch (error) {
      console.error('Error unliking content:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="text-[#165263]" />
          </button>
          <h1 className="text-[#165263] text-xl font-semibold ml-2">
            <TranslatableText text="Liked & Followed" />
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', icon: Heart },
            { id: 'tribes', label: 'Tribes', icon: Calendar },
            { id: 'recipes', label: 'Cuisine', icon: Utensils },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#165263] text-white'
                  : 'bg-white text-[#165263]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">
                <TranslatableText text={tab.label} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredContent.length > 0 ? (
        <div className="p-4 space-y-4 pb-32">
          {filteredContent.map((item) => (
            <div 
              key={`${item.type}-${item.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
              onClick={() => navigate(`/${item.type}/${item.id}`)}
            >
              <div className="relative aspect-video">
                <img
                  src={item.thumbnail || 'https://arabhaya2.bidabhadohi.com/logo_ap.png'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white mb-2">
                    {item.type === 'tribe' ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <Utensils className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                  </div>
                  <h3 className="text-white font-semibold line-clamp-1">{item.title}</h3>
                </div>
                <button
                  onClick={() => handleUnlike(item)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 text-white fill-current" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 pb-32 text-center">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-[#165263] mb-2">
            <TranslatableText text="No favorites yet" />
          </h3>
          <p className="text-gray-500 mb-6">
            <TranslatableText text="Start following tribes and liking cuisine to build your collection" />
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D] transition-colors"
          >
            <TranslatableText text="Explore Content" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedContent;