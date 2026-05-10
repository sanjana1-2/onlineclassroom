# Live Classroom Platform

A scalable, real-time educational platform similar to Zoom, built with modern web technologies. Designed specifically for educational institutions with features for live streaming, engagement, and AI-powered learning tools.

## Features
.
### Core Features

- **Real-time Video/Audio Streaming** - WebRTC-based peer-to-peer communication
- **Screen Sharing** - Teachers can share their screen with students
- **Live Chat** - Group and private messaging within classrooms
- **Attendance Tracking** - Automatic attendance recording
- **Role-Based Access Control** - Separate teacher and student interfaces

### Engagement Tools

- **Raise Hand** - Students can raise hands to ask questions
- **Emoji Reactions** - Real-time emoji reactions during class
- **Polls** - Create and conduct live polls
- **Quizzes** - Real-time quiz system with instant grading
- **Anonymous Doubt Box** - Students can ask anonymous questions

### AI-Powered Features

- **Auto Lecture Summary** - OpenAI-powered lecture summarization
- **Timestamped Notes** - Automatic note generation with timestamps
- **Quiz Generation** - AI-generated quiz questions from lecture content

### Dashboard Features

**Teacher Dashboard:**
- Schedule and manage classes
- View attendance records
- Manage student list
- Access recordings
- Generate and publish notes

**Student Dashboard:**
- Join scheduled classes via room code
- View attendance history
- Download notes
- Access recordings

### Recording System

- Record live sessions
- Store metadata in MongoDB
- Access control (public/private/students only)
- Download recordings

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.io
- **Database:** MongoDB
- **Authentication:** JWT
- **AI:** OpenAI API
- **Video:** WebRTC

### Frontend

- **Framework:** React 18
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Real-time:** Socket.io-client
- **Build Tool:** Vite
- **Routing:** React Router

### Infrastructure

- **Database:** MongoDB Atlas
- **Deployment:** Vercel (Frontend), Railway/Heroku (Backend)
- **CDN:** Vercel/Netlify CDN

## Project Structure

```
live-classroom-platform/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── events/         # Socket.io events
│   │   └── utils/          # Utility functions
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── utils/          # Utilities
│   │   └── styles/         # Global styles
│   └── index.html          # Entry HTML
└── docs/                   # Documentation
```

## Quick Start

### Prerequisites

- Node.js v16+
- MongoDB Atlas account
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with API URLs
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](./docs/API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## Database Schema

### Users
- Authentication and profile management
- Role-based access control

### Rooms
- Classroom sessions
- Participant tracking
- Recording metadata

### Messages
- Group and private chat
- Message history

### Attendance
- Session attendance records
- Duration tracking

### Notes
- Lecture notes
- AI-generated summaries
- Timestamped content

### Polls & Quizzes
- Live engagement tools
- Response tracking
- Scoring system

### Recordings
- Video metadata
- Access control
- Storage information

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/code/:roomCode` - Get room
- `POST /api/rooms/:roomId/start` - Start session
- `POST /api/rooms/:roomId/end` - End session

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/room/:roomId` - Get room messages
- `GET /api/messages/private/:userId` - Get private messages

### Attendance
- `POST /api/attendance` - Record attendance
- `GET /api/attendance/room/:roomId` - Get attendance

### Polls & Quizzes
- `POST /api/polls` - Create poll
- `POST /api/polls/vote` - Vote on poll
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/submit` - Submit quiz

### AI Features
- `POST /api/ai/notes/generate` - Generate notes
- `GET /api/ai/notes/room/:roomId` - Get notes

## Socket.io Events

### Classroom Events
- `join-room` - Join classroom
- `leave-room` - Leave classroom
- `user-joined` - User joined notification
- `user-left` - User left notification

### WebRTC Events
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `ice-candidate` - ICE candidate

### Engagement Events
- `raise-hand` - Raise hand
- `lower-hand` - Lower hand
- `emoji-reaction` - Send emoji
- `screen-share-start` - Start screen share
- `screen-share-stop` - Stop screen share

### Chat Events
- `chat-message` - Send message

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Role-based access control
- Secure environment variables
- HTTPS in production

## Performance Optimizations

- Database indexing
- Connection pooling
- Lazy loading
- Code splitting
- CDN for static assets
- Compression middleware
- Efficient WebRTC configuration

## Scalability

- Stateless backend design
- Horizontal scaling ready
- Database replication support
- Load balancing compatible
- Session management with Redis (optional)
- TURN server support for WebRTC

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered Q&A
- [ ] Breakout rooms
- [ ] Virtual backgrounds
- [ ] Recording transcription
- [ ] Multi-language support
- [ ] Advanced scheduling
- [ ] Integration with LMS
- [ ] Payment system

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email support@liveclassroom.com or open an issue on GitHub.

## Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.io for real-time features
- OpenAI for AI capabilities
- MongoDB for database
- React and Tailwind CSS communities

---

**Built with ❤️ for educators and students**
