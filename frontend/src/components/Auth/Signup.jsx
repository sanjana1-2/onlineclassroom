import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.STUDENT,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium overflow-hidden relative py-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#3b82f610_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#6366f110_0%,transparent_40%)] -z-0"></div>
      
      {/* Decorative animated blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full glass-dark rounded-[2.5rem] shadow-2xl p-10 relative z-10 animate-slide-up border border-white/5 mx-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-3 tracking-tighter">
            Join the <span className="text-gradient">Academy</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg">Your journey to mastery starts here</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-shake">
            <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-[10px]">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-gray-600 transition-all duration-300 text-base font-medium"
              placeholder="Prof. John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-gray-600 transition-all duration-300 text-base font-medium"
              placeholder="you@institution.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-gray-600 transition-all duration-300 text-base font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Your Role</label>
            <div className="relative group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white transition-all duration-300 appearance-none text-base font-medium"
              >
                <option value={ROLES.STUDENT} className="text-gray-900">Academic Student</option>
                <option value={ROLES.TEACHER} className="text-gray-900">Lead Educator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500 group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-950 font-black text-lg py-4 px-6 rounded-2xl hover:bg-blue-500 hover:text-white transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-xl mt-4 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Creating Profile...
              </span>
            ) : 'Launch Profile'}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-400 font-medium">
          Already a member?{' '}
          <a href="/login" className="text-white font-bold hover:text-blue-400 transition-colors underline decoration-white/10 underline-offset-8">
            Log in
          </a>
        </p>
      </div>
    </div>
  );

};
