require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { spawnAgent, AGENT_CONFIG } = require('./agents');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
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
      claude: {
        available: true,
        type: 'cli',
        binary: 'claude -p',
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      },
      codex: {
        available: true,
        type: 'openai-sdk',
        model: AGENT_CONFIG.codex.model,
        fallback: AGENT_CONFIG.codex.fallbackModel,
        hasApiKey: !!process.env.OPENAI_API_KEY,
      },
    },
  });
});

// REST endpoint for one-shot commands (non-streaming)
app.use(express.json());

app.post('/api/execute', async (req, res) => {
  const { command, agent = 'claude' } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'command is required' });
  }

  try {
    const chunks = [];
    const result = await spawnAgent(agent, command, (chunk) => {
      chunks.push(chunk);
    });

    res.json({
      status: 'completed',
      agent,
      command,
      output: chunks.join('\n'),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      agent,
      command,
      error: err.message,
    });
  }
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
      data: `> Spawning ${agent} agent...`,
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
        data: `[done] ${agent} completed`,
        agent,
        timestamp: Date.now(),
      });
    } catch (err) {
      socket.emit('agent:error', {
        type: 'error',
        data: `[error] ${agent}: ${err.message}`,
        agent,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[ws] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(44));
  console.log('  VIBE PLATFORM - Agent Server v0.1.0');
  console.log(`  Port: ${PORT}`);
  console.log('  Agents: claude (CLI), codex (OpenAI SDK)');
  console.log('='.repeat(44));
});
