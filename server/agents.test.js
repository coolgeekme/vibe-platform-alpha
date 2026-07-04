const { spawnAgent, AGENT_CONFIG } = require('./agents');

// Test 1: AGENT_CONFIG has correct structure
function testAgentConfig() {
  console.log('Test: AGENT_CONFIG structure');
  
  if (!AGENT_CONFIG.claude) throw new Error('Missing claude config');
  if (!AGENT_CONFIG.codex) throw new Error('Missing codex config');
  if (AGENT_CONFIG.claude.binary !== 'claude') throw new Error('Wrong claude binary');
  if (AGENT_CONFIG.codex.binary !== 'codex') throw new Error('Wrong codex binary');
  if (!Array.isArray(AGENT_CONFIG.claude.args)) throw new Error('claude args must be array');
  if (!Array.isArray(AGENT_CONFIG.codex.args)) throw new Error('codex args must be array');
  if (typeof AGENT_CONFIG.claude.env !== 'object') throw new Error('claude env must be object');
  if (typeof AGENT_CONFIG.codex.env !== 'object') throw new Error('codex env must be object');
  
  console.log('  \u2713 AGENT_CONFIG has correct structure');
}

// Test 2: spawnAgent rejects unknown agents
async function testUnknownAgent() {
  console.log('Test: Unknown agent rejection');
  
  try {
    await spawnAgent('unknown_agent', 'test', () => {});
    throw new Error('Should have thrown');
  } catch (err) {
    if (!err.message.includes('Unknown agent')) {
      throw new Error(`Wrong error message: ${err.message}`);
    }
  }
  
  console.log('  \u2713 Unknown agent throws correct error');
}

// Test 3: spawnAgent calls onChunk callback (whether dev-mode or real binary)
async function testOnChunkCalled() {
  console.log('Test: onChunk callback invoked');
  
  const chunks = [];
  try {
    await spawnAgent('claude', 'echo test', (chunk) => {
      chunks.push(chunk);
    });
  } catch (err) {
    // Even if the binary fails, chunks should have been produced
    // (the spawn message at minimum)
  }
  
  // The spawner always emits at least the dev-mode prefix OR some stdout
  // In CI without auth, the binary may error \u2014 that's fine, we just verify the callback fires
  if (chunks.length === 0) throw new Error('No chunks received (onChunk never called)');
  
  console.log(`  \u2713 onChunk received ${chunks.length} chunk(s)`);
}

// Test 4: spawnAgent returns a promise
function testReturnsPromise() {
  console.log('Test: spawnAgent returns a Promise');
  
  const result = spawnAgent('claude', 'test', () => {});
  if (!(result instanceof Promise)) throw new Error('spawnAgent must return a Promise');
  
  // Clean up - just catch the rejection
  result.catch(() => {});
  
  console.log('  \u2713 spawnAgent returns a Promise');
}

// Test 5: module exports are correct
function testExports() {
  console.log('Test: Module exports');
  
  if (typeof spawnAgent !== 'function') throw new Error('spawnAgent must be a function');
  if (typeof AGENT_CONFIG !== 'object') throw new Error('AGENT_CONFIG must be an object');
  
  console.log('  \u2713 Module exports are correct');
}

// Run all tests
async function main() {
  console.log('\n=== Agent Module Tests ===\n');
  
  testAgentConfig();
  testExports();
  testReturnsPromise();
  await testUnknownAgent();
  await testOnChunkCalled();
  
  console.log('\n=== All tests passed \u2713 ===\n');
}

main().catch((err) => {
  console.error(`\n\u2717 Test failed: ${err.message}`);
  process.exit(1);
});
