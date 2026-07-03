import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-8 w-full h-16 sticky top-0 z-50 bg-white border-b border-outline-variant shadow-sm md:pl-72">
      <div className="flex items-center gap-6 flex-1">
        <span 
          onClick={() => navigate('/')} 
          className="text-xl font-bold text-primary md:hidden cursor-pointer"
        >
          SaaSPro
        </span>
        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-1.5 bg-surface-container border border-outline-variant rounded-full text-sm placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Search analytics, users, or reports..."
            type="text"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors relative">
          <Bell className="h-5 w-5 text-on-surface-variant" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
        </button>
        <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors">
          <HelpCircle className="h-5 w-5 text-on-surface-variant" />
        </button>
        
        <div className="h-6 w-[1px] bg-outline-variant"></div>
        
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-85 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">
              {user?.full_name || 'Alex Rivera'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {user?.role || 'Super Admin'}
            </p>
          </div>
          {user?.avatar_url ? (
            <img
              alt="User profile"
              className="w-9 h-9 rounded-full border border-primary-container object-cover"
              src={user.avatar_url}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
              {(user?.full_name || 'A')[0]}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
