const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { Eureka } = require('eureka-js-client');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT'] } });

const PORT = process.env.PORT || 3001;
const CLUB_SERVICE_URL = process.env.CLUB_SERVICE_URL || 'http://localhost:8090';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8085';

// ─── Eureka ───────────────────────────────────────────────────────────────────
const eurekaClient = new Eureka({
  instance: {
    app: 'chat-service', hostName: 'localhost', ipAddr: '127.0.0.1',
    port: { '$': PORT, '@enabled': true }, vipAddress: 'chat-service',
    dataCenterInfo: { '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn' },
    statusPageUrl: `http://localhost:${PORT}/health`,
    healthCheckUrl: `http://localhost:${PORT}/health`,
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'localhost', port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/', maxRetries: 5, requestRetryDelay: 2000,
  },
});

// ─── In-memory stores ─────────────────────────────────────────────────────────
// messages: { roomId: [ Message ] }
// Message: { id, roomId, userId, username, message, timestamp, type,
//            edited, editedAt, deleted, pinned, forwardedFrom,
//            reactions: { emoji: [userId] } }
const messages = {};
const onlineUsers = {};   // { roomId: [{ userId, username, socketId }] }
const blockedUsers = {};  // { clubId: Set<userId> }
const tutors = {};        // { clubId: userId }  — cached tutor per club

// ─── AI correction helper ─────────────────────────────────────────────────────
async function getAiCorrection(message, mode) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/api/ai/grammar/correct`, {
      message, mode: mode || 'correction'
    }, { timeout: 10000 });
    return res.data;
  } catch (e) {
    console.error('AI correction failed:', e.message);
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function isMember(clubId, userId) {
  try {
    const res = await axios.get(`${CLUB_SERVICE_URL}/api/clubs/${clubId}/access/${userId}`);
    return res.data.access === true;
  } catch { return false; }
}

async function getClubTutorId(clubId) {
  if (tutors[clubId]) return tutors[clubId];
  try {
    const res = await axios.get(`${CLUB_SERVICE_URL}/api/clubs/${clubId}`);
    tutors[clubId] = res.data.tutorId;
    return tutors[clubId];
  } catch { return null; }
}

function isTutor(clubId, userId) {
  return tutors[clubId] && tutors[clubId] === userId;
}

function roomMessages(roomId) {
  if (!messages[roomId]) messages[roomId] = [];
  return messages[roomId];
}

function privateRoomId(a, b) {
  return `private_${Math.min(a, b)}_${Math.max(a, b)}`;
}

// ─── REST: history & moderation ───────────────────────────────────────────────
app.get('/api/chat/:roomId/messages', (req, res) => {
  const msgs = roomMessages(req.params.roomId).filter(m => !m.deleted);
  res.json(msgs);
});

app.get('/api/chat/:roomId/pinned', (req, res) => {
  const pinned = roomMessages(req.params.roomId).filter(m => m.pinned && !m.deleted);
  res.json(pinned);
});

app.get('/api/chat/club/:clubId/members/online', (req, res) => {
  const roomId = `club_${req.params.clubId}`;
  res.json(onlineUsers[roomId] || []);
});

app.get('/api/chat/club/:clubId/blocked', (req, res) => {
  const set = blockedUsers[req.params.clubId];
  res.json(set ? [...set] : []);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// ─── Socket.IO ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ── joinRoom ────────────────────────────────────────────────────────────────
  socket.on('joinRoom', async ({ clubId, userId, username }) => {
    const roomId = `club_${clubId}`;

    if (!blockedUsers[clubId]) blockedUsers[clubId] = new Set();
    if (blockedUsers[clubId].has(userId)) {
      socket.emit('error', { message: 'You have been blocked from this club chat.' });
      return;
    }

    const allowed = await isMember(clubId, userId);
    if (!allowed) {
      socket.emit('error', { message: 'Access denied: you are not a member of this club' });
      return;
    }

    // Cache tutor
    await getClubTutorId(clubId);

    socket.join(roomId);
    socket.data = { userId, username, clubId };

    if (!onlineUsers[roomId]) onlineUsers[roomId] = [];
    onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.userId !== userId);
    onlineUsers[roomId].push({ userId, username, socketId: socket.id, isTutor: isTutor(clubId, userId) });

    io.to(roomId).emit('onlineUsers', onlineUsers[roomId]);
    socket.to(roomId).emit('userJoined', { userId, username, timestamp: new Date() });

    // Send history
    socket.emit('messageHistory', roomMessages(roomId).filter(m => !m.deleted));
    console.log(`${username} joined ${roomId}`);
  });

  // ── sendMessage ─────────────────────────────────────────────────────────────
  socket.on('sendMessage', async ({ clubId, userId, username, message, forwardedFrom, aiMode }) => {
    const roomId = `club_${clubId}`;
    if (blockedUsers[clubId]?.has(userId)) return;

    const msg = {
      id: uuidv4(), roomId, userId, username, message,
      timestamp: new Date(), type: 'group',
      edited: false, deleted: false, pinned: false,
      reactions: {}, forwardedFrom: forwardedFrom || null
    };
    roomMessages(roomId).push(msg);
    io.to(roomId).emit('receiveMessage', msg);

    // AI correction (async, non-blocking)
    if (aiMode && aiMode !== 'off') {
      const correction = await getAiCorrection(message, aiMode);
      if (correction) {
        const aiMsg = {
          id: uuidv4(), roomId,
          userId: 0, username: 'AI Coach',
          message: correction.corrected,
          explanation: correction.explanation,
          original: correction.original,
          hasError: correction.hasError,
          mode: aiMode,
          timestamp: new Date(), type: 'ai',
          edited: false, deleted: false, pinned: false, reactions: {}
        };
        roomMessages(roomId).push(aiMsg);
        io.to(roomId).emit('aiMessage', aiMsg);
      }
    }
  });

  // ── editMessage ─────────────────────────────────────────────────────────────
  socket.on('editMessage', ({ roomId, messageId, newText, userId }) => {
    const msg = roomMessages(roomId).find(m => m.id === messageId);
    if (!msg || msg.userId !== userId || msg.deleted) return;
    msg.message = newText;
    msg.edited = true;
    msg.editedAt = new Date();
    io.to(roomId).emit('messageUpdated', msg);
  });

  // ── deleteMessage ───────────────────────────────────────────────────────────
  socket.on('deleteMessage', ({ roomId, messageId, userId, clubId }) => {
    const msg = roomMessages(roomId).find(m => m.id === messageId);
    if (!msg || msg.deleted) return;
    // Owner or tutor can delete
    if (msg.userId !== userId && !isTutor(clubId, userId)) return;
    msg.deleted = true;
    msg.message = 'This message was deleted';
    io.to(roomId).emit('messageUpdated', msg);
  });

  // ── pinMessage ──────────────────────────────────────────────────────────────
  socket.on('pinMessage', ({ roomId, messageId, userId, clubId }) => {
    const msg = roomMessages(roomId).find(m => m.id === messageId);
    if (!msg || msg.deleted) return;
    msg.pinned = !msg.pinned;
    io.to(roomId).emit('messageUpdated', msg);
    io.to(roomId).emit('pinnedMessages', roomMessages(roomId).filter(m => m.pinned && !m.deleted));
  });

  // ── reactMessage ────────────────────────────────────────────────────────────
  socket.on('reactMessage', ({ roomId, messageId, userId, emoji }) => {
    const msg = roomMessages(roomId).find(m => m.id === messageId);
    if (!msg || msg.deleted) return;
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    const idx = msg.reactions[emoji].indexOf(userId);
    if (idx === -1) msg.reactions[emoji].push(userId);
    else msg.reactions[emoji].splice(idx, 1); // toggle off
    io.to(roomId).emit('messageUpdated', msg);
  });

  // ── forwardMessage ──────────────────────────────────────────────────────────
  socket.on('forwardMessage', ({ fromRoomId, toRoomId, messageId, userId, username, clubId }) => {
    const original = roomMessages(fromRoomId).find(m => m.id === messageId);
    if (!original || original.deleted) return;
    const msg = {
      id: uuidv4(), roomId: toRoomId, userId, username,
      message: original.message, timestamp: new Date(),
      type: toRoomId.startsWith('club_') ? 'group' : 'private',
      edited: false, deleted: false, pinned: false, reactions: {},
      forwardedFrom: { username: original.username, message: original.message }
    };
    roomMessages(toRoomId).push(msg);
    io.to(toRoomId).emit('receiveMessage', msg);
  });

  // ── privateMessage ──────────────────────────────────────────────────────────
  socket.on('privateMessage', ({ fromUserId, fromUsername, toUserId, message, forwardedFrom }) => {
    const roomId = privateRoomId(fromUserId, toUserId);
    socket.join(roomId);
    const msg = {
      id: uuidv4(), roomId, userId: fromUserId, username: fromUsername,
      fromUserId, fromUsername, toUserId, message,
      timestamp: new Date(), type: 'private',
      edited: false, deleted: false, pinned: false, reactions: {},
      forwardedFrom: forwardedFrom || null
    };
    roomMessages(roomId).push(msg);
    io.to(roomId).emit('receiveMessage', msg);
  });

  // ── joinPrivateRoom ─────────────────────────────────────────────────────────
  socket.on('joinPrivateRoom', ({ userId, targetUserId }) => {
    const roomId = privateRoomId(userId, targetUserId);
    socket.join(roomId);
    socket.emit('messageHistory', roomMessages(roomId).filter(m => !m.deleted));
  });

  // ── typing ──────────────────────────────────────────────────────────────────
  socket.on('typing', ({ clubId, userId, username, isTyping, roomId }) => {
    const room = roomId || `club_${clubId}`;
    socket.to(room).emit('typing', { userId, username, isTyping });
  });

  // ── kickMember (tutor only) ─────────────────────────────────────────────────
  socket.on('kickMember', ({ clubId, targetUserId, tutorUserId }) => {
    if (!isTutor(clubId, tutorUserId)) return;
    const roomId = `club_${clubId}`;
    // Find target socket and remove from room
    const target = (onlineUsers[roomId] || []).find(u => u.userId === targetUserId);
    if (target) {
      const targetSocket = io.sockets.sockets.get(target.socketId);
      if (targetSocket) {
        targetSocket.emit('kicked', { message: 'You have been removed from this club chat by the tutor.' });
        targetSocket.leave(roomId);
      }
      onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.userId !== targetUserId);
    }
    io.to(roomId).emit('onlineUsers', onlineUsers[roomId] || []);
    io.to(roomId).emit('memberKicked', { targetUserId });
  });

  // ── blockMember (tutor only) ────────────────────────────────────────────────
  socket.on('blockMember', ({ clubId, targetUserId, tutorUserId }) => {
    if (!isTutor(clubId, tutorUserId)) return;
    if (!blockedUsers[clubId]) blockedUsers[clubId] = new Set();
    blockedUsers[clubId].add(targetUserId);
    const roomId = `club_${clubId}`;
    const target = (onlineUsers[roomId] || []).find(u => u.userId === targetUserId);
    if (target) {
      const targetSocket = io.sockets.sockets.get(target.socketId);
      if (targetSocket) {
        targetSocket.emit('blocked', { message: 'You have been blocked from this club chat.' });
        targetSocket.leave(roomId);
      }
      onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.userId !== targetUserId);
    }
    io.to(roomId).emit('onlineUsers', onlineUsers[roomId] || []);
    io.to(roomId).emit('memberBlocked', { targetUserId });
  });

  // ── unblockMember (tutor only) ──────────────────────────────────────────────
  socket.on('unblockMember', ({ clubId, targetUserId, tutorUserId }) => {
    if (!isTutor(clubId, tutorUserId)) return;
    blockedUsers[clubId]?.delete(targetUserId);
    io.to(`club_${clubId}`).emit('memberUnblocked', { targetUserId });
  });

  // ── disconnect ──────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const { userId, username, clubId } = socket.data || {};
    if (clubId) {
      const roomId = `club_${clubId}`;
      if (onlineUsers[roomId]) {
        onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit('onlineUsers', onlineUsers[roomId]);
        io.to(roomId).emit('userLeft', { userId, username, timestamp: new Date() });
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
  eurekaClient.start(err => {
    if (err) console.error('Eureka registration failed:', err);
    else console.log('Registered with Eureka');
  });
});
