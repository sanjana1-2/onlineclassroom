import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { AttendanceModal } from './AttendanceModal.jsx';

export const TeacherDashboard = () => {
  const { logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxParticipants: 100,
    isPrivate: false,
  });
  const [error, setError] = useState('');
  const [selectedRoomForAttendance, setSelectedRoomForAttendance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    // Refresh rooms every 2 seconds
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      setError('');
      const response = await roomAPI.getTeacherRooms();
      console.log('Rooms fetched:', response.data);
      setRooms(response.data.rooms || []);
      setLoading(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error fetching rooms';
      console.error('Error fetching rooms:', error);
      setError(errorMsg);
      setRooms([]);
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await roomAPI.createRoom(formData);
      setFormData({ title: '', description: '', maxParticipants: 100, isPrivate: false });
      setShowCreateForm(false);
      fetchRooms();
      alert('Room created successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error creating room';
      console.error('Error creating room:', error);
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleStartRoom = async (roomId) => {
    try {
      await roomAPI.startRoom(roomId);
      fetchRooms();
    } catch (error) {
      console.error('Error starting room:', error);
    }
  };

  const handleEndRoom = async (roomId) => {
    try {
      await roomAPI.endRoom(roomId);
      fetchRooms();
    } catch (error) {
      console.error('Error ending room:', error);
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
              <span className="text-gray-900">Teacher</span> <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">Orchestrate your virtual learning environment</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchRooms}
              className="glass text-gray-700 px-5 py-3 rounded-2xl font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Class
            </button>
            <button
              onClick={logout}
              className="glass text-red-600 px-5 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all border-red-100"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="glass border-l-4 border-red-500 text-red-700 p-5 rounded-2xl mb-8 shadow-sm animate-fade-in flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">!</div>
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {showCreateForm && (
          <div className="glass p-8 rounded-3xl shadow-2xl shadow-blue-900/5 mb-12 border border-white/40 animate-slide-up overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-heading">Design Your Session</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-1">Class Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-lg font-medium"
                    placeholder="e.g. Quantum Physics 101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-lg font-medium"
                  />
                </div>
              </div>

              <div className="mb-8 space-y-2">
                <label className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm min-h-[120px] text-lg"
                  placeholder="What will students learn in this session?"
                />
              </div>

              <div className="mb-10 bg-white/40 p-6 rounded-2xl border border-white/60 backdrop-blur-sm">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${formData.isPrivate ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${formData.isPrivate ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-4">
                    <span className="block text-gray-900 font-bold text-lg">Private Session</span>
                    <span className="block text-sm text-gray-500">Only students with the room code can discover and join.</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-8 py-4 text-gray-500 font-bold rounded-2xl hover:bg-white/50 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Launch Class
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-32 animate-pulse">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-400 font-bold text-xl tracking-tight">Syncing your classrooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl border border-white/40 animate-fade-in">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 animate-float">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 font-heading">Empty Space</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium text-lg">Your educational empire starts here. Create your first live session to begin the journey.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 transform hover:scale-105"
            >
              Start Building
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div 
                key={room._id} 
                className={`glass group rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in flex flex-col ${room.isActive ? 'ring-2 ring-green-500/30 bg-white/80' : 'bg-white/60'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-2.5 w-full ${room.isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' : 'bg-gray-100'}`}></div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-gray-900 line-clamp-1 font-heading group-hover:text-blue-600 transition-colors">{room.title}</h3>
                    {room.isActive && (
                      <span className="bg-green-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-green-500/30">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-500 mb-8 font-medium line-clamp-2 min-h-[3rem] leading-relaxed">{room.description || 'No description provided for this session.'}</p>
                  
                  <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-white/60">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Room Code</p>
                        <p className="font-mono font-black text-gray-900 text-xl tracking-widest">{room.roomCode}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {room.isPrivate ? (
                          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm" title="Private">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm" title="Public">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!room.isActive ? (
                        <button
                          onClick={() => handleStartRoom(room._id)}
                          className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 group/btn"
                        >
                          Start Session
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/classroom/${room.roomCode}`)}
                            className="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-95"
                          >
                            Join Now
                          </button>
                          <button
                            onClick={() => setSelectedRoomForAttendance(room)}
                            className="flex-1 bg-white/10 text-gray-700 px-4 py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all border border-white/20 flex items-center justify-center shadow-sm"
                            title="View Attendance"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                          </button>
                          <button
                            onClick={() => handleEndRoom(room._id)}
                            className="flex-1 bg-red-50 text-red-600 px-4 py-4 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center"
                            title="End Session"
                          >
                            End
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {selectedRoomForAttendance && (
        <AttendanceModal 
          room={selectedRoomForAttendance} 
          onClose={() => setSelectedRoomForAttendance(null)} 
        />
      )}
    </div>
  );

};
