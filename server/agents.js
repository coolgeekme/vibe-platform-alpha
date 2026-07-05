const { spawn } = require('child_process');
const OpenAI = require('openai');

/**
 * Agent configuration
 */
const AGENT_CONFIG = {
  claude: {
    type: 'cli',
    binary: 'claude',
    args: ['-p'],  // headless/print mode
    env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '' },
  },
  codex: {
    type: 'sdk',
    model: 'gpt-4o',  // primary vibe coder engine
    fallbackModel: 'o3-mini',
  },
};

// Lazy-initialize OpenAI client (after dotenv has loaded)
let _openai = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

/**
 * Run the Claude agent via CLI in headless mode (claude -p "command")
 */
function spawnClaude(command, onChunk) {
  return new Promise((resolve, reject) => {
    const config = AGENT_CONFIG.claude;

    const proc = spawn(config.binary, [...config.args, command], {
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
      },
      stdio: ['ignore', 'pipe', 'pipe'],  // ignore stdin to suppress warning
    });

    let output = '';

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      text.split('\n').filter(Boolean).forEach((line) => {
        onChunk(line);
      });
    });

    proc.stderr.on('data', (data) => {
      const errText = data.toString().trim();
      if (errText) {
        onChunk(`[stderr] ${errText}`);
      }
    });

    proc.on('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(output);
      } else {
        reject(new Error(`claude exited with code ${exitCode}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });
  });
}

/**
 * Run the Codex agent via OpenAI SDK (streaming)
 */
async function spawnCodex(command, onChunk) {
  const config = AGENT_CONFIG.codex;
  const client = getOpenAI();

  try {
    const stream = await client.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are Codex, an expert vibe coder assistant. You write clean, production-ready code. Be concise and actionable.',
        },
        {
          role: 'user',
          content: command,
        },
      ],
      stream: true,
      max_tokens: 4096,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        const lines = content.split('\n');
        lines.forEach((line) => {
          if (line) onChunk(line);
        });
      }
    }

    return fullResponse;
  } catch (err) {
    // If primary model fails, try fallback
    if (config.fallbackModel) {
      onChunk(`[info] Primary model (${config.model}) failed: ${err.message}. Trying ${config.fallbackModel}...`);
      const stream = await client.chat.completions.create({
        model: config.fallbackModel,
        messages: [
          {
            role: 'system',
            content: 'You are Codex, an expert vibe coder assistant. You write clean, production-ready code. Be concise and actionable.',
          },
          {
            role: 'user',
            content: command,
          },
        ],
        stream: true,
        max_tokens: 4096,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          const lines = content.split('\n');
          lines.forEach((line) => {
            if (line) onChunk(line);
          });
        }
      }
      return fullResponse;
    }
    throw err;
  }
}

/**
 * Spawn an agent process and stream output via callback.
 *
 * @param {string} agentName - 'claude' or 'codex'
 * @param {string} command - The prompt/command to send
 * @param {function} onChunk - Callback for each output chunk
 * @returns {Promise<string>}
 */
async function spawnAgent(agentName, command, onChunk) {
  if (agentName === 'claude') {
    return spawnClaude(command, onChunk);
  } else if (agentName === 'codex') {
    return spawnCodex(command, onChunk);
  } else {
    throw new Error(`Unknown agent: ${agentName}`);
  }
}

module.exports = { spawnAgent, AGENT_CONFIG };
