import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TranslatableText } from '../components/TranslatableText';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Log form submission data
    console.log('Login form submitted with:', {
      email,
      password: '********' // Don't log actual password
    });

    try {
      const response = await fetch('https://arunachal.upstateagro.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Log API response
      console.log('Login API Response:', {
        success: data.success,
        status: response.status,
        userData: data.user
      });

      console.log(response)
      

      if (!response.ok) {
        console.log(response)
        throw new Error(data.error || 'Login failed');
      }

      // Log user data before storing
      console.log('Storing user data:', {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        permissions: data.user.permissions,
        status: data.user.status,
        phone: data.user.phone
      });

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        permissions: data.user.permissions,
        status: data.user.status,
        phone: data.user.phone
      }));

      // Log navigation destination
      console.log('Redirecting user to:', data.user.role === 'Artist' ? '/dashboard' : '/profile');

      // Redirect based on role
      if (data.user.role === 'Artist') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      // Log error details
      console.error('Login error:', {
        error: err,
        message: (err as Error).message,
        email: email // Log email for debugging failed attempts
      });
      setError((err as Error).message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[#165263]" />
            </button>
          </div>

          {/* Logo and Header */}
          <div className="text-center">
            <img 
              src="https://arunachal.upstateagro.com/logo_ap.png" 
              alt="Logo" 
              className="h-16 mx-auto mb-6" 
            />
            <h2 className="text-3xl font-bold text-[#165263] mb-2">
              <TranslatableText text="Sign In" />
            </h2>
            <p className="text-gray-600">
              <TranslatableText text="Login to stay connected." />
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-2">
                <TranslatableText text="Email" /><span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                  placeholder="xyz@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-2">
                <TranslatableText text="Password" /><span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#5DA9B7] focus:ring-[#5DA9B7] border-gray-300 rounded"
                  disabled={loading}
                />
                <label className="ml-2 block text-sm text-gray-600">
                  <TranslatableText text="Save Password" />
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#5DA9B7] hover:text-[#165263]"
                >
                  <TranslatableText text="Forgot Password?" />
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#165263] to-[#5DA9B7] hover:from-[#0D3D4D] hover:to-[#4B8A96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5DA9B7] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <TranslatableText text="Processing..." />
              ) : (
                <TranslatableText text="Sign In" />
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              <TranslatableText text="Don't have an account?" />{" "}
              <Link
                to="/signup"
                className="font-medium text-[#5DA9B7] hover:text-[#165263]"
              >
                <TranslatableText text="Click here to sign up." />
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#165263]/20 to-[#5DA9B7]/20">
        <div className="h-full flex items-center justify-center p-12">
          <img
            src="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d"
            alt="Tribal Art"
            className="w-3/4 h-auto object-contain rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;