import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Check
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

interface Notification {
  id: number;
  notification_type: string;
  content: string;
  timestamp: string;
  seen: boolean;
  link?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`https://arabhaya2.bidabhadohi.com/api/notification/get?user_id=${user?.id}`);
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case "Pending Approval":
        return AlertTriangle;
      case "Reupload Requested":
        return AlertTriangle;
      case "Content Live":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "Pending Approval":
        return "text-amber-500";
      case "Reupload Requested":
        return "text-blue-500";
      case "Content Live":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "Pending Approval":
        return "bg-amber-50";
      case "Reupload Requested":
        return "bg-blue-50";
      case "Content Live":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  const markAsSeen = async (notificationId: number) => {
    try {
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, seen: true } : n))
      );

      const response = await fetch("/api/notification/mark-seen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notificationId }),
      });
      
      const data = await response.json();
      if (data.success) {
        setToastMessage("Notification marked as read");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } else {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, seen: false } : n))
        );
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error marking notification as seen:', err);
      setToastMessage("Failed to mark notification as read");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            <TranslatableText text="Please Log In" />
          </h2>
          <p className="text-gray-500 mb-4">
            <TranslatableText text="Log in to view your notifications" />
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D] transition-colors"
          >
            <TranslatableText text="Log In" />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF]">
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="text-[#165263]" />
          </button>
          <h1 className="text-[#165263] text-lg font-medium">
            <TranslatableText text="Notifications" />
          </h1>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
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
          <TranslatableText text="Notifications" />
        </h1>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              <TranslatableText text="No Notifications" />
            </h2>
            <p className="text-gray-500">
              <TranslatableText text="You're all caught up!" />
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.notification_type);
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 transition-all ${
                  !notification.seen ? 'shadow-md' : 'shadow-sm'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-3 ${getBgColor(notification.notification_type)} rounded-full`}>
                    <Icon className={`h-6 w-6 ${getIconColor(notification.notification_type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {notification.notification_type}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-[#5DA9B7] hover:text-[#165263] text-sm font-medium"
                          onClick={() => markAsSeen(notification.id)}
                        >
                          <TranslatableText text="View" />
                        </a>
                      )}
                      {!notification.seen && (
                        <button
                          onClick={() => markAsSeen(notification.id)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          <TranslatableText text="Mark as read" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Notifications;