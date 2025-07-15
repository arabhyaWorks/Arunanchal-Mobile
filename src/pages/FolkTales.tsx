import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  MessageSquare, 
  Flag, 
  Check, 
  BookOpen,
  History,
  Users,
  MapPin,
  X
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

const FolkTales = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tale, setTale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeToast, setShowLikeToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showReportToast, setShowReportToast] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentToast, setShowCommentToast] = useState(false);

  const itemId = searchParams.get('item_id');
  const taleName = searchParams.get('taleName');

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
    if (!taleName && !itemId) return;

    let url = `/api/category/items?category_id=13`;
    if (itemId) {
      url += `&item_id=${itemId}&name=${encodeURIComponent(taleName || "")}`;
      if (user?.id) url += `&user_id=${user.id}`; // Include user_id for is_liked
    } else if (taleName) {
      url += `&name=${encodeURIComponent(taleName)}`;
    }

    const fetchTale = async () => {
      try {
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
  }, [itemId, taleName, user?.id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this folk tale');
      return;
    }

    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items/likes', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_item_id: itemId, user_id: user.id }),
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
    const shareUrl = `https://indigenous.arunachal.gov.in/folktales?taleName=${encodeURIComponent(tale.name)}&item_id=${itemId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    });
    setShowShareModal(true);
  };

  // Social sharing function
  const handleSocialShare = (platform: string) => {
    if (!tale) return; // Safety check

    const shareUrl = `https://indigenous.arunachal.gov.in/folktales?taleName=${encodeURIComponent(tale.name)}&item_id=${itemId}`;
    const shareTitle = `${tale.name} - Indigenous Folk Tales of Arunachal Pradesh`;
    const shareDescription = tale.description || `Explore the traditional folk tale "${tale.name}" from the indigenous tribes of Arunachal Pradesh.`;
    const thumbnail = getAttributeValue('cat-FolkTales-ThumbnailImage') || 'https://arunachal.upstateagro.com/logo_ap.png';

    switch (platform.toLowerCase()) {
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `${shareTitle}\n${shareDescription}\n${shareUrl}\nThumbnail: ${thumbnail}`
          )}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareDescription)}&picture=${encodeURIComponent(thumbnail)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle} - ${shareDescription}`)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}&source=${encodeURIComponent(thumbnail)}`,
          '_blank'
        );
        break;
      default:
        console.error('Unsupported social media platform:', platform);
    }
  };

  const handleComment = async () => {
    if (!user) {
      alert('Please log in to comment');
      return;
    }
    if (!commentText.trim()) return;

    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_item_id: itemId,
          user_id: user.id,
          content: commentText,
        }),
      });
      const data = await response.json();
      if (data.success) {
        const newComment = {
          id: data.comment_id,
          content: commentText,
          created_at: new Date().toISOString(),
          first_name: user.first_name,
          last_name: user.last_name,
        };
        setTale(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments],
          comment_count: prev.comment_count + 1,
        }));
        setCommentText('');
        setShowCommentToast(true);
        setTimeout(() => setShowCommentToast(false), 2000);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReport = async () => {
    if (!user) {
      alert('Please log in to report');
      return;
    }
    if (!reportReason.trim()) return;

    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_item_id: itemId,
          user_id: user.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowReportForm(false);
        setReportReason('');
        setReportDetails('');
        setShowReportToast(true);
        setTimeout(() => setShowReportToast(false), 2000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAttributeValue = (attrName: string) => {
    return tale.attributes?.find(
      (attr: any) => attr.attribute_name === attrName
    )?.attribute_value?.value;
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

  const heroImage = getAttributeValue('cat-FolkTales-ThumbnailImage') || 'https://arunachal.upstateagro.com/logo_ap.png';
  const story = getAttributeValue('tale.description') || 'No story content available.';
  const moral = getAttributeValue('cat-FolkTales-Moral') || 'No moral specified.';
  const characters = getAttributeValue('cat-FolkTales-CharactersInvolved') || [];
  const variations = getAttributeValue('cat-FolkTales-Variations') || [];
  const historicalContext = getAttributeValue('cat-FolkTales-HistoricalOrReligiousContextAndSignificance') || 'No historical context available.';
  const tribe = getAttributeValue('cat-FolkTales-Tribe')?.[0]?.name || 'Unknown Tribe';
  const region = getAttributeValue('cat-FolkTales-RegionCulturalOrigin') || 'Unknown Region';
  const storyteller = getAttributeValue('cat-FolkTales-Storyteller') || 'Unknown Storyteller';

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] relative overflow-hidden">
          <img 
            src={heroImage} 
            alt={tale.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <Share2 className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setShowReportForm(true)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <Flag className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">
                  <TranslatableText text={tale.name} />
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <MapPin className="h-4 w-4" />
                    <span>{region}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4" />
                    <span>{tribe}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Heart className="h-4 w-4" />
                    <span>{tale.like_count} likes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                    <span>{tale.comment_count} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#165263]">
                    <TranslatableText text="The Story" />
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-red-100 text-red-600"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  >
                    <Flag className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed">
                <TranslatableText text={story} />
              </div>
            </div>

            {/* Characters */}
            {characters.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-[#165263] mb-6">
                  <TranslatableText text="Characters" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {characters.map((character: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <p className="font-medium text-gray-900">
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
                <div className="space-y-6">
                  {variations.map((variation: string, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-600">
                        <TranslatableText text={variation} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-[#165263] mb-6">
                <TranslatableText text={`Comments (${tale.comment_count})`} />
              </h2>
              
              {/* Comment Form */}
              <div className="mb-8">
                <div className="flex gap-4">
                  {user ? (
                    <div className="w-10 h-10 rounded-full bg-[#5DA9B7] text-white flex items-center justify-center font-medium">
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={user ? "Add your comment..." : "Please log in to comment"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5DA9B7] focus:border-transparent resize-none"
                      rows={3}
                      disabled={!user}
                    />
                    {user && commentText.trim() && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleComment}
                          className="px-4 py-2 bg-[#5DA9B7] text-white rounded-lg hover:bg-[#165263] transition-colors"
                        >
                          <TranslatableText text="Post Comment" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {tale.comments?.length > 0 ? (
                  tale.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#5DA9B7] text-white flex items-center justify-center font-medium">
                        {getInitials(comment.first_name, comment.last_name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-[#165263]">
                            {comment.first_name} {comment.last_name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      <TranslatableText text="No comments yet. Be the first to comment!" />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#165263] mb-4">
                <TranslatableText text="Quick Info" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Storyteller</span>
                  </div>
                  <span className="font-medium text-[#165263]">{storyteller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Likes</span>
                  </div>
                  <span className="font-medium text-[#165263]">{tale.like_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Comments</span>
                  </div>
                  <span className="font-medium text-[#165263]">{tale.comment_count}</span>
                </div>
              </div>
            </div>

            {/* Moral */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#165263]">
                  <TranslatableText text="Moral" />
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <TranslatableText text={moral} />
              </p>
            </div>

            {/* Historical Context */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <History className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#165263]">
                  <TranslatableText text="Historical Context" />
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <TranslatableText text={historicalContext} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#165263] mb-4 flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              <TranslatableText text="Report this Folk Tale" />
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText text="Reason" /> <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter reason for reporting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText text="Additional Details" />
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Provide additional details"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReportForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <TranslatableText text="Cancel" />
                </button>
                <button
                  onClick={handleReport}
                  disabled={!reportReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  <TranslatableText text="Submit Report" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#165263] flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <TranslatableText text="Share this folk tale" />
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            {/* Share Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex gap-4">
                <img
                  src={heroImage}
                  alt={tale.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-[#165263] mb-1">{tale.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{tale.description}</p>
                </div>
              </div>
            </div>
            
            {/* Share URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatableText text="Share URL" />
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://indigenous.arunachal.gov.in/folktales?taleName=${encodeURIComponent(tale.name)}&item_id=${itemId}`}
                  className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600"
                />
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D] transition-colors"
                >
                  <TranslatableText text="Copy" />
                </button>
              </div>
            </div>
            
            {/* Share Options */}
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" className="w-6 h-6" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </button>
              
              <button 
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" className="w-6 h-6" />
                </div>
                <span className="text-sm">Facebook</span>
              </button>
              
              <button 
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter" className="w-6 h-6" />
                </div>
                <span className="text-sm">Twitter</span>
              </button>
              
              <button 
                onClick={() => handleSocialShare('linkedin')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124011.png" alt="LinkedIn" className="w-6 h-6" />
                </div>
                <span className="text-sm">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
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

        {showCommentToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-[#5DA9B7]" />
            <p className="font-medium text-gray-900">
              <TranslatableText text="Comment posted successfully!" />
            </p>
          </div>
        )}

        {showReportToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p className="font-medium text-gray-900">
              <TranslatableText text="Report submitted successfully!" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolkTales;