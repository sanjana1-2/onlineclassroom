# Live Classroom Platform - Project Structure

```
live-classroom-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── environment.js
│   │   │   └── socket.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── roomController.js
│   │   │   ├── messageController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── pollController.js
│   │   │   ├── quizController.js
│   │   │   └── aiController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   ├── Message.js
│   │   │   ├── Attendance.js
│   │   │   ├── Notes.js
│   │   │   ├── Poll.js
│   │   │   ├── Quiz.js
│   │   │   └── Recording.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── rooms.js
│   │   │   ├── messages.js
│   │   │   ├── attendance.js
│   │   │   ├── polls.js
│   │   │   ├── quizzes.js
│   │   │   └── ai.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── recordingService.js
│   │   │   └── emailService.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   ├── events/
│   │   │   └── socketEvents.js
│   │   └── app.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── RoleSelector.jsx
│   │   │   ├── Classroom/
│   │   │   │   ├── VideoGrid.jsx
│   │   │   │   ├── ScreenShare.jsx
│   │   │   │   ├── RaiseHand.jsx
│   │   │   │   ├── EmojiReactions.jsx
│   │   │   │   └── Classroom.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── GroupChat.jsx
│   │   │   │   ├── PrivateChat.jsx
│   │   │   │   └── ChatWindow.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   └── ClassScheduler.jsx
│   │   │   ├── Engagement/
│   │   │   │   ├── PollComponent.jsx
│   │   │   │   ├── QuizComponent.jsx
│   │   │   │   └── DoubtBox.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Loading.jsx
│   │   │   └── Layout/
│   │   │       └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ClassroomPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useWebRTC.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── socketService.js
│   │   │   └── webrtcService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ClassroomContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── docs/
    ├── API_DOCUMENTATION.md
    ├── DEPLOYMENT.md
    └── SETUP_GUIDE.md
```
