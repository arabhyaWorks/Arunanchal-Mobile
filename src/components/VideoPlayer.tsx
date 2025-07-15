import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flag, Share2, Heart, RotateCw, MessageCircle, Check, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { TranslatableText } from './TranslatableText';

interface VideoPlayerProps {
  videos: Array<{
    id: number;
    title: string;
    file_path: string;
    thumbnail_path: string;
  }>;
}

const VideoPlayer = ({ videos }: VideoPlayerProps) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showLikeToast, setShowLikeToast] = useState(false);
  const [showCommentToast, setShowCommentToast] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

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
    const fetchVideo = async () => {
      try {
        let url = `https://arunachal.upstateagro.com/api/category/items?category_id=2&item_id=${id}`;
        if (user?.id) url += `&user_id=${user.id}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.data) {
          const foundVideo = data.data[0];
          console.log('Found video:', foundVideo);
          if (foundVideo) {
            const videoData = {
              id: foundVideo.id,
              title: foundVideo.name,
              comment_count: foundVideo.comment_count || 0,
              description: foundVideo.description,
              views_count: foundVideo.view_count || 0,
              created_at: foundVideo.created_at,
              ...foundVideo.attributes?.find(
                (attr: any) => attr.attribute_name === 'cat-FolkDance-VideoOfTheDance'
              )?.attribute_value?.value?.[0],
              tribe: {
                name: foundVideo.attributes?.find(
                  (attr: any) => attr.attribute_name === 'cat-FolkDance-Tribe'
                )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe',
                thumbnail: 'https://arunachal.upstateagro.com/logo_ap.png'
              }
            };
            setVideo(videoData);
            // Set comments in their original order (newest first)
            const sortedComments = foundVideo.comments || [];
            setComments(sortedComments);
            setIsLiked(foundVideo.is_liked || false);
            // Transform and set recommended videos
            const otherVideos = data.data
              .filter((item: any) => item.id !== Number(id))
              .map((video: any) => ({
                id: video.id,
                name: video.name,
                view_count: video.view_count || 0,
                thumbnail_path: video.attributes?.find(
                  (attr: any) => attr.attribute_name === 'cat-FolkDance-VideoOfTheDance'
                )?.attribute_value?.value?.[0]?.thumbnail_path || '',
                tribe: {
                  name: video.attributes?.find(
                    (attr: any) => attr.attribute_name === 'cat-FolkDance-Tribe'
                  )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe'
                }
              }));
            setRecommendedVideos(otherVideos);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this video');
      return;
    }

    const method = isLiked ? 'DELETE' : 'POST';
    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items/likes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_item_id: id, user_id: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(!isLiked);
        setVideo(prev => ({
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/category/items/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_item_id: id,
          user_id: user.id,
          content: newComment,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        const newCommentObj = {
          id: data.comment_id,
          content: newComment,
          created_at: new Date().toISOString(),
          first_name: user.first_name,
          last_name: user.last_name,
        };
        setComments(prev => [newCommentObj, ...prev]);
        setVideo(prev => ({ ...prev, comment_count: (prev.comment_count || 0) + 1 }));
        setNewComment('');
        setShowCommentToast(true);
        setTimeout(() => setShowCommentToast(false), 2000);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const isYouTubeVideo = (url: string) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      console.error('Invalid URL:', e);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl mb-4">{error || 'Video not found'}</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen bg-[#F0FFFF] ${isLandscape ? 'landscape' : ''}`}>
      {/* Video Player Section */}
      <div className="relative bg-black">
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-black/50 rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        {isYouTubeVideo(video.file_path) ? (
          <div className="w-full h-[240px] md:h-[360px] lg:h-[480px]">
            <ReactPlayer
              url={video.file_path}
              width="100%"
              height="100%"
              controls
              playing
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                  },
                },
              }}
            />
          </div>
        ) : (
          <video
            src={video.file_path}
            controls
            className="w-full h-[240px] md:h-[360px] lg:h-[480px] object-contain bg-black"
            poster={video.thumbnail_path}
          />
        )}
      </div>

      {/* Video Info Section */}
      <div className="bg-white p-4 md:p-6 rounded-t-xl -mt-2 relative z-10">
        <h1 className="text-xl font-semibold text-[#165263] mb-3">
          <TranslatableText text={video.title} />
        </h1>
        
        {/* Video Stats and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            {video.views_count?.toLocaleString()} views • {formatDate(video.created_at)}
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex flex-col items-center ${isLiked ? 'text-[#5DA9B7]' : 'text-gray-600'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">Like</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex flex-col items-center text-gray-600"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="flex flex-col items-center text-gray-600"
            >
              <Flag className="w-5 h-5" />
              <span className="text-sm">Report</span>
            </button>
          </div>
        </div>

        {/* Tribe Info */}
        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl mb-6">
          <img
            src={video.tribe?.thumbnail}
            alt={video.tribe?.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h3 className="font-semibold text-[#165263] mb-1">
              <TranslatableText text={video.tribe?.name} />
            </h3>
            <p className="text-sm text-gray-500"></p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-[#165263]" />
            <h2 className="text-[#165263] font-semibold text-lg">
              Comments ({video.comment_count || 0})
            </h2>
          </div>
          <form onSubmit={handleAddComment} className="flex items-start gap-4 mb-6">
            {user ? (
              <div className="w-8 h-8 rounded-full bg-[#5DA9B7] text-white flex items-center justify-center text-sm">
                {getInitials(user.first_name, user.last_name)}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                ?
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Add a comment..." : "Please log in to comment"}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5DA9B7] focus:border-transparent resize-none"
                rows={3}
                disabled={!user}
              />
              {user && newComment.trim() && (
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5DA9B7] text-white rounded-lg text-sm font-medium hover:bg-[#165263] transition-colors"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5DA9B7] text-white flex items-center justify-center text-sm">
                    {getInitials(comment.first_name, comment.last_name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.first_name} {comment.last_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>

      {/* Recommended Videos */}
      <div className="bg-gray-50 p-4 md:p-6">
        <h2 className="text-[#165263] font-semibold text-lg mb-6">Recommended Videos</h2>
        <div className="space-y-4"> 
          {recommendedVideos.slice(0, 5).map((recVideo: any) => (
            <Link
              key={recVideo.id}
              to={`/video/${recVideo.id}`}
              className="flex gap-4 group"
            >
              <div className="w-40 aspect-video rounded-xl overflow-hidden shadow-sm">
                <img
                  src={recVideo.thumbnail_path || 'https://arunachal.upstateagro.com/logo_ap.png'}
                  alt={recVideo.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#165263] line-clamp-2 mb-2 group-hover:text-[#5DA9B7] transition-colors">
                  {recVideo.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {recVideo.tribe.name}
                </p>
                <p className="text-xs text-gray-500">
                  {recVideo.view_count.toLocaleString()} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#165263] flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-500" />
                Report Video
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter reason for reporting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Provide more details about the issue"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
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
                          category_item_id: id,
                          user_id: user.id,
                          reason: reportReason,
                          details: reportDetails,
                        }),
                      });
                      const data = await response.json();
                      if (data.success) {
                        setShowReportModal(false);
                        setReportReason('');
                        setReportDetails('');
                        setShowReportToast(true);
                        setTimeout(() => setShowReportToast(false), 2000);
                      }
                    } catch (error) {
                      console.error('Error submitting report:', error);
                    }
                  }}
                  disabled={!reportReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {showLikeToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <p className="text-gray-900 font-medium">
              {isLiked ? 'You liked this video!' : 'You removed your like'}
            </p>
          </div>
        )}
        {showCommentToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right">
            <MessageCircle className="h-5 w-5 text-[#5DA9B7]" />
            <p className="text-gray-900 font-medium">Comment posted successfully!</p>
          </div>
        )}
        {showReportToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-gray-900 font-medium">Report submitted successfully!</p>
          </div>
        )}
        {showCopiedToast && (
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right">
            <Check className="h-5 w-5 text-[#5DA9B7]" />
            <p className="text-gray-900 font-medium">Link copied to clipboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;