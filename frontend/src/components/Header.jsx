import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Search, Bell, HelpCircle, X, ShieldAlert, UserCheck, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Security Alert',
      description: 'Arthur Vance account has been suspended due to policy violation.',
      time: '1h ago',
      type: 'security',
      unread: true,
    },
    {
      id: 2,
      title: 'New Member',
      description: 'Jordan Henderson joined the system administration team.',
      time: '3h ago',
      type: 'user',
      unread: true,
    },
    {
      id: 3,
      title: 'Backup Successful',
      description: 'Daily database backup and snapshot completed successfully.',
      time: '5h ago',
      type: 'system',
      unread: false,
    },
  ];

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
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-full hover:bg-surface-container transition-colors relative"
          >
            <Bell className="h-5 w-5 text-on-surface-variant" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
          </button>

          {isOpen && (
            <>
              {/* Click-away overlay for mobile */}
              <div 
                className="fixed inset-0 z-40 bg-black/10 md:hidden" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown Container */}
              <div className="fixed inset-x-4 top-16 md:absolute md:right-0 md:left-auto md:top-full md:mt-2 md:w-80 bg-white border border-outline-variant rounded-xl shadow-lg z-50 flex flex-col max-h-[400px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container/20">
                  <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-surface-container transition-colors md:hidden"
                  >
                    <X className="h-4 w-4 text-on-surface-variant" />
                  </button>
                </div>
                
                <div className="divide-y divide-outline-variant overflow-y-auto custom-scrollbar flex-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3.5 flex gap-3 hover:bg-surface-container/10 transition-colors ${notif.unread ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notif.type === 'security' ? 'bg-red-50 text-red-600' :
                        notif.type === 'user' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {notif.type === 'security' ? <ShieldAlert className="h-4 w-4" /> :
                         notif.type === 'user' ? <UserCheck className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-bold text-on-surface truncate ${notif.unread ? 'text-primary' : ''}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-on-surface-variant shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2.5 border-t border-outline-variant text-center bg-surface-container/10">
                  <button className="text-xs font-bold text-primary hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

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
