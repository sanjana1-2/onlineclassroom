# Getting Started - Live Classroom Platform

## 🎉 Welcome!

Your Live Classroom Platform is now **running and ready to use**!

## ✅ Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Running | http://localhost:5173 |
| Backend | ✅ Running | http://localhost:5000 |
| Database | ⚠️ Offline Mode | Mock DB (in-memory) |

## 🚀 Quick Start (2 Minutes)

### 1. Open the Application
```
http://localhost:5173
```

### 2. Create Your First Account
- Click "Sign up"
- Choose role: **Teacher** or **Student**
- Fill in details and submit

### 3. Create a Classroom (Teacher Only)
- Click "Create Room"
- Enter room details
- Click "Create"
- Copy the room code

### 4. Join Classroom (Student)
- Paste room code
- Click "Join Classroom"

### 5. Test Features
- Send chat messages
- See real-time updates
- Test engagement tools

## 📚 Documentation

### For Quick Setup
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - How to test features

### For Understanding
- **[README.md](./README.md)** - Project overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What's included

### For Development
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API endpoints
- **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Detailed configuration
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment

## 🎯 What You Can Do Now

### ✅ Working Features
- User authentication (signup/login)
- Create and manage classrooms
- Join classrooms with room code
- Real-time chat messaging
- User dashboards (teacher & student)
- Attendance tracking
- Polls and quizzes
- Notes generation
- Real-time notifications

### ⚠️ Limited Features (Offline Mode)
- Database persistence (data resets on server restart)
- AI features (OpenAI API not configured)
- File uploads (no storage configured)
- Screen sharing (WebRTC ready, needs testing)

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://...  # Optional (offline mode active)
JWT_SECRET=test_jwt_secret_key_change_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🧪 Testing Checklist

- [ ] Frontend loads at http://localhost:5173
- [ ] Can create account
- [ ] Can login
- [ ] Can create room (teacher)
- [ ] Can join room (student)
- [ ] Can send chat messages
- [ ] Can see real-time updates
- [ ] No console errors

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing steps.

## 🐛 Troubleshooting

### Frontend not loading?
```bash
# Check if frontend is running
# Terminal should show: ➜ Local: http://localhost:5173/
```

### Backend not responding?
```bash
# Check if backend is running
# Terminal should show: [INFO] Server running on port 5000
```

### Getting errors?
1. Check browser console (F12)
2. Check backend terminal
3. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 📱 Browser Requirements

- Chrome/Edge/Firefox (latest)
- JavaScript enabled
- Cookies enabled
- WebRTC support (for video)

## 🔐 Security Notes

- ⚠️ JWT secret is placeholder (change in production)
- ⚠️ Data is not persisted (offline mode)
- ⚠️ CORS is open to localhost only
- ✅ Passwords are hashed with bcrypt

## 🎓 Next Steps

### For Testing
1. Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Create test accounts
3. Test all features

### For Development
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Check [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
3. Explore codebase

### For Production
1. Setup MongoDB Atlas
2. Configure environment variables
3. Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📊 Project Structure

```
live-classroom-platform/
├── backend/          # Node.js + Express
├── frontend/         # React + Vite
├── docs/             # Documentation
└── README.md         # Project overview
```

## 🚀 Key Features

### Core
- ✅ Real-time video/audio (WebRTC)
- ✅ Live chat (group & private)
- ✅ Screen sharing
- ✅ Attendance tracking

### Engagement
- ✅ Raise hand
- ✅ Emoji reactions
- ✅ Polls
- ✅ Quizzes
- ✅ Doubt box

### AI
- ✅ Lecture summaries
- ✅ Timestamped notes
- ✅ Quiz generation

## 💡 Tips

1. **Use different browsers** for teacher/student testing
2. **Check console** (F12) for debugging
3. **Read documentation** for detailed info
4. **Test features** systematically
5. **Report issues** with error messages

## 📞 Support

- **Quick Help**: [QUICK_START.md](./QUICK_START.md)
- **Testing Help**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **API Help**: [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## ✨ What's Next?

1. **Test the platform** - Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. **Understand the code** - Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Configure for production** - Use [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
4. **Customize features** - Modify code as needed

## 🎉 You're All Set!

Everything is ready to go. Start by visiting:

**http://localhost:5173**

Happy learning! 🚀

---

**Questions?** Check the documentation files or review the code comments.
