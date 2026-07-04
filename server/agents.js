const { spawn } = require('child_process');

/**
 * Agent configuration \u2014 maps agent names to CLI binaries.
 * In production, these would be the actual `claude` and `codex` CLI tools.
 */
const AGENT_CONFIG = {
  claude: {
    binary: 'claude',
    args: ['--print'],
    env: { CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '' },
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
        // Binary not found \u2014 simulate output for development
        onChunk(`[dev-mode] ${agentName} binary not found. Simulating response...`);
        
        setTimeout(() => {
          onChunk(`[${agentName}] Processing: "${command}"`);
        }, 500);

        setTimeout(() => {
          onChunk(`[${agentName}] Thinking...`);
        }, 1200);

        setTimeout(() => {
          onChunk(`[${agentName}] Done. (simulated \u2014 install '${config.binary}' CLI for real output)`);
          resolve();
        }, 2000);

        return;
      }

      // Binary exists \u2014 spawn the real process
      const proc = spawn(config.binary, [...config.args, command], {
        env: { ...process.env, ...config.env },
        shell: true,
      });

      proc.stdout.on('data', (data) => {
        const text = data.toString();
        text.split('\n').filter(Boolean).forEach((line) => {
          onChunk(line);
        });
      });

      proc.stderr.on('data', (data) => {
        onChunk(`[stderr] ${data.toString().trim()}`);
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
