# Social Media Dashboard

A full-stack social media dashboard with user profiles, media uploads, real-time messaging, engagement analytics, and Redis-powered notifications.

## Tech stack
- MongoDB
- Express.js
- Node.js
- React.js
- Socket.IO
- Redis

## Project structure
- `backend/` - Express API, MongoDB models, Socket.IO server, Redis notifications
- `frontend/` - React SPA, real-time chat, analytics dashboard

## Setup
1. Install dependencies
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configure environment
   - copy `backend/.env.example` to `backend/.env`
3. Run services
   - Start Redis locally
   - `cd backend && npm run dev`
   - `cd frontend && npm start`

## Notes
- Backend uses JWT auth and multer for media uploads.
- Socket.IO is configured with Redis for scalable notifications.
- Frontend uses `axios` for API calls and `socket.io-client` for real-time events.
