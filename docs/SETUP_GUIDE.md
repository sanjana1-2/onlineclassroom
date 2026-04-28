# Live Classroom Platform - Setup Guide

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- OpenAI API key
- Git

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/live-classroom
JWT_SECRET=your_secure_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Update variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Setup

### MongoDB Atlas

1. Create a cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address
4. Copy the connection string
5. Update `MONGODB_URI` in backend `.env`

## Testing the Application

### 1. Create Teacher Account

- Go to `http://localhost:5173/signup`
- Fill in details and select "Teacher" role
- Click Sign Up

### 2. Create Student Account

- Open another browser tab/window
- Go to `http://localhost:5173/signup`
- Fill in details and select "Student" role
- Click Sign Up

### 3. Create and Join Classroom

**As Teacher:**
- Click "Create Room"
- Fill in room details
- Click "Start" to begin the session

**As Student:**
- Copy the room code from teacher's dashboard
- Enter room code in student dashboard
- Click "Join Classroom"

## Troubleshooting

### MongoDB Connection Error

- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Socket.io Connection Issues

- Check CORS settings in backend
- Verify `SOCKET_URL` in frontend `.env`
- Check browser console for errors

### WebRTC Issues

- Ensure HTTPS in production
- Check browser permissions for camera/microphone
- Verify firewall settings

## Production Deployment

See `DEPLOYMENT.md` for production setup instructions.
