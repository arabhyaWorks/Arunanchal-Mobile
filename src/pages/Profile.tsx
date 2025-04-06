import React, { useState, useEffect } from 'react';
import { ChevronLeft, LogOut, Heart, MessageCircle, Share2, Flag, Edit, HelpCircle, Star, Camera, MessageSquare, Loader, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TranslatableText } from '../components/TranslatableText';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setFormData(parsedUser);
      } catch (error) {
        console.error('Error parsing userData:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    fetch('https://arunachal.upstateagro.com/api/users/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: userData.id,
        registration_number: userData.registration_number,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role_id: userData.role_id,
        status: userData.status,
        phone: formData.phone,
        profile_image_url: userData.profile_image_url || '',
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Failed to update profile');
          });
        }
        return response.json();
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.message || 'Failed to update profile');
        }
        // Update local storage with new data
        const updatedUserData = {
          ...userData,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setIsEditing(false);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error.message);
        setError(error.message || 'Failed to update profile. Please try again.');
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="text-[#165263]" />
            </Link>
            <h1 className="text-[#165263] text-xl font-semibold">
              <TranslatableText text="Profile" />
            </h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {!userData ? (
        /* Not Logged In Content */
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <img 
              src="https://arunachal.upstateagro.com/logo_ap.png" 
              alt="DIA Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-[#165263] mb-3">
            <TranslatableText text="Welcome to Tribal Heritage" />
          </h2>
          <p className="text-gray-600 mb-8">
            <TranslatableText text="Log in to access all features and explore the rich cultural heritage of Arunachal Pradesh" />
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Heart className="w-6 h-6 text-[#FF6B6B] mb-3" />
            <h3 className="font-medium text-[#165263] mb-2">
              <TranslatableText text="Like Content" />
            </h3>
            <p className="text-sm text-gray-500">
              <TranslatableText text="Save your favorite videos, music, and cultural content" />
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <MessageCircle className="w-6 h-6 text-[#4ECDC4] mb-3" />
            <h3 className="font-medium text-[#165263] mb-2">
              <TranslatableText text="Comment" />
            </h3>
            <p className="text-sm text-gray-500">
              <TranslatableText text="Engage in discussions about tribal culture and traditions" />
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Share2 className="w-6 h-6 text-[#45B7D1] mb-3" />
            <h3 className="font-medium text-[#165263] mb-2">
              <TranslatableText text="Share" />
            </h3>
            <p className="text-sm text-gray-500">
              <TranslatableText text="Share interesting content with friends and family" />
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Flag className="w-6 h-6 text-[#96CEB4] mb-3" />
            <h3 className="font-medium text-[#165263] mb-2">
              <TranslatableText text="Report" />
            </h3>
            <p className="text-sm text-gray-500">
              <TranslatableText text="Help maintain content quality by reporting issues" />
            </p>
          </div>
        </div>

        {/* Login Button */}
        <Link 
          to="/login"
          className="block w-full bg-[#165263] text-white py-3 rounded-xl font-medium hover:bg-[#0D3D4D] transition-colors mb-8 text-center"
        >
          <TranslatableText text="Log In" />
        </Link>
      </div>
      ) : (
        /* Logged In Content */
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-32 bg-gradient-to-r from-[#165263] to-[#5DA9B7] rounded-t-2xl"></div>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-semibold text-[#165263] border-4 border-white shadow-lg">
                  {(userData?.firstName?.[0] || '')}{(userData?.lastName?.[0] || '')}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#5DA9B7] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#165263] transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mt-20 mb-8">
            <h2 className="text-2xl font-semibold text-[#165263] mb-2">
              {userData?.firstName || ''} {userData?.lastName || ''}
            </h2>
            <p className="text-gray-600 mb-2">{userData?.email || ''}</p>
            <p className="text-[#5DA9B7] font-medium">{userData?.role || ''}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-[#165263] text-white rounded-xl hover:bg-[#0D3D4D] transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span><TranslatableText text="Edit Profile" /></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span><TranslatableText text="Logout" /></span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4">
            <Link to="/liked-content" className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#165263]">
                  <TranslatableText text="Liked & Followed Content" />
                </h3>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="View your liked videos, music, and followed tribes" />
                </p>
              </div>
            </Link>

            <div 
              onClick={() => {
                if (!userData) {
                  alert('Please log in to continue');
                  navigate('/login');
                  return;
                }
                if (userData.role === 'Artist') {
                  navigate('/dashboard');
                } else {
                  alert('Please sign up with a different account as a creator');
                }
              }}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#165263]">
                  <TranslatableText text={userData?.role === 'Artist' ? 'Go to Dashboard' : 'Become a Creator'} />
                </h3>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Share your tribal culture and heritage" />
                </p>
              </div>
            </div>

            <Link to="/help-support" className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#165263]">
                  <TranslatableText text="Help & Support" />
                </h3>
                <p className="text-sm text-gray-500">
                  <TranslatableText text="Get assistance and answers to your questions" />
                </p>
              </div>
            </Link>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all w-full"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#165263] text-left">
                  <TranslatableText text="Give Feedback" />
                </h3>
                <p className="text-sm text-gray-500 text-left">
                  <TranslatableText text="Share your thoughts and suggestions" />
                </p>
              </div>
            </button>
          </div>

          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full">
                <h3 className="text-xl font-bold text-[#165263] mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <TranslatableText text="Give Feedback" />
                </h3>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackLoading(true);
                  // Simulate API call
                  setTimeout(() => {
                    setFeedbackLoading(false);
                    setShowFeedbackModal(false);
                    setShowFeedbackSuccess(true);
                    setTimeout(() => setShowFeedbackSuccess(false), 3000);
                  }, 1500);
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#165263] mb-2">
                      <TranslatableText text="Name" />
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#165263] mb-2">
                      <TranslatableText text="Email" />
                    </label>
                    <input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#165263] mb-2">
                      <TranslatableText text="Phone Number" />
                    </label>
                    <input
                      type="tel"
                      value={feedbackForm.phone}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#165263] mb-2">
                      <TranslatableText text="Feedback" />
                    </label>
                    <textarea
                      value={feedbackForm.feedback}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <TranslatableText text="Cancel" />
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="px-6 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D] transition-colors flex items-center gap-2"
                    >
                      {feedbackLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <TranslatableText text="Submitting..." />
                        </>
                      ) : (
                        <TranslatableText text="Submit Feedback" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {showFeedbackSuccess && (
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right z-50">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <p className="font-medium text-gray-900">
                <TranslatableText text="Feedback submitted successfully!" />
              </p>
            </div>
          )}

          {/* Edit Profile Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-[#165263] mb-6">
                  <TranslatableText text="Edit Profile" />
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#165263] mb-2">
                        <TranslatableText text="First Name" />
                      </label>
                      <div className="relative">
                      <input
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7] disabled:bg-gray-100"
                        required
                      />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#165263] mb-2">
                        <TranslatableText text="Last Name" />
                      </label>
                      <div className="relative">
                      <input
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7] disabled:bg-gray-100"
                        required
                      />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#165263] mb-2">
                        <TranslatableText text="Email" />
                      </label>
                      <div className="relative">
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7] disabled:bg-gray-100"
                        required
                      />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#165263] mb-2">
                        <TranslatableText text="Phone" />
                      </label>
                      <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7] disabled:bg-gray-100"
                      />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#165263] mb-2">
                        <TranslatableText text="Role" />
                      </label>
                      <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
                        {formData.role || "User"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TranslatableText text="Cancel" />
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-[#165263] to-[#5DA9B7] text-white rounded-lg hover:from-[#0D3D4D] hover:to-[#4B8A96] transition-all shadow-md"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <TranslatableText text="Saving..." />
                        </div>
                      ) : (
                        <TranslatableText text="Save Changes" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

