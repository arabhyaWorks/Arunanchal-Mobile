import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Music,
  FileText,
  Heart, 
  Eye,
  MessageCircle,
  Play,
  BookOpen,
  Utensils,
  Calendar,
  Upload,
  Bell,
  ClipboardCheck,
  Plus,
  Settings
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

interface CategoryStat {
  categoryId: number;
  categoryName: string;
  activeItemsCreatedByUser: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface Stats {
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  categories: CategoryStat[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
    categories: []
  });
  const [loading, setLoading] = useState(true);

  // Quick actions configuration
  const quickActions = [
    { 
      icon: Upload, 
      label: 'Upload Content', 
      bgColor: 'bg-[#4285F4]',
      onClick: () => navigate('/upload')
    },
    // { 
    //   icon: ClipboardCheck, 
    //   label: 'Content Status',
    //   bgColor: 'bg-[#F4B400]',
    //   onClick: () => navigate('/content-status')
    // },
    { 
      icon: Bell, 
      label: 'Notifications',
      bgColor: 'bg-[#A142F4]',
      onClick: () => navigate('/notifications')
    },
    // { 
    //   icon: FileText, 
    //   label: 'My Content',
    //   bgColor: 'bg-[#455A64]',
    //   onClick: () => navigate('/my-content')
    // }
  ];

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "Folk Dance":
        return Play;
      case "Festivals":
        return Calendar;
      case "Folk Music":
        return Music;
      case "Folk Tales":
        return FileText;
      case "Cuisine/Delicacies":
        return Utensils;
      default:
        return BookOpen;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.role !== 'Artist') {
          navigate('/profile');
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
        localStorage.removeItem('userData');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://arabhaya2.bidabhadohi.com/api/stats/categoryItems?user_id=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setStats({
            totalLikes: data.data.overallTotals.totalLikes,
            totalComments: data.data.overallTotals.totalComments,
            totalViews: data.data.overallTotals.totalViews,
            categories: data.data.categoryStats.map((cat: any) => ({
              categoryId: cat.categoryId,
              categoryName: cat.categoryName,
              activeItemsCreatedByUser: cat.activeItemsCreatedByUser,
              totalViews: cat.totalViews,
              totalLikes: cat.totalLikes,
              totalComments: cat.totalComments
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

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
          <TranslatableText text="Artist Dashboard" />
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`${action.bgColor} p-4 rounded-xl text-white hover:opacity-90 transition-opacity flex items-center gap-3 justify-center`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-base font-medium">
                <TranslatableText text={action.label} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Total Likes */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
            <Heart className="text-white/90 h-5 w-5 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
            <h3 className="text-white/90 text-xs">Total Likes</h3>
          </div>

          {/* Total Comments */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
            <MessageCircle className="text-white/90 h-5 w-5 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
            <h3 className="text-white/90 text-xs">Total Comments</h3>
          </div>

          {/* Total Views */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4">
            <Eye className="text-white/90 h-5 w-5 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
            <h3 className="text-white/90 text-xs">Total Views</h3>
          </div>
        </div>
      </div>

      {/* Content Categories */}
      <div className="px-4 py-6 pb-20 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#165263]">
            <TranslatableText text="Your Content" />
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.categories.map((category) => {
            const Icon = getCategoryIcon(category.categoryName);
            const iconColors = {
              "Folk Dance": "bg-purple-100 text-purple-600",
              "Festivals": "bg-green-100 text-green-600", 
              "Folk Music": "bg-blue-100 text-blue-600",
              "Folk Tales": "bg-orange-100 text-orange-600",
              "Cuisine/Delicacies": "bg-pink-100 text-pink-600"
            }[category.categoryName] || "bg-gray-100 text-gray-600";
            
            return (
              <div
                key={category.categoryId}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer border border-gray-100"
                onClick={() => navigate(`/my-content/${category.categoryName.toLowerCase()}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#165263]">
                    {category.categoryName}
                  </h3>
                  <div className={`p-2 rounded-lg ${iconColors}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-4">
                  {category.activeItemsCreatedByUser} items
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Eye className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{category.totalViews}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Heart className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{category.totalLikes}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <MessageCircle className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{category.totalComments}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Add Content Button */}
        <button 
          onClick={() => navigate('/upload')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-[#165263] to-[#5DA9B7] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;