# Quick Start Guide

## 5-Minute Setup

### Step 1: Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/live-classroom
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## First Time Usage

### Create Teacher Account

1. Go to http://localhost:5173/signup
2. Fill in details:
   - Name: "John Teacher"
   - Email: "teacher@example.com"
   - Password: "password123"
   - Role: "Teacher"
3. Click Sign Up

### Create Student Account

1. Open new browser tab
2. Go to http://localhost:5173/signup
3. Fill in details:
   - Name: "Jane Student"
   - Email: "student@example.com"
   - Password: "password123"
   - Role: "Student"
4. Click Sign Up

### Create & Join Classroom

**As Teacher:**
1. Click "Create Room"
2. Enter:
   - Title: "Math 101"
   - Description: "Basic Mathematics"
   - Max Participants: 50
3. Click "Create"
4. Click "Start" to begin session
5. Copy the room code

**As Student:**
1. Paste room code in "Join a Classroom"
2. Click "Join Classroom"
3. Allow camera/microphone permissions

## Key Features to Test

### 1. Video/Audio
- Both users should see each other's video
- Audio should work both ways

### 2. Chat
- Send messages in the chat panel
- Messages appear in real-time

### 3. Attendance
- Check attendance automatically recorded
- View in teacher dashboard

### 4. Polls (Teacher)
- Create poll from classroom
- Students vote in real-time

### 5. Quizzes (Teacher)
- Create quiz with questions
- Students submit answers
- View results

## Troubleshooting

### "Cannot GET /api/health"
- Backend not running
- Check port 5000 is available
- Run `npm run dev` in backend folder

### "Failed to connect to MongoDB"
- Check MONGODB_URI in .env
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has permissions

### "WebRTC connection failed"
- Check browser permissions for camera/mic
- Verify firewall settings
- Try different browser

### "Socket.io connection error"
- Check SOCKET_URL in frontend .env
- Verify backend is running
- Check CORS settings

## Next Steps

1. Read [Setup Guide](./docs/SETUP_GUIDE.md) for detailed configuration
2. Check [API Documentation](./docs/API_DOCUMENTATION.md) for endpoints
3. Review [Deployment Guide](./docs/DEPLOYMENT.md) for production setup
4. Explore codebase structure in [README.md](./README.md)

## Common Commands

```bash
# Backend
npm run dev          # Start development server
npm run start        # Start production server
npm test             # Run tests

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## Database Queries

### Check MongoDB Connection

```bash
# In backend directory
node -e "
import { connectDB } from './src/config/database.js';
await connectDB();
console.log('Connected!');
"
```

### View Collections

```bash
# In MongoDB Atlas
# Go to Collections tab
# View Users, Rooms, Messages, etc.
```

## API Testing

### Test with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Performance Tips

1. **Use Chrome DevTools** for debugging
2. **Check Network tab** for API calls
3. **Monitor Console** for errors
4. **Use React DevTools** extension
5. **Check MongoDB Atlas** for query performance

## Support Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Socket.io Docs](https://socket.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [WebRTC Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

**Ready to build? Start with the backend setup above!**
