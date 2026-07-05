const { spawn } = require('child_process');

/**
 * Agent configuration — maps agent names to CLI binaries.
 */
const AGENT_CONFIG = {
  claude: {
    binary: 'claude',
    args: ['--print'],
    env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '' },
  },
  codex: {
    binary: 'codex',
    args: ['--quiet'],
    env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY || '' },
  },
};

/**
 * Spawn an agent process and stream output via callback.
 * 
 * @param {string} agentName - 'claude' or 'codex'
 * @param {string} command - The prompt/command to send
 * @param {function} onChunk - Callback for each output chunk
 * @returns {Promise<void>}
 */
function spawnAgent(agentName, command, onChunk) {
  return new Promise((resolve, reject) => {
    const config = AGENT_CONFIG[agentName];

    if (!config) {
      return reject(new Error(`Unknown agent: ${agentName}`));
    }

    // Check if the binary exists before spawning
    const which = spawn('which', [config.binary]);

    which.on('close', (code) => {
      if (code !== 0) {
        onChunk(`[error] ${agentName} CLI not found on this system. Please install '${config.binary}'.`);
        return reject(new Error(`${agentName} binary not found`));
      }

      // Binary exists — spawn the real process
      const proc = spawn(config.binary, [...config.args, command], {
        env: { ...process.env, ...config.env },
        shell: true,
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
          resolve();
        } else {
          reject(new Error(`${agentName} exited with code ${exitCode}`));
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to spawn ${agentName}: ${err.message}`));
      });
    });
  });
}

module.exports = { spawnAgent, AGENT_CONFIG };
