import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Music, 
  FileText, 
  Filter, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Heart,
  Calendar,
  Utensils,
  BookOpen,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

const ContentStatus = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryMapping = {
    "video": [2],
    "music": [3],
    "story": [13],
    "recipe": [5],
    "festival": [1]
  };

  const tabs = [
    { id: "all", label: "All Content", icon: Filter },
    { id: "video", label: "Videos", icon: Video },
    { id: "music", label: "Music", icon: Music },
    { id: "story", label: "Stories", icon: FileText },
    { id: "recipe", label: "Recipes", icon: Utensils },
    { id: "festival", label: "Festivals", icon: Calendar }
  ];

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
    if (!user?.id) return;
    
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://arunachal.upstateagro.com/api/category/items/active?user_id=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          const mappedContent = data.data.map(item => {
            const contentType = Object.keys(categoryMapping).find(type => 
              categoryMapping[type].includes(item.category_id)
            ) || "other";
            
            // Find thumbnail based on content type
            const thumbnailAttribute = item.attributes?.find(attr => {
              if (!attr?.attribute_name) return false;
              const name = attr.attribute_name.toLowerCase();
              switch (contentType) {
                case 'video':
                  return name === 'cat-folkdance-videoofthedance';
                case 'music':
                  return name === 'cat-folkmusic-folkmusic';
                case 'story':
                  return name === 'cat-folktales-thumbnailimage';
                case 'recipe':
                  return name === 'cat-cuisine/delicacies-image';
                case 'festival':
                  return name === 'cat-festivals-imagesofthefestivals';
                default:
                  return name.includes('image') || name.includes('thumbnail');
              }
            });

            // Extract thumbnail value based on attribute structure
            const thumbnailValue = thumbnailAttribute?.attribute_value?.value;
            const thumbnail = Array.isArray(thumbnailValue) 
              ? thumbnailValue[0]?.thumbnail_path || thumbnailValue[0]?.file_path
              : thumbnailValue;
            
            return {
              ...item,
              type: contentType,
              views: item.view_count || 0,
              likes: item.like_count || 0,
              comments: item.comment_count || 0,
              date: item.created_at,
              title: item.name,
              thumbnail: thumbnail || null,
              status: item.status || 'Pending',
            };
          });
          
          setContent(mappedContent);
        }
      } catch (err) {
        setError('Failed to fetch content');
        console.error('Error fetching content:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [user?.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "music": return Music;
      case "story": return FileText;
      case "recipe": return Utensils;
      case "festival": return Calendar;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] p-4">
        <div className="space-y-6">
          <div className="h-12 animate-shimmer rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-video animate-shimmer rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="text-[#165263]" />
        </button>
        <h1 className="text-[#165263] text-lg font-medium">
          <TranslatableText text="Content Status" />
        </h1>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#5DA9B7] transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#165263] text-white'
                    : 'bg-white text-[#165263] hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  <TranslatableText text={tab.label} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => {
            const ItemIcon = getIcon(item.type);
            return (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img 
                    src={item.thumbnail || 'https://arunachal.upstateagro.com/logo_ap.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status || 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ItemIcon className="h-4 w-4 text-[#5DA9B7]" />
                    <span className="text-xs font-medium text-[#5DA9B7] capitalize">
                      <TranslatableText text={item.type} />
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-[#165263] mb-3 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#165263] mb-2">
              <TranslatableText text="No content found" />
            </h3>
            <p className="text-gray-500">
              <TranslatableText text={
                searchQuery 
                  ? "No results match your search" 
                  : "You haven't uploaded any content yet"
              } />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStatus;