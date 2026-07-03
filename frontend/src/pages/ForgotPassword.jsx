import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</span>
            </div>
            <Link
              to="/login"
              className="flex w-full justify-center items-center gap-2 rounded-lg border border-outline-variant bg-white py-2 px-4 text-sm font-semibold text-on-surface hover:bg-slate-50 transition-all text-center"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-outline" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all active:scale-[0.98] shadow-md"
              >
                Send Reset Link
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
