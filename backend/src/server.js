import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.middleware.js';
import { googleLogin, refreshToken, logout } from './controllers/auth.controller.js';
import { getProfile, updateProfile, toggleVisibility, verifyPhoto, getPermissions, updatePermission } from './controllers/user.controller.js';
import { updateLocation, getNearby } from './controllers/geo.controller.js';
import { sendRequest, getRequests, respondToRequest, unmatch, getChats } from './controllers/connections.controller.js';
import { blockUser, reportUser } from './controllers/moderation.controller.js';
import { createPost, getFeed, toggleLike, addComment } from './controllers/posts.controller.js';
import { chatGate, callGate } from './controllers/webhooks.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public Auth routes
app.post('/api/auth/google', googleLogin);
app.post('/api/auth/refresh', refreshToken);

// Protected Auth/Profile routes
app.post('/api/auth/logout', authMiddleware, logout);
app.get('/api/user/profile', authMiddleware, getProfile);
app.put('/api/user/profile', authMiddleware, updateProfile);
app.post('/api/user/visibility', authMiddleware, toggleVisibility);
app.post('/api/user/verify-photo', authMiddleware, verifyPhoto);
app.get('/api/user/permissions', authMiddleware, getPermissions);
app.post('/api/user/permissions', authMiddleware, updatePermission);

// Protected Geo Location routes
app.post('/api/geo/location', authMiddleware, updateLocation);
app.get('/api/geo/nearby', authMiddleware, getNearby);

// Protected Connections routes
app.post('/api/connections/request', authMiddleware, sendRequest);
app.get('/api/connections/requests', authMiddleware, getRequests);
app.post('/api/connections/respond', authMiddleware, respondToRequest);
app.post('/api/connections/unmatch', authMiddleware, unmatch);
app.get('/api/connections/chats', authMiddleware, getChats);

// Protected Moderation/Block/Report routes
app.post('/api/connections/block', authMiddleware, blockUser);
app.post('/api/connections/report', authMiddleware, reportUser);

// Protected Feed routes
app.post('/api/posts', authMiddleware, createPost);
app.get('/api/posts/feed', authMiddleware, getFeed);
app.post('/api/posts/:postId/like', authMiddleware, toggleLike);
app.post('/api/posts/:postId/comment', authMiddleware, addComment);

// Webhook Consent Gates (can be secured via webhook secrets/signatures in production)
app.post('/api/webhooks/chat-gate', chatGate);
app.post('/api/webhooks/call-gate', callGate);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Social Connector Monolith running on port ${PORT}`);
});
export default app;
