# Testing Guide - Live Classroom Platform

## ✅ Servers Status

Both servers should be running:
- **Frontend**: http://localhost:5173 ✅
- **Backend**: http://localhost:5000 ✅

## 🧪 Testing Steps

### Step 1: Test Frontend Loading

1. Open browser: http://localhost:5173
2. You should see the login page
3. Check browser console (F12) for any errors

### Step 2: Create Teacher Account

1. Click "Sign up" link
2. Fill in:
   - Name: `Teacher One`
   - Email: `teacher@test.com`
   - Password: `password123`
   - Role: `Teacher`
3. Click "Sign Up"
4. You should be redirected to dashboard

### Step 3: Create Student Account

1. Open new browser tab/window (or logout)
2. Go to http://localhost:5173
3. Click "Sign up"
4. Fill in:
   - Name: `Student One`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: `Student`
5. Click "Sign Up"

### Step 4: Teacher Creates Room

1. In teacher account, click "Create Room"
2. Fill in:
   - Title: `Math 101`
   - Description: `Basic Mathematics`
   - Max Participants: `50`
3. Click "Create"
4. You should see the room in the list
5. **Copy the room code** (e.g., `ABC12345`)

### Step 5: Teacher Starts Room

1. Click "Start" button on the room
2. Room should show as active
3. You can click "Join" to enter the classroom

### Step 6: Student Joins Room

1. In student account, paste the room code
2. Click "Join Classroom"
3. You should enter the classroom

### Step 7: Test Chat

1. Both users should see the chat panel
2. Type a message and send
3. Message should appear for both users

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution**: 
- Check backend is running: `npm run dev` in backend folder
- Check port 5000 is not blocked
- Check CORS settings

### Issue: "Signup fails"
**Solution**:
- Check backend console for errors
- Verify email format is correct
- Try different email address

### Issue: "Cannot join room"
**Solution**:
- Verify room code is correct
- Check room is active (teacher started it)
- Check browser console for errors

### Issue: "Chat not working"
**Solution**:
- Check Socket.io connection in browser console
- Verify both users are in same room
- Check backend Socket.io events

## 📊 Expected Behavior

### Authentication
- ✅ Signup creates new user
- ✅ Login with correct credentials works
- ✅ Invalid credentials show error
- ✅ Token stored in localStorage

### Rooms
- ✅ Teacher can create rooms
- ✅ Room code is generated
- ✅ Teacher can start/end room
- ✅ Student can join with code

### Chat
- ✅ Messages appear in real-time
- ✅ Messages show sender name
- ✅ Messages persist in session

### Real-time
- ✅ Socket.io connects
- ✅ Events broadcast to room
- ✅ User join/leave notifications

## 🔍 Browser Console Checks

Open DevTools (F12) and check:

1. **Network tab**
   - API calls to http://localhost:5000/api
   - WebSocket connection to http://localhost:5000

2. **Console tab**
   - No red errors
   - Socket.io connected message
   - API responses logged

3. **Application tab**
   - Token stored in localStorage
   - User data in localStorage

## 📝 API Testing

### Test Signup
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```

### Test Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Create Room
```
POST http://localhost:5000/api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Test Room",
  "description": "Test Description",
  "maxParticipants": 50
}
```

## ✨ Features to Test

- [ ] User signup/login
- [ ] Create classroom
- [ ] Join classroom
- [ ] Video grid display
- [ ] Chat messaging
- [ ] Raise hand
- [ ] Emoji reactions
- [ ] Polls
- [ ] Quizzes
- [ ] Attendance tracking
- [ ] Notes generation
- [ ] Screen sharing

## 🎯 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Blank page | Frontend not loading | Check http://localhost:5173 |
| 404 errors | Backend not running | Run `npm run dev` in backend |
| CORS errors | Wrong origin | Check .env CORS settings |
| Socket not connecting | Wrong socket URL | Check frontend .env |
| Database errors | MongoDB not connected | Use mock DB (offline mode) |

## 📞 Getting Help

1. Check browser console (F12)
2. Check backend terminal for errors
3. Review [QUICK_START.md](./QUICK_START.md)
4. Check [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
5. Review [ARCHITECTURE.md](./ARCHITECTURE.md)

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Frontend loads without errors
2. ✅ Can create account and login
3. ✅ Can create and join rooms
4. ✅ Can send and receive messages
5. ✅ Can see other users in room
6. ✅ Real-time updates work
7. ✅ No console errors

---

**Happy Testing!** 🚀
