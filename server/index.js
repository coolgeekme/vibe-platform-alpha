const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { spawnAgent } = require('./agents');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

const PORT = process.env.PORT || 4000;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    agents: {
      claude: { available: true, binary: 'claude' },
      codex: { available: true, binary: 'codex' },
    },
  });
});

// REST endpoint for one-shot commands
app.use(express.json());

app.post('/api/execute', (req, res) => {
  const { command, agent = 'claude' } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'command is required' });
  }

  // Return immediately; streaming happens over WebSocket
  res.json({
    status: 'queued',
    agent,
    command,
    message: `Command queued for ${agent}. Connect via WebSocket for streaming output.`,
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`[ws] Client connected: ${socket.id}`);

  socket.emit('agent:status', {
    type: 'status',
    data: 'Connected to Vibe Agent Server',
    timestamp: Date.now(),
  });

  // Handle agent commands
  socket.on('agent:command', async ({ command, agent }) => {
    console.log(`[ws] Command from ${socket.id}: [${agent}] ${command}`);

    socket.emit('agent:output', {
      type: 'output',
      data: `\u25b8 Spawning ${agent} agent...`,
      agent,
      timestamp: Date.now(),
    });

    try {
      await spawnAgent(agent, command, (chunk) => {
        socket.emit('agent:output', {
          type: 'output',
          data: chunk,
          agent,
          timestamp: Date.now(),
        });
      });

      socket.emit('agent:status', {
        type: 'status',
        data: `\u2713 ${agent} completed`,
        agent,
        timestamp: Date.now(),
      });
    } catch (err) {
      socket.emit('agent:error', {
        type: 'error',
        data: `\u2717 ${agent} error: ${err.message}`,
        agent,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[ws] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551   VIBE PLATFORM - Agent Server v0.1.0   \u2551
\u2551   Port: ${PORT}                            \u2551
\u2551   WebSocket: ws://localhost:${PORT}         \u2551
\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d
  `);
});
