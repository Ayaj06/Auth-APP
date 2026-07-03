import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { User, Mail, Shield, CheckCircle, AlertCircle, KeyRound, Save } from 'lucide-react';

export const Profile = () => {
  const { user, checkAuth } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        avatar_url: avatarUrl || null,
      };
      if (password) {
        payload.password = password;
      }
      
      await axios.put(`http://localhost:8000/api/users/${user.id}`, payload);
      setSuccess('Profile details saved successfully!');
      setPassword('');
      checkAuth();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Sidebar />
      <Header />

      <main className="md:ml-64 p-6 md:p-8 min-h-[calc(100vh-64px)] max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface mb-1">Profile & Settings</h1>
          <p className="text-sm text-on-surface-variant">Update your account settings and personal details.</p>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-error-container p-4 text-sm text-on-error-container border border-error/10">
              <AlertCircle className="h-5 w-5 text-error" />
              <span>{error}</span>
            </div>
          )}

          {/* User Profile Card */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-outline-variant">
            {user?.avatar_url ? (
              <img
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full border border-primary-container object-cover"
                src={user.avatar_url}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-2xl">
                {user?.full_name ? user.full_name[0] : 'U'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">{user?.full_name}</h3>
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>{user?.role}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-outline" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="e.g. Alex Rivera"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address (Read-only)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-outline opacity-60" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full rounded-lg border border-outline-variant bg-slate-50 py-2.5 pl-10 pr-3 text-on-surface-variant cursor-not-allowed outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Avatar URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 px-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="border-t border-outline-variant pt-6">
              <h4 className="text-sm font-bold text-on-surface mb-4">Security Settings</h4>
              
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">New Password (leave blank to keep current)</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-md"
              >
                <Save className="h-4.5 w-4.5" />
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
