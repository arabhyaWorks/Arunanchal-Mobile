import React from 'react';
import { Home, Video, Music, User, Calendar, MountainSnow } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TranslatableText } from '../components/TranslatableText';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF] flex flex-col">
      {children}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#165263]' : 'text-gray-500'}`}>
            <Home size={24} />
            <span className="text-xs mt-1"><TranslatableText text="Home" /></span>
          </Link>
          <Link to="/tribes" className={`flex flex-col items-center ${isActive('/tribes') ? 'text-[#165263]' : 'text-gray-500'}`}>
            <MountainSnow size={24} />
            <span className="text-xs mt-1"><TranslatableText text="Tribes" /></span>
          </Link>
          <Link to="/festivals" className={`flex flex-col items-center ${isActive('/festivals') ? 'text-[#165263]' : 'text-gray-500'}`}>
            <Calendar size={24} />
            <span className="text-xs mt-1"><TranslatableText text="Festivals" /></span>
          </Link>
          <Link to="/videos" className={`flex flex-col items-center ${isActive('/videos') ? 'text-[#165263]' : 'text-gray-500'}`}>
            <Video size={24} />
            <span className="text-xs mt-1"><TranslatableText text="Videos" /></span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-[#165263]' : 'text-gray-500'}`}>
            <User size={24} />
            <span className="text-xs mt-1"><TranslatableText text="Profile" /></span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout