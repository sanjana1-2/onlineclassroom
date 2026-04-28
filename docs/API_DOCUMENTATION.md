# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /auth/signup

Create new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

#### POST /auth/login

Login user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

#### GET /auth/profile

Get current user profile. (Protected)

#### PUT /auth/profile

Update user profile. (Protected)

**Request:**
```json
{
  "name": "Jane Doe",
  "bio": "Teacher",
  "avatar": "url"
}
```

### Rooms

#### POST /rooms

Create new room. (Teacher only)

**Request:**
```json
{
  "title": "Math 101",
  "description": "Basic Mathematics",
  "maxParticipants": 50
}
```

#### GET /rooms/code/:roomCode

Get room by code.

#### POST /rooms/:roomId/start

Start room session. (Teacher only)

#### POST /rooms/:roomId/end

End room session. (Teacher only)

#### GET /rooms/teacher/rooms

Get all teacher's rooms. (Teacher only)

#### PUT /rooms/:roomId/settings

Update room settings. (Teacher only)

**Request:**
```json
{
  "settings": {
    "allowScreenShare": true,
    "allowChat": true,
    "allowRaiseHand": true,
    "allowPolls": true
  }
}
```

### Messages

#### POST /messages

Send message.

**Request:**
```json
{
  "content": "Hello everyone",
  "room": "roomId",
  "isPrivate": false
}
```

#### GET /messages/room/:roomId

Get room messages.

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `skip`: Number to skip (default: 0)

#### GET /messages/private/:userId

Get private messages with user.

#### PUT /messages/:messageId/read

Mark message as read.

### Attendance

#### POST /attendance

Record attendance.

**Request:**
```json
{
  "roomId": "roomId"
}
```

#### PUT /attendance/:attendanceId/end

End attendance record.

#### GET /attendance/room/:roomId

Get room attendance. (Teacher only)

#### GET /attendance/student/records

Get student's attendance records. (Student only)

### Polls

#### POST /polls

Create poll. (Teacher only)

**Request:**
```json
{
  "question": "What is 2+2?",
  "options": ["3", "4", "5"],
  "roomId": "roomId",
  "allowMultiple": false
}
```

#### POST /polls/vote

Vote on poll.

**Request:**
```json
{
  "pollId": "pollId",
  "optionId": "optionId"
}
```

#### PUT /polls/:pollId/close

Close poll. (Creator only)

#### GET /polls/room/:roomId

Get room polls.

### Quizzes

#### POST /quizzes

Create quiz. (Teacher only)

**Request:**
```json
{
  "title": "Math Quiz",
  "description": "Test your skills",
  "questions": [
    {
      "question": "What is 2+2?",
      "type": "mcq",
      "options": ["3", "4", "5"],
      "correctAnswer": "4",
      "points": 1
    }
  ],
  "roomId": "roomId",
  "timeLimit": 30
}
```

#### POST /quizzes/submit

Submit quiz response.

**Request:**
```json
{
  "quizId": "quizId",
  "answers": [
    {
      "questionId": "questionId",
      "answer": "4"
    }
  ]
}
```

#### GET /quizzes/:quizId/results

Get quiz results. (Teacher only)

#### GET /quizzes/room/:roomId

Get room quizzes.

### AI

#### POST /ai/notes/generate

Generate notes from transcript. (Teacher only)

**Request:**
```json
{
  "roomId": "roomId",
  "transcript": "lecture content...",
  "title": "Lecture Notes"
}
```

#### POST /ai/notes/timestamped

Generate timestamped notes. (Teacher only)

**Request:**
```json
{
  "roomId": "roomId",
  "transcript": "lecture content...",
  "timestamps": [{"time": 0, "note": "Introduction"}],
  "title": "Timestamped Notes"
}
```

#### GET /ai/notes/room/:roomId

Get room notes.

#### PUT /ai/notes/:notesId/publish

Publish notes.

## Socket.io Events

### Client → Server

- `join-room`: Join classroom
- `leave-room`: Leave classroom
- `webrtc-offer`: Send WebRTC offer
- `webrtc-answer`: Send WebRTC answer
- `ice-candidate`: Send ICE candidate
- `screen-share-start`: Start screen sharing
- `screen-share-stop`: Stop screen sharing
- `raise-hand`: Raise hand
- `lower-hand`: Lower hand
- `emoji-reaction`: Send emoji reaction
- `chat-message`: Send chat message

### Server → Client

- `user-joined`: User joined room
- `user-left`: User left room
- `webrtc-offer`: Receive WebRTC offer
- `webrtc-answer`: Receive WebRTC answer
- `ice-candidate`: Receive ICE candidate
- `screen-share-started`: Screen share started
- `screen-share-stopped`: Screen share stopped
- `hand-raised`: User raised hand
- `hand-lowered`: User lowered hand
- `emoji-reaction`: Receive emoji reaction
- `chat-message`: Receive chat message

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
