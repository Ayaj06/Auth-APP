import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  HelpCircle, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/users', icon: Users, roles: ['Super Admin', 'Admin'] },
    { name: 'Profile & Settings', path: '/profile', icon: SettingsIcon },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col py-6 fixed left-0 top-0 z-[60] bg-on-surface text-surface-container-lowest shadow-lg">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[20px]">enterprise</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">SaaSPro</h1>
        </div>
        <p className="text-xs text-on-tertiary-container opacity-70">Management Console</p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          // Check role restrictions
          if (item.roles && user && !item.roles.includes(user.role)) {
            return null;
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 group active:scale-[0.98] ${
                isActive
                  ? 'bg-primary-container text-white shadow-md'
                  : 'text-on-tertiary-container hover:text-white hover:bg-tertiary-container'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}

        {/* Quick CTA */}
        <div className="pt-8">
          <button 
            onClick={() => navigate('/users?action=new')}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New User
          </button>
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="px-4 mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 py-2.5 px-4 text-on-tertiary-container hover:text-white hover:bg-tertiary-container rounded-lg transition-all duration-200"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">Support</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2.5 px-4 text-on-tertiary-container hover:text-white hover:bg-red-950/20 hover:text-red-400 rounded-lg transition-all duration-200 text-left"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};
