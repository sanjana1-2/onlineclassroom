import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#3b82f610_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#6366f110_0%,transparent_40%)] -z-0"></div>
      
      {/* Decorative animated blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full glass-dark rounded-[2.5rem] shadow-2xl p-10 relative z-10 animate-slide-up border border-white/5 mx-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-3 tracking-tighter">
            Welcome <span className="text-gradient">Back</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg">Secure access to your academy</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-shake">
            <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-[10px]">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Identity</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-gray-600 transition-all duration-300 text-lg font-medium"
              placeholder="you@institution.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Security Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-gray-600 transition-all duration-300 text-lg font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-950 font-black text-lg py-4 px-6 rounded-2xl hover:bg-blue-500 hover:text-white transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-xl mt-4 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </span>
            ) : 'Enter Platform'}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-400 font-medium">
          New educator or student?{' '}
          <a href="/signup" className="text-white font-bold hover:text-blue-400 transition-colors underline decoration-white/10 underline-offset-8">
            Create account
          </a>
        </p>
      </div>
    </div>
  );

};
