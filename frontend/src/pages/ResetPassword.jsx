import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-100 opacity-50 blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-[#c7c4d8]/40 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-md">
            <span className="material-symbols-outlined text-[28px] text-white">enterprise</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-on-surface">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your new secure password details
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-error-container p-4 text-sm text-on-error-container border border-error/10">
            <AlertCircle className="h-5 w-5 text-error" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Password reset successfully! Redirecting to login...</span>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Confirm New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all active:scale-[0.98] shadow-md"
              >
                Reset Password
              </button>

              <Link
                to="/login"
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-transparent py-2 text-sm font-semibold text-primary hover:underline text-center"
              >
                <ArrowLeft className="h-4 w-4" /> Cancel and return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
