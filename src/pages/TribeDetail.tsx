import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ImageModal from '../components/ImageModal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  ChevronLeft, 
  MoreVertical,
  Image,
  Users, 
  MapPin, 
  Languages, 
  Heart,
  Calendar,
  Music2,
  BookOpen,
  Utensils,
  Sparkles,
  Shirt,
  Scissors,
  ScrollText,
  Mic2,
  Landmark,
  ArrowUp,
  Clock,
  Play
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

interface TribeDetailProps {}

const TribeDetail: React.FC<TribeDetailProps> = () => {
  const navigate = useNavigate();
  const { tribeName } = useParams();
  const [tribe, setTribe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAboutFull, setShowAboutFull] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Categories configuration
  const categories = [
    { id: 'festivals', icon: Calendar, label: 'Festivals', color: 'from-orange-500 to-red-500' },
    { id: 'music', icon: Music2, label: 'Folk Music', color: 'from-purple-500 to-pink-500' },
    { id: 'stories', icon: BookOpen, label: 'Folk Tales', color: 'from-blue-500 to-indigo-500' },
    { id: 'food', icon: Utensils, label: 'Cuisine', color: 'from-green-500 to-emerald-500' },
    { id: 'rituals', icon: Sparkles, label: 'Rituals', color: 'from-yellow-500 to-amber-500' },
    { id: 'costumes', icon: Shirt, label: 'Costumes', color: 'from-pink-500 to-rose-500' },
    { id: 'crafts', icon: Scissors, label: 'Handicrafts', color: 'from-teal-500 to-cyan-500' },
    { id: 'scripts', icon: ScrollText, label: 'Scripts', color: 'from-violet-500 to-purple-500' },
    { id: 'language', icon: Mic2, label: 'Language', color: 'from-indigo-500 to-blue-500' },
    { id: 'heritage', icon: Landmark, label: 'Heritage', color: 'from-red-500 to-pink-500' }
  ];

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
    const fetchTribeDetails = async () => {
      try {
        const response = await fetch(`https://arabhaya2.bidabhadohi.com/api/tribe?tribeName=${tribeName}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setTribe(data.data[0]);
        } else {
          setError('Tribe not found');
        }
      } catch (err) {
        setError('Failed to fetch tribe details');
      } finally {
        setLoading(false);
      }
    };

    fetchTribeDetails();
  }, [tribeName]);

  const handleFollow = async () => {
    if (!user) {
      setToastMessage('Please login to follow this tribe');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setFollowLoading(true);
    try {
      const response = await fetch('https://arabhaya2.bidabhadohi.com/api/tribe/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tribe_id: tribe.tribe_id,
          user_id: user.id
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setToastMessage(isFollowing ? 'Unfollowed successfully' : 'Following tribe');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error following tribe:', error);
      setToastMessage('Failed to follow tribe');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setFollowLoading(false);
    }
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

  if (error || !tribe) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Tribe not found'}</p>
          <Link 
            to="/tribes"
            className="text-[#165263] hover:underline"
          >
            <TranslatableText text="Back to Tribes" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FFFF] pb-32">
      {/* Header with Banner */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={tribe.attributes['tribe-BannerImage']?.attribute_value?.value || 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d'}
          alt={tribe.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Link
            to="/tribes"
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Dropdown */}
        {showMenu && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-lg py-2 z-20">
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
              <TranslatableText text="Share" />
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
              <TranslatableText text="Report" />
            </button>
          </div>
        )}

        {/* Tribe Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 text-white space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold">
              <TranslatableText text={tribe.name} />
            </h1>
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all ${
                isFollowing 
                  ? 'bg-white/20 hover:bg-white/30' 
                  : 'bg-[#5DA9B7] hover:bg-[#4A8A96]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-white' : ''}`} />
              <span>
                {followLoading 
                  ? <TranslatableText text="Loading..." />
                  : <TranslatableText text={isFollowing ? "Following" : "Follow"} />
                }
              </span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center max-w-full overflow-x-auto pb-2 no-scrollbar">
            {tribe.attributes['tribe-Regions']?.attribute_value?.value && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm whitespace-nowrap">
                <MapPin className="w-4 h-4" />
                <span>
                  {tribe.attributes['tribe-Regions'].attribute_value.value.join(', ')}
                </span>
              </div>
            )}
            
            {tribe.attributes['tribe-PopulationInNumbers']?.attribute_value?.value && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm whitespace-nowrap">
                <Users className="w-4 h-4" />
                <span>
                  {tribe.attributes['tribe-PopulationInNumbers'].attribute_value.value}
                </span>
              </div>
            )}

            {tribe.attributes['tribe-Language']?.attribute_value?.value && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm whitespace-nowrap">
                <Languages className="w-4 h-4" />
                <span>
                  {tribe.attributes['tribe-Language'].attribute_value.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 py-8 bg-white shadow-md -mt-6 rounded-t-[2rem] relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-lg scale-95'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center">
                  <TranslatableText text={category.label} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#165263] mb-4">
            <TranslatableText text="About the Tribe" />
          </h2>
          <div className={`relative ${!showAboutFull ? 'max-h-32 overflow-hidden' : ''}`}>
            <p className="text-gray-600 leading-relaxed">
              <TranslatableText 
                text={tribe.attributes['tribe-About']?.attribute_value?.value || 'No description available.'} 
              />
            </p>
            {!showAboutFull && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <button
            onClick={() => setShowAboutFull(!showAboutFull)}
            className="mt-2 text-[#5DA9B7] hover:text-[#165263] font-medium transition-colors"
          >
            <TranslatableText text={showAboutFull ? 'Show Less' : 'Read More'} />
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      {tribe.attributes['tribe-ImagesOfTheTribe']?.attribute_value?.value?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Image className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#165263]">
                  <TranslatableText text="Photo Gallery" />
                </h2>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Visual journey through tribal culture" />
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tribe.attributes['tribe-ImagesOfTheTribe'].attribute_value.value.map((image: any, index: number) => (
                <div 
                  key={image.id} 
                  className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.file_path}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white text-sm font-medium line-clamp-2">
                        <TranslatableText text={image.title} />
                      </h3>
                      <p className="text-white/80 text-xs mt-1">
                        <TranslatableText text={image.description} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImageIndex !== null && tribe.attributes['tribe-ImagesOfTheTribe']?.attribute_value?.value && (
        <ImageModal
          images={tribe.attributes['tribe-ImagesOfTheTribe'].attribute_value.value}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onNext={() => setSelectedImageIndex(prev => 
            prev !== null && prev < tribe.attributes['tribe-ImagesOfTheTribe'].attribute_value.value.length - 1 
              ? prev + 1 
              : prev
          )}
          onPrevious={() => setSelectedImageIndex(prev => 
            prev !== null && prev > 0 
              ? prev - 1 
              : prev
          )}
        />
      )}

      {/* History Section */}
      {tribe.attributes['tribe-History']?.attribute_value?.value && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ScrollText className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Historical Background" />
              </h2>
            </div>
            <div className={`relative ${!showAboutFull ? 'max-h-24 overflow-hidden' : ''}`}>
              <p className="text-gray-600 leading-relaxed">
              <TranslatableText text={tribe.attributes['tribe-History'].attribute_value.value} />
              </p>
              {!showAboutFull && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
            <button
              onClick={() => setShowAboutFull(!showAboutFull)}
              className="mt-2 text-[#5DA9B7] hover:text-[#165263] font-medium transition-colors"
            >
              <TranslatableText text={showAboutFull ? 'Show Less' : 'Read More'} />
            </button>
          </div>
        </div>
      )}

      {/* Festivals Section */}
      {tribe?.categories?.Festivals?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  <TranslatableText text="Festival Calendar" />
                </h2>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Annual celebrations and events" />
                </p>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {tribe.categories.Festivals.map((festival: any, index: number) => (
                <div
                  onClick={() => navigate(`/festival/${festival.item_id}`)}
                  key={festival?.name || index}
                  className="relative flex-none w-[280px] rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 hover:shadow-lg transition-all border border-purple-100 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {festival?.name || "Unnamed Festival"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                    {festival?.description || "No description available"}
                  </p>
                  <div className="space-y-2">
                    {festival?.attributes?.["cat-Festivals-DateOfCelebration"]?.attribute_value?.value && (
                      <div className="flex items-center gap-2 text-xs text-purple-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {festival.attributes["cat-Festivals-DateOfCelebration"].attribute_value.value}
                        </span>
                      </div>
                    )}
                    {festival?.attributes?.["cat-Festivals-Duration"]?.attribute_value?.value && (
                      <div className="flex items-center gap-2 text-xs text-purple-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {festival.attributes["cat-Festivals-Duration"].attribute_value.value}
                        </span>
                      </div>
                    )}
                    {festival?.attributes?.["cat-Festivals-Regions"]?.attribute_value?.value && (
                      <div className="flex items-center gap-2 text-xs text-purple-600">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {festival.attributes["cat-Festivals-Regions"].attribute_value.value}
                        </span>
                      </div>
                    )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Folk Music Section */}
      {tribe.categories?.['Folk Music']?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Music2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Folk Music" />
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {tribe.categories['Folk Music'].map((music: any, index: number) => (
                <div 
                  key={index} 
                  onClick={() => {
                    if (music.attributes?.['cat-FolkMusic-FolkMusic']?.attribute_value?.value?.[0]) {
                      const songData = {
                        id: music.id,
                        title: music.name,
                        file_path: music.attributes['cat-FolkMusic-FolkMusic'].attribute_value.value[0].file_path,
                        thumbnail_path: music.attributes['cat-FolkMusic-FolkMusic'].attribute_value.value[0].thumbnail_path,
                        tribe: { name: tribe.name }
                      };
                      navigate('/music', { state: { song: songData } });
                    }
                  }}
                  className="flex-none w-[160px] group relative cursor-pointer"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                    <img
                      src={music.attributes?.['cat-FolkMusic-FolkMusic']?.attribute_value?.value?.[0]?.thumbnail_path || 'https://arabhaya2.bidabhadohi.com/logo_ap.png'}
                      alt={music.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-[#165263] line-clamp-1">{music.name}</h3>
                    <p className="text-xs text-[#5DA9B7] mt-0.5 line-clamp-1">{tribe.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Folk Tales Section */}
      {tribe.categories?.['Folk Tales']?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Folk Tales" />
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {tribe.categories['Folk Tales'].map((tale: any, index: number) => (
                <div 
                  key={index} 
                  onClick={() => {
                    const encodedName = encodeURIComponent(tale.name);
                    navigate(`/folktales?taleName=${encodedName}&item_id=${tale.item_id}`);
                  }}
                  className="flex-none w-[280px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={tale.attributes?.['cat-FolkTales-ThumbnailImage']?.attribute_value?.value || 'https://arabhaya2.bidabhadohi.com/logo_ap.png'}
                      alt={tale.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      <TranslatableText text="Folk Tales" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#165263] text-lg mb-2 line-clamp-1">{tale.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{tale.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Traditional Costumes Section */}
      {tribe.categories?.['Traditional Costumes & Dresses']?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Shirt className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Traditional Costumes" />
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {tribe.categories['Traditional Costumes & Dresses'].map((costume: any, index: number) => (
                <div key={index} className="flex-none w-[280px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={costume.attributes?.['cat-TraditionalCostumes&Dresses-ThumbnailImage']?.attribute_value?.value || 'https://arabhaya2.bidabhadohi.com/logo_ap.png'}
                      alt={costume.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                      <TranslatableText text="Traditional Costume" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#165263] text-lg mb-2 line-clamp-1">{costume.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{costume.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cuisine Section */}
      {tribe.categories?.['Cuisine/Delicacies']?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Utensils className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Traditional Cuisine" />
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2">
              {tribe.categories['Cuisine/Delicacies'].map((cuisine: any, index: number) => (
                <div 
                  key={index} 
                  onClick={() => navigate(`/cuisine/${cuisine.item_id}`)}
                  className="flex-none w-[280px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={cuisine.attributes?.['cat-Cuisine/Delicacies-Image']?.attribute_value?.value || 'https://arabhaya2.bidabhadohi.com/logo_ap.png'}
                      alt={cuisine.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      <TranslatableText text="Traditional Cuisine" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#165263] text-lg mb-2 line-clamp-1">{cuisine.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{cuisine.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Languages Section */}
      {tribe.categories?.Languages?.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Languages className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#165263]">
                <TranslatableText text="Languages" />
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tribe.categories.Languages.map((language: any, index: number) => (
                <div key={index} className="bg-indigo-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#165263] mb-2">{language.name}</h3>
                  <p className="text-sm text-gray-600">{language.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-20" />

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-28 right-4 p-3 bg-[#165263] text-white rounded-full shadow-lg z-40"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default TribeDetail;

