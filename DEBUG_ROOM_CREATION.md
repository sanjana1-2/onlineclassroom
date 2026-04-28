# Debug: Room Creation Issue

## Step-by-Step Debugging

### Step 1: Verify You're Logged In as Teacher

1. Open http://localhost:5173
2. Open DevTools (F12)
3. Go to Console tab
4. Run this:

```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Role:', user?.role);
console.log('Is Teacher:', user?.role === 'teacher');
```

**Expected Output:**
```
User: { _id: "1000", name: "Teacher", email: "teacher@test.com", role: "teacher" }
Role: teacher
Is Teacher: true
```

**If not teacher:**
- Logout and login again
- Make sure to select "Teacher" role during signup

---

### Step 2: Verify Token is Valid

```javascript
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token:', token);

// Decode token (if it's JWT)
const parts = token.split('.');
if (parts.length === 3) {
  const payload = JSON.parse(atob(parts[1]));
  console.log('Token payload:', payload);
}
```

**Expected Output:**
```
Token exists: true
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token payload: { userId: "1000", role: "teacher", iat: ..., exp: ... }
```

---

### Step 3: Test API Directly

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/rooms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Test Room',
    description: 'Test Description',
    maxParticipants: 50
  })
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Room created successfully!');
    console.log('Room Code:', data.room.roomCode);
  } else {
    console.log('❌ Error:', data.message);
  }
})
.catch(err => {
  console.error('❌ Network Error:', err);
});
```

**Expected Output (Success):**
```
Status: 201
Response: {
  success: true,
  room: {
    _id: "1001",
    title: "Test Room",
    description: "Test Description",
    teacher: "1000",
    roomCode: "ABC12345",
    isActive: false,
    maxParticipants: 50,
    createdAt: "2026-04-24T16:20:00.000Z"
  }
}
✅ Room created successfully!
Room Code: ABC12345
```

**Expected Output (Error):**
```
Status: 403
Response: {
  message: "Not authorized. Required role: teacher. Your role: student"
}
❌ Error: Not authorized. Required role: teacher. Your role: student
```

---

### Step 4: Check Backend Logs

Look at the backend terminal for any error messages:

```
[ERROR] 2026-04-24T16:20:00.000Z - Create room error: ...
```

If you see an error, share it with me.

---

### Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to create a room from the UI
4. Look for POST request to `/api/rooms`
5. Click on it and check:
   - **Request Headers**: Should have `Authorization: Bearer <token>`
   - **Request Body**: Should have title, description, maxParticipants
   - **Response Status**: Should be 201 (success) or 4xx/5xx (error)
   - **Response Body**: Should show success or error message

---

## Common Issues & Solutions

### Issue 1: "Not authorized. Required role: teacher"

**Cause:** You're logged in as a student, not a teacher

**Solution:**
1. Logout
2. Sign up again as Teacher
3. Make sure to select "Teacher" role

---

### Issue 2: "No token provided"

**Cause:** Token is not being sent in the request

**Solution:**
1. Make sure you're logged in
2. Check localStorage has 'token'
3. Try logging in again

---

### Issue 3: "Invalid or expired token"

**Cause:** Token is invalid or expired

**Solution:**
1. Logout
2. Login again
3. Try creating room immediately

---

### Issue 4: Network Error / Cannot connect

**Cause:** Backend is not running

**Solution:**
1. Check backend terminal
2. Should show: `[INFO] Server running on port 5000`
3. If not running, restart with: `npm run dev` in backend folder

---

### Issue 5: CORS Error

**Cause:** CORS not configured properly

**Solution:**
1. Check backend .env has correct FRONTEND_URL
2. Should be: `FRONTEND_URL=http://localhost:5173`
3. Restart backend

---

## What to Share When Reporting Issue

Please provide:

1. **Error Message** - Exact error you see
2. **Browser Console Output** - Screenshot or text
3. **Network Tab Response** - Status code and response body
4. **Backend Terminal Output** - Any error messages
5. **Steps to Reproduce** - Exactly what you did

---

## Quick Checklist

- [ ] Logged in as Teacher (not Student)
- [ ] Token exists in localStorage
- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 5173)
- [ ] No CORS errors in console
- [ ] Network request shows 201 status
- [ ] Response has success: true

---

## Still Having Issues?

1. Try the API test directly (Step 3 above)
2. Check backend logs for errors
3. Verify you're logged in as teacher
4. Restart both servers
5. Clear browser cache and localStorage

If still stuck, share:
- The exact error message
- Backend terminal output
- Browser console output
- Network tab response

This will help debug faster!
