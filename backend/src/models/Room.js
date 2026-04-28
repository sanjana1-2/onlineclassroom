import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a room title'],
  },
  description: {
    type: String,
    default: '',
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  maxParticipants: {
    type: Number,
    default: 100,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  settings: {
    allowScreenShare: { type: Boolean, default: true },
    allowChat: { type: Boolean, default: true },
    allowRaiseHand: { type: Boolean, default: true },
    allowPolls: { type: Boolean, default: true },
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date }
  }]
}, { timestamps: true });

// Pre-save hook to generate a room code if it doesn't exist
roomSchema.pre('validate', function(next) {
  if (!this.roomCode) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.roomCode = code;
  }
  next();
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
