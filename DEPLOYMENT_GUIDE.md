# 🚀 Live Classroom Platform: Deployment Guide

This guide provides step-by-step instructions for deploying the **Live Classroom Platform** to a production environment.

---

## 🏗️ Architecture Overview

The application consists of three main components:
1.  **Frontend**: React (Vite) - Hosted on Vercel or Netlify.
2.  **Backend**: Node.js (Express & Socket.io) - Hosted on Render, Railway, or AWS.
3.  **Database**: MongoDB - Hosted on MongoDB Atlas.

---

## 1. 🍃 Database Setup (MongoDB Atlas)

1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new project and a **Shared Cluster** (Free tier).
3.  In **Network Access**, add `0.0.0.0/0` (or your server's IP) to the whitelist.
4.  In **Database Access**, create a user with read/write permissions.
5.  Get your **Connection String** (SRV) and replace `<password>` with your user's password.
    *   *Example:* `mongodb+srv://user:password@cluster.mongodb.net/live-classroom?retryWrites=true&w=majority`

---

## 2. 🖥️ Backend Deployment (e.g., Render.com)

Render is recommended because it handles WebSockets well.

1.  Connect your GitHub repository to [Render](https://render.com).
2.  Create a **New Web Service**.
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `MONGODB_URI`: *Your MongoDB Atlas connection string*
    *   `JWT_SECRET`: *A long, random string*
    *   `JWT_EXPIRE`: `7d`
    *   `PORT`: `10000` (Render default)
    *   `NODE_ENV`: `production`
    *   `FRONTEND_URL`: `https://your-frontend-app.vercel.app`
    *   `SOCKET_CORS_ORIGIN`: `https://your-frontend-app.vercel.app`
    *   `OPENAI_API_KEY`: *Your OpenAI API Key*

---

## 3. 🎨 Frontend Deployment (e.g., Vercel)

1.  Connect your GitHub repository to [Vercel](https://vercel.com).
2.  Create a **New Project**.
3.  **Root Directory**: `frontend`
4.  **Framework Preset**: `Vite`
5.  **Build Command**: `npm run build`
6.  **Output Directory**: `dist`
7.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
    *   `VITE_SOCKET_URL`: `https://your-backend-app.onrender.com`

---

## ⚠️ Important Production Notes

### 🔒 HTTPS
WebRTC (camera/microphone) **requires** HTTPS. Most hosting providers like Vercel and Render provide SSL by default. Ensure you access the app via `https://`.

### 📡 WebRTC & STUN/TURN
For peer-to-peer connections to work across different networks (NAT/Firewalls), you may eventually need a **TURN server**.
*   The current implementation uses default STUN servers.
*   For a high-traffic production app, consider using [Twilio Network Traversal Service](https://www.twilio.com/stun-turn) or [Metered.ca](https://www.metered.ca/).

### 📦 File Storage
Currently, recordings are stored in `./recordings` on the server disk.
*   **Warning**: Platforms like Render and Heroku have ephemeral filesystems (files disappear after restart).
*   **Solution**: For production recordings, you should integrate **AWS S3** or **Cloudinary** in `backend/src/services/storageService.js`.

---

## ✅ Post-Deployment Checklist

1.  [ ] Verify you can sign up/login.
2.  [ ] Verify the Teacher can start a classroom.
3.  [ ] Verify the Student can join and see the video stream.
4.  [ ] Verify AI features (OpenAI key is set).
5.  [ ] Check the browser console (F12) for any CORS errors.
