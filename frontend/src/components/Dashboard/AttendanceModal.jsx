import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api.js';

export const AttendanceModal = ({ room, onClose }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room?._id) {
      fetchAttendance();
    }
  }, [room]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getRoomAttendance(room._id);
      setAttendance(response.data.attendance || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records.');
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-dark w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-3xl font-black text-white font-heading tracking-tight">Attendance <span className="text-gradient">Sheet</span></h2>
            <p className="text-gray-400 font-medium">{room.title} • {room.roomCode}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Retrieving records...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10">
              <p className="text-red-400 font-bold">{error}</p>
              <button onClick={fetchAttendance} className="mt-4 text-blue-400 font-black uppercase text-xs hover:underline">Try Again</button>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Records Found</h3>
              <p className="text-gray-500">No students have joined this session yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Joined At</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendance.map((record, idx) => (
                    <tr key={record._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                            {record.student?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-gray-200 font-bold">{record.student?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{record.student?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(record.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 font-mono text-xs">
                          {record.duration ? `${record.duration}m` : '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {record.leftAt ? (
                          <span className="bg-gray-500/10 text-gray-500 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest">Left</span>
                        ) : (
                          <span className="bg-green-500/10 text-green-500 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Present</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-black/20">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Total Attendees: {attendance.length}</p>
          <button 
            onClick={onClose}
            className="bg-white text-gray-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
