import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2 } from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

const FolkTaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tale, setTale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeToast, setShowLikeToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

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

  useEffect(() => {
    const fetchTale = async () => {
      try {
        let url = `https://arabhaya2.bidabhadohi.com/api/category/items?category_id=4&item_id=${id}`;
        if (user?.id) url += `&user_id=${user.id}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.data?.[0]) {
          setTale(data.data[0]);
          setIsLiked(!!data.data[0].is_liked);
        } else {
          setError('Folk tale not found');
        }
      } catch (err) {
        console.error('Error fetching folk tale:', err);
        setError('Failed to load folk tale');
      } finally {
        setLoading(false);
      }
    };

    fetchTale();
  }, [id, user?.id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this folk tale');
      return;
    }

    try {
      const response = await fetch('https://arabhaya2.bidabhadohi.com/api/category/items/likes', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_item_id: id, user_id: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(!isLiked);
        setTale(prev => ({
          ...prev,
          like_count: prev.like_count + (isLiked ? -1 : 1),
        }));
        setShowLikeToast(true);
        setTimeout(() => setShowLikeToast(false), 2000);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    });
  };

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

  if (error || !tale) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Folk tale not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#165263] hover:underline flex items-center gap-2 justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
            <TranslatableText text="Go Back" />
          </button>
        </div>
      </div>
    );
  }

  const getAttributeValue = (attrName: string) => {
    return tale.attributes?.find(
      (attr: any) => attr.attribute_name === attrName
    )?.attribute_value?.value;
  };

  const heroImage = getAttributeValue('cat-FolkTales-ThumbnailImage') || 'https://arabhaya2.bidabhadohi.com/logo_ap.png';
  const story = getAttributeValue('cat-FolkTales-Story') || 'No story content available.';
  const moral = getAttributeValue('cat-FolkTales-Moral') || 'No moral specified.';
  const characters = getAttributeValue('cat-FolkTales-CharactersInvolved') || [];
  const variations = getAttributeValue('cat-FolkTales-Variations') || [];
  const historicalContext = getAttributeValue('cat-FolkTales-HistoricalOrReligiousContextAndSignificance') || 'No historical context available.';
  const tribe = getAttributeValue('cat-FolkTales-Tribe')?.[0]?.name || 'Unknown Tribe';
  const region = getAttributeValue('cat-FolkTales-RegionCulturalOrigin') || 'Unknown Region';
  const storyteller = getAttributeValue('cat-FolkTales-Storyteller') || 'Unknown Storyteller';

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="text-[#165263]" />
            </button>
            <h1 className="text-[#165263] text-xl font-semibold">
              <TranslatableText text="Folk Tale" />
            </h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh]">
        <img
          src={heroImage}
          alt={tale.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-6 left-6 right-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <span>{tribe}</span>
                <span>•</span>
                <span>{region}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                <TranslatableText text={tale.name} />
              </h1>
              <p className="text-white/80 text-lg">
                <TranslatableText text={tale.description} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="prose prose-lg max-w-none">
                <TranslatableText text={story} />
              </div>
            </div>

            {/* Characters */}
            {characters.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-[#165263] mb-6">
                  <TranslatableText text="Characters" />
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {characters.map((character: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-[#165263]">
                        <TranslatableText text={character} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variations */}
            {variations.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-[#165263] mb-6">
                  <TranslatableText text="Variations" />
                </h2>
                <div className="space-y-4">
                  {variations.map((variation: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-[#165263]">
                        <TranslatableText text={variation} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-around">
                <button
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">
                    <TranslatableText text={isLiked ? 'Liked' : 'Like'} />
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-gray-500 hover:text-[#5DA9B7] transition-colors"
                >
                  <Share2 />
                  <span className="text-sm">
                    <TranslatableText text="Share" />
                  </span>
                </button>
              </div>
            </div>

            {/* Moral */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#165263] mb-4">
                <TranslatableText text="Moral of the Story" />
              </h3>
              <p className="text-gray-600">
                <TranslatableText text={moral} />
              </p>
            </div>

            {/* Historical Context */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#165263] mb-4">
                <TranslatableText text="Historical Context" />
              </h3>
              <p className="text-gray-600">
                <TranslatableText text={historicalContext} />
              </p>
            </div>

            {/* Storyteller */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#165263] mb-4">
                <TranslatableText text="Storyteller" />
              </h3>
              <p className="text-gray-600">
                <TranslatableText text={storyteller} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {showLikeToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
            <p className="font-medium text-gray-900">
              <TranslatableText text={isLiked ? 'Added to favorites!' : 'Removed from favorites'} />
            </p>
          </div>
        )}
        
        {showShareToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <Share2 className="h-5 w-5 text-[#5DA9B7]" />
            <p className="font-medium text-gray-900">
              <TranslatableText text="Link copied to clipboard!" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolkTaleDetail;