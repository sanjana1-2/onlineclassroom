# Deployment Guide

## Backend Deployment (Heroku/Railway)

### Using Railway

1. **Create Railway Account**
   - Go to railway.app
   - Sign up with GitHub

2. **Connect Repository**
   - Create new project
   - Connect GitHub repository
   - Select backend folder

3. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

4. **Deploy**
   - Railway auto-deploys on push to main branch

### Using Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_uri
   heroku config:set JWT_SECRET=your_secret
   heroku config:set OPENAI_API_KEY=your_key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Frontend Deployment (Vercel/Netlify)

### Using Vercel

1. **Connect Repository**
   - Go to vercel.com
   - Import GitHub repository
   - Select frontend folder

2. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url/api
   VITE_SOCKET_URL=https://your-backend-url
   ```

4. **Deploy**
   - Vercel auto-deploys on push

### Using Netlify

1. **Connect Repository**
   - Go to netlify.com
   - Connect GitHub
   - Select frontend folder

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add in Netlify dashboard

4. **Deploy**
   - Netlify auto-deploys

## Database Deployment

### MongoDB Atlas

1. **Create Cluster**
   - Go to mongodb.com/cloud
   - Create free tier cluster

2. **Create Database User**
   - Set username and password
   - Grant read/write permissions

3. **Whitelist IP**
   - Add production server IP
   - Or allow all IPs (0.0.0.0/0) for development

4. **Get Connection String**
   - Copy connection string
   - Update backend environment variable

## SSL/HTTPS Setup

### For Custom Domain

1. **Get SSL Certificate**
   - Use Let's Encrypt (free)
   - Or purchase from provider

2. **Configure in Deployment Platform**
   - Most platforms handle this automatically
   - Vercel/Netlify provide free SSL

3. **Update CORS Settings**
   - Update `FRONTEND_URL` in backend
   - Update `SOCKET_CORS_ORIGIN`

## Performance Optimization

### Backend

1. **Enable Compression**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Database Indexing**
   - Already configured in models
   - Monitor slow queries

3. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

### Frontend

1. **Code Splitting**
   - Vite handles this automatically
   - Monitor bundle size

2. **Image Optimization**
   - Use WebP format
   - Lazy load images

3. **CDN**
   - Vercel/Netlify provide CDN
   - Use for static assets

## Monitoring & Logging

### Backend Logging

1. **Use Winston or Pino**
   ```bash
   npm install winston
   ```

2. **Log to External Service**
   - LogRocket
   - Sentry
   - DataDog

### Frontend Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

2. **Monitor Performance**
   - Use Lighthouse
   - Monitor Core Web Vitals

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
   - Use Nginx or cloud provider's LB
   - Distribute traffic across instances

2. **Session Management**
   - Use Redis for session storage
   - Ensure stateless backend

3. **Database Replication**
   - MongoDB Atlas handles this
   - Configure read replicas

### WebRTC Scaling

1. **TURN Server**
   - Deploy TURN server for NAT traversal
   - Use services like Twilio

2. **SFU (Selective Forwarding Unit)**
   - For large scale deployments
   - Use Janus or Mediasoup

## Backup & Recovery

### Database Backups

1. **MongoDB Atlas**
   - Automatic daily backups
   - Configure retention period
   - Test restore procedures

2. **Manual Backups**
   ```bash
   mongodump --uri="mongodb+srv://..."
   ```

### Application Backups

- Use Git for version control
- Tag releases
- Maintain changelog

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Implement input validation
- [ ] Use HTTPS for all external APIs
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend
   - Verify origin in CORS config

2. **WebSocket Connection Failed**
   - Check `SOCKET_CORS_ORIGIN`
   - Verify firewall settings
   - Check proxy configuration

3. **Database Connection Timeout**
   - Verify connection string
   - Check IP whitelist
   - Verify network connectivity

4. **Memory Issues**
   - Monitor process memory
   - Implement garbage collection
   - Use clustering for Node.js
