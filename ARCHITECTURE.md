# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components: Auth, Classroom, Dashboard, Chat, etc.  │   │
│  │ State: Context API + Zustand                        │   │
│  │ Real-time: Socket.io Client                         │   │
│  │ Media: WebRTC (Simple Peer)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    HTTP + WebSocket
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                Backend (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes: Auth, Rooms, Messages, Attendance, etc.     │   │
│  │ Controllers: Business Logic                         │   │
│  │ Middleware: Auth, Validation, Error Handling        │   │
│  │ Socket.io: Real-time Events                         │   │
│  │ Services: AI, Recording, Email                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    REST API + Socket.io
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ MongoDB Atlas: Users, Rooms, Messages, etc.         │   │
│  │ Indexes: Optimized queries                          │   │
│  │ Replication: High availability                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App
├── AuthProvider (Context)
├── Routes
│   ├── /login → Login Component
│   ├── /signup → Signup Component
│   ├── /dashboard → Dashboard (Teacher/Student)
│   │   ├── TeacherDashboard
│   │   │   ├── RoomList
│   │   │   ├── CreateRoomForm
│   │   │   └── AttendanceView
│   │   └── StudentDashboard
│   │       └── JoinRoomForm
│   └── /classroom/:roomCode → Classroom
│       ├── VideoGrid
│       │   ├── LocalVideo
│       │   └── RemoteVideos
│       ├── ChatWindow
│       ├── ControlPanel
│       │   ├── RaiseHand
│       │   ├── ScreenShare
│       │   └── EmojiReactions
│       ├── PollComponent
│       ├── QuizComponent
│       └── DoubtBox
```

### Backend Structure

```
Backend
├── Config
│   ├── environment.js (Env variables)
│   ├── database.js (MongoDB connection)
│   └── socket.js (Socket.io setup)
├── Models (MongoDB Schemas)
│   ├── User
│   ├── Room
│   ├── Message
│   ├── Attendance
│   ├── Notes
│   ├── Poll
│   ├── Quiz
│   └── Recording
├── Controllers (Business Logic)
│   ├── authController
│   ├── roomController
│   ├── messageController
│   ├── attendanceController
│   ├── pollController
│   ├── quizController
│   └── aiController
├── Routes (API Endpoints)
│   ├── auth.js
│   ├── rooms.js
│   ├── messages.js
│   ├── attendance.js
│   ├── polls.js
│   ├── quizzes.js
│   └── ai.js
├── Middleware
│   ├── auth.js (JWT verification)
│   ├── errorHandler.js
│   └── validation.js
├── Services (External Integrations)
│   ├── aiService.js (OpenAI)
│   ├── recordingService.js
│   └── emailService.js
├── Events
│   └── socketEvents.js (Real-time events)
└── Utils
    ├── logger.js
    └── helpers.js
```

## Data Flow

### Authentication Flow

```
User Input (Email, Password)
    ↓
Frontend: POST /auth/login
    ↓
Backend: authController.login()
    ↓
Verify Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Return Token + User Data
    ↓
Frontend: Store Token in localStorage
    ↓
Add Token to API Headers
```

### Real-time Classroom Flow

```
Student Joins
    ↓
Frontend: emit('join-room')
    ↓
Backend: Socket receives join-room
    ↓
Record Attendance
    ↓
Broadcast 'user-joined' to room
    ↓
All Clients: Receive user-joined
    ↓
Initiate WebRTC Connection
    ↓
Exchange Offer/Answer/ICE Candidates
    ↓
Video/Audio Stream Established
```

### Message Flow

```
User Types Message
    ↓
Frontend: POST /api/messages
    ↓
Backend: Save to MongoDB
    ↓
Emit 'chat-message' via Socket.io
    ↓
All Room Participants Receive Message
    ↓
Frontend: Update Chat UI
```

## Database Schema Relationships

```
User
├── 1 → Many: Rooms (as teacher)
├── 1 → Many: Messages (as sender)
├── 1 → Many: Attendance (as student)
├── 1 → Many: Polls (as creator)
├── 1 → Many: Quizzes (as creator)
└── 1 → Many: Notes (as creator)

Room
├── 1 → Many: Messages
├── 1 → Many: Attendance
├── 1 → Many: Polls
├── 1 → Many: Quizzes
├── 1 → Many: Notes
├── 1 → Many: Recordings
└── 1 → 1: Recording (current)

Message
├── Many → 1: User (sender)
├── Many → 1: Room
└── Many → 1: User (recipient, if private)

Attendance
├── Many → 1: Room
└── Many → 1: User (student)

Poll
├── Many → 1: Room
├── Many → 1: User (creator)
└── 1 → Many: Voters

Quiz
├── Many → 1: Room
├── Many → 1: User (creator)
└── 1 → Many: Responses

Notes
├── Many → 1: Room
└── Many → 1: User (creator)

Recording
├── Many → 1: Room
└── Many → 1: User (recorder)
```

## WebRTC Architecture

```
Peer A (Browser)
    ↓
getUserMedia() → Local Stream
    ↓
RTCPeerConnection
    ├── addTrack(audio)
    ├── addTrack(video)
    └── createOffer()
    ↓
Send Offer via Socket.io
    ↓
Peer B (Browser)
    ↓
Receive Offer
    ↓
createAnswer()
    ↓
Send Answer via Socket.io
    ↓
Exchange ICE Candidates
    ↓
ontrack() → Remote Stream
    ↓
Display Remote Video
```

## API Request/Response Flow

```
Frontend Request
    ↓
Axios Interceptor (Add JWT Token)
    ↓
HTTP Request to Backend
    ↓
Express Middleware
    ├── CORS Check
    ├── Body Parser
    └── Auth Middleware (if protected)
    ↓
Route Handler
    ↓
Controller Logic
    ├── Validate Input
    ├── Query Database
    └── Process Data
    ↓
Response Object
    ↓
HTTP Response
    ↓
Frontend Receives Response
    ↓
Update State/UI
```

## Socket.io Event Flow

```
Client Event
    ↓
socket.emit('event-name', data)
    ↓
Server Receives
    ↓
socket.on('event-name', (data) => {})
    ↓
Process Event
    ↓
Broadcast to Room/Clients
    ↓
io.to(roomCode).emit('response-event', data)
    ↓
Clients Receive
    ↓
socket.on('response-event', (data) => {})
    ↓
Update UI
```

## Authentication & Authorization

```
Login
    ↓
Generate JWT Token
    ├── Header: { alg: 'HS256', typ: 'JWT' }
    ├── Payload: { userId, role, iat, exp }
    └── Signature: HMAC-SHA256(secret)
    ↓
Store in localStorage
    ↓
Add to Request Headers
    ├── Authorization: Bearer <token>
    ↓
Backend Verifies Token
    ├── Check Signature
    ├── Check Expiration
    └── Extract User Info
    ↓
Check Role-Based Access
    ├── Teacher Only Routes
    ├── Student Only Routes
    └── Public Routes
    ↓
Grant/Deny Access
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance N

Shared Resources
    ├── MongoDB (Replica Set)
    ├── Redis (Session Store)
    └── File Storage (S3)
```

### WebRTC Scaling

```
For Large Classes (100+ participants)
    ↓
Implement SFU (Selective Forwarding Unit)
    ├── Janus Gateway
    ├── Mediasoup
    └── Kurento
    ↓
Reduces Bandwidth
    ↓
Improves Performance
```

## Security Architecture

```
Frontend
    ├── HTTPS Only
    ├── Secure Token Storage
    └── Input Validation

Backend
    ├── JWT Authentication
    ├── Role-Based Authorization
    ├── Input Validation
    ├── Rate Limiting
    ├── CORS Protection
    └── Secure Headers

Database
    ├── Encrypted Passwords (bcrypt)
    ├── Connection Encryption
    ├── Access Control
    └── Backup & Recovery
```

## Performance Optimization

### Frontend

```
Code Splitting
    ├── Route-based splitting
    └── Component lazy loading

Caching
    ├── Browser cache
    ├── Service worker
    └── CDN cache

Optimization
    ├── Image compression
    ├── Minification
    └── Tree shaking
```

### Backend

```
Database
    ├── Indexing
    ├── Query optimization
    └── Connection pooling

Caching
    ├── Redis cache
    ├── Query results
    └── Session storage

Compression
    ├── Gzip compression
    ├── Response compression
    └── Payload optimization
```

## Deployment Architecture

```
Development
    ├── Local MongoDB
    ├── Local Backend (5000)
    └── Local Frontend (5173)

Production
    ├── MongoDB Atlas
    ├── Backend (Railway/Heroku)
    ├── Frontend (Vercel/Netlify)
    └── CDN (Vercel/Netlify CDN)

CI/CD
    ├── GitHub Actions
    ├── Automated Tests
    ├── Build Pipeline
    └── Auto Deploy
```

---

This architecture is designed to be scalable, maintainable, and production-ready.
