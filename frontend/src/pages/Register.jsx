import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, KeyRound, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/register', {
        email,
        full_name: fullName,
        password,
        role: 'Member',
        status: 'Active'
      });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-purple-100 opacity-50 blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-[#c7c4d8]/40 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-md">
            <span className="material-symbols-outlined text-[28px] text-white">enterprise</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-on-surface">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Register a new system console account
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-error-container p-4 text-sm text-on-error-container border border-error/10">
            <AlertCircle className="h-5 w-5 text-error" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Name</label>
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
                placeholder="Alex Rivera"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-outline" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Password</label>
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
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Confirm Password</label>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="group relative flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-md"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
