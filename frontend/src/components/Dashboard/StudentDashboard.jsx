import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';

export const StudentDashboard = () => {
  const { logout } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicRooms();
    const interval = setInterval(fetchPublicRooms, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const response = await roomAPI.getPublicRooms();
      setRooms(response.data.rooms || []);
    } catch (err) {
      console.error('Error fetching public rooms:', err);
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const trimmedCode = roomCode.trim();
      const response = await roomAPI.getRoomByCode(trimmedCode);
      if (response.data.room) {
        navigate(`/classroom/${trimmedCode}`);
      }
    } catch (err) {
      setError('Room not found or invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#eff6ff_0%,transparent_40%),radial-gradient(circle_at_80%_80%,#f5f3ff_0%,transparent_40%)] -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-2">
              <span className="text-gray-900">Student</span> <span className="text-gradient">Portal</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">Discover and join your interactive learning sessions</p>
          </div>
          <button
            onClick={logout}
            className="glass text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all border-red-100"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Join Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 self-start animate-slide-up">
            <div className="glass p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-white/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
              
              <h2 className="text-2xl font-black text-gray-900 mb-6 font-heading">Direct Entry</h2>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold animate-shake">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleJoinRoom} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ml-1">Session Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="E.G. MATH-101"
                    className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-xl font-mono font-black tracking-widest placeholder:font-sans placeholder:tracking-normal placeholder:font-medium"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 group disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? 'Joining...' : 'Enter Classroom'}
                  {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>}
                </button>
              </form>
            </div>
            
            <div className="mt-8 p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="font-black text-lg mb-1 relative z-10">New here?</h4>
              <p className="text-blue-100 text-sm font-medium relative z-10">Contact your teacher for the private room code if it's not listed here.</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-heading flex items-center gap-3">
              Live Now
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </h2>
            
            {roomsLoading ? (
              <div className="text-center py-20 animate-pulse">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-400 font-bold text-lg tracking-tight">Scanning for active sessions...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="glass p-16 rounded-3xl border border-white/40 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-50">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 font-heading">Quiet Zone</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">There are no public classes live right now. Use a room code to join private sessions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room, index) => (
                  <div 
                    key={room._id} 
                    className="glass group rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col bg-white/60"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-gray-900 line-clamp-1 font-heading group-hover:text-blue-600 transition-colors">{room.title}</h3>
                        <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                          Live
                        </span>
                      </div>
                      
                      <p className="text-gray-500 mb-8 font-medium line-clamp-2 min-h-[3rem] leading-relaxed">{room.description}</p>
                      
                      <div className="mt-auto space-y-6">
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white/60">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
                            {room.teacher?.name?.charAt(0).toUpperCase() || 'T'}
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Educator</p>
                            <p className="text-gray-900 font-bold leading-none">{room.teacher?.name || 'Academic Faculty'}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/classroom/${room.roomCode}`)}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-95"
                        >
                          Join Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};
