import Room from '../models/Room.js';
import logger from '../utils/logger.js';

export const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join room
    socket.on('join-room', async (data) => {
      logger.info(`join-room received data: ${JSON.stringify(data)}`);
      const { roomCode, userId, userName } = data;
      socket.join(roomCode);
      socket.userInfo = { userId, userName, roomCode };

      try {
        const room = await Room.findOne({ roomCode });
        if (room) {
          room.participants.push({
            user: userId,
            joinedAt: new Date(),
          });
          await room.save();
        }

        // Gather existing participants to send to the newly joined user
        const clients = io.sockets.adapter.rooms.get(roomCode) || new Set();
        const existingParticipants = [];
        for (const clientId of clients) {
          if (clientId !== socket.id) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket && clientSocket.userInfo) {
              existingParticipants.push({
                userId: clientSocket.userInfo.userId,
                userName: clientSocket.userInfo.userName,
                socketId: clientId,
              });
            }
          }
        }
        
        socket.emit('room-state', existingParticipants);

        // Broadcast to everyone EXCEPT the joining user
        socket.to(roomCode).emit('user-joined', {
          userId,
          userName,
          socketId: socket.id,
          totalParticipants: room?.participants.length,
        });
      } catch (error) {
        logger.error('Join room error:', error);
      }
    });

    // Leave room
    socket.on('leave-room', async (data) => {
      logger.info(`leave-room received data: ${JSON.stringify(data)}`);
      const { roomCode, userId } = data;
      socket.leave(roomCode);

      try {
        const room = await Room.findOne({ roomCode });
        if (room) {
          // Find the active participant entry (where leftAt is null)
          const participant = room.participants.find(p => 
            p.user && p.user.toString() === userId && !p.leftAt
          );
          if (participant) {
            participant.leftAt = new Date();
          }
          await room.save();
        }

        io.to(roomCode).emit('user-left', {
          userId,
          socketId: socket.id,
          totalParticipants: room?.participants.filter(p => !p.leftAt).length,
        });
      } catch (error) {
        logger.error('Leave room error:', error);
      }
    });

    // WebRTC offer
    socket.on('webrtc-offer', (data) => {
      const { to, offer } = data;
      io.to(to).emit('webrtc-offer', {
        from: socket.id,
        userId: socket.userInfo?.userId,
        userName: socket.userInfo?.userName,
        offer,
      });
    });

    // WebRTC answer
    socket.on('webrtc-answer', (data) => {
      const { to, answer } = data;
      io.to(to).emit('webrtc-answer', {
        from: socket.id,
        answer,
      });
    });

    // ICE candidate
    socket.on('ice-candidate', (data) => {
      const { to, candidate } = data;
      io.to(to).emit('ice-candidate', {
        from: socket.id,
        candidate,
      });
    });

    // Screen share start
    socket.on('screen-share-start', (data) => {
      const { roomCode, userId } = data;
      io.to(roomCode).emit('screen-share-started', { userId });
    });

    // Screen share stop
    socket.on('screen-share-stop', (data) => {
      const { roomCode, userId } = data;
      io.to(roomCode).emit('screen-share-stopped', { userId });
    });

    // Raise hand
    socket.on('raise-hand', (data) => {
      const { roomCode, userId, userName } = data;
      io.to(roomCode).emit('hand-raised', { userId, userName });
    });

    // Lower hand
    socket.on('lower-hand', (data) => {
      const { roomCode, userId } = data;
      io.to(roomCode).emit('hand-lowered', { userId });
    });

    // Emoji reaction
    socket.on('emoji-reaction', (data) => {
      const { roomCode, emoji, userId } = data;
      io.to(roomCode).emit('emoji-reaction', { emoji, userId });
    });

    // Chat message
    socket.on('chat-message', (data) => {
      const { roomCode, message } = data;
      // Broadcast to everyone EXCEPT sender (sender already added it optimistically)
      socket.to(roomCode).emit('chat-message', message);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${socket.id}`);
      if (socket.userInfo) {
        const { roomCode, userId } = socket.userInfo;
        
        try {
          const room = await Room.findOne({ roomCode });
          if (room) {
            const participant = room.participants.find(p => 
              p.user && p.user.toString() === userId && !p.leftAt
            );
            if (participant) {
              participant.leftAt = new Date();
              await room.save();
            }
          }

          io.to(roomCode).emit('user-left', {
            userId,
            socketId: socket.id,
            totalParticipants: room?.participants.filter(p => !p.leftAt).length,
          });
        } catch (error) {
          logger.error('Disconnect update error:', error);
        }
      }
    });


  });
};
