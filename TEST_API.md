# API Testing Guide

## Test Create Room Endpoint

### Using Browser Console

1. Open http://localhost:5173
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this code:

```javascript
// Get token from localStorage
const token = localStorage.getItem('token');
console.log('Token:', token);

// Create room
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
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Expected Response (Success)
```json
{
  "success": true,
  "room": {
    "_id": "1001",
    "title": "Test Room",
    "description": "Test Description",
    "teacher": "1000",
    "roomCode": "ABC12345",
    "isActive": false,
    "maxParticipants": 50,
    "createdAt": "2026-04-24T16:20:00.000Z"
  }
}
```

### Expected Response (Error)
```json
{
  "message": "Error message here"
}
```

## Troubleshooting

### Issue: "No token provided"
- Make sure you're logged in
- Check localStorage has 'token' key
- Try logging in again

### Issue: "Not authorized"
- Make sure your role is 'teacher'
- Check the error message for details

### Issue: "Error creating room"
- Check backend terminal for error logs
- Verify all required fields are provided
- Check network tab in DevTools

## Debug Steps

1. **Check Token**
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

2. **Check User Data**
   ```javascript
   console.log(JSON.parse(localStorage.getItem('user')));
   ```

3. **Check Network Requests**
   - Open DevTools
   - Go to Network tab
   - Try to create room
   - Click on the POST request to /api/rooms
   - Check Request headers (Authorization)
   - Check Response body

4. **Check Backend Logs**
   - Look at backend terminal
   - Search for "Create room error"
   - Check the error message

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Login again, check token |
| 403 Forbidden | Make sure role is 'teacher' |
| 500 Server Error | Check backend logs |
| Network Error | Check backend is running |
| CORS Error | Check CORS configuration |

## Next Steps

If you see an error message, please share:
1. The exact error message
2. Backend terminal output
3. Browser console output
4. Network tab response

This will help debug the issue faster.
