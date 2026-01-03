#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';

// Check if server is healthy BEFORE running tests
async function checkServerHealth(): Promise<{
  ok: boolean;
  message: string;
  playwrightBaseUrl?: string;
}> {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    return {
      ok: true,
      message: `Using PLAYWRIGHT_BASE_URL=${process.env.PLAYWRIGHT_BASE_URL}`,
      playwrightBaseUrl: process.env.PLAYWRIGHT_BASE_URL,
    };
  }

  const portInUse = await new Promise<boolean>((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      server.close();
      resolve(true);
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(3001);
  });

  // If 3001 is running, prefer it (never kill/restart it automatically)
  if (portInUse) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch('http://localhost:3001/', {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return {
          ok: false,
          message: `Dev server on port 3001 responded with ${response.status}. Restart it only if you intend to.`,
        };
      }

      return {
        ok: true,
        message: 'Dev server detected on port 3001 (Playwright will reuse it)',
        playwrightBaseUrl: 'http://localhost:3001',
      };
    } catch {
      return {
        ok: false,
        message:
          'Port 3001 is in use but the server did not respond. Restart it only if you intend to.',
      };
    }
  }

  return {
    ok: true,
    message:
      'No dev server detected on port 3001 (Playwright will start its own server on port 3002)',
  };
}

interface GateResult {
  name: string;
  cmd: string;
  pass: boolean;
  output: string;
  summary: string;
}

function parseGateOutput(name: string, output: string, pass: boolean): string {
  if (name === 'lint') {
    if (pass) {
      return '0 errors, 0 warnings';
    } else {
      const errorMatch = output.match(/(\d+) error/);
      const warnMatch = output.match(/(\d+) warning/);
      const errors = errorMatch ? errorMatch[1] : '?';
      const warnings = warnMatch ? warnMatch[1] : '0';
      return `${errors} errors, ${warnings} warnings`;
    }
  }

  if (name === 'build') {
    if (pass) {
      return 'Compiled successfully';
    } else {
      return 'Build failed';
    }
  }

  if (name === 'unit') {
    const passMatch = output.match(/(\d+) pass/);
    const failMatch = output.match(/(\d+) fail/);
    const totalMatch = output.match(/tests? (\d+)/);

    if (passMatch) {
      const passed = passMatch[1];
      const total = totalMatch ? totalMatch[1] : passed;
      return `${passed}/${total} tests passing`;
    }
    return pass ? 'All tests passing' : 'Tests failed';
  }

  if (name === 'e2e') {
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);

    if (passMatch) {
      const passed = passMatch[1];
      return `${passed} tests passing`;
    }
    return pass ? 'All tests passing' : 'Tests failed';
  }

  return pass ? 'Pass' : 'Fail';
}

async function runGate(
  name: string,
  cmd: string,
  outDir: string,
  envOverride?: NodeJS.ProcessEnv
): Promise<GateResult> {
  console.log(`Running ${name}...`);

  try {
    const output = execSync(cmd, {
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: envOverride ? { ...process.env, ...envOverride } : process.env,
    });

    const outputPath = path.join(outDir, `${name}.txt`);
    fs.writeFileSync(outputPath, output);

    const summary = parseGateOutput(name, output, true);

    return {
      name,
      cmd,
      pass: true,
      output,
      summary,
    };
  } catch (err: any) {
    const output = err.stdout || err.stderr || err.message || 'Unknown error';
    const outputPath = path.join(outDir, `${name}.txt`);
    fs.writeFileSync(outputPath, output);

    const summary = parseGateOutput(name, output, false);

    return {
      name,
      cmd,
      pass: false,
      output,
      summary,
    };
  }
}

function generateSummary(results: GateResult[], timestamp: string): string {
  // Convert timestamp from format "2025-12-26T04-19-37" to ISO format
  const isoTimestamp = timestamp.replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');
  const date = new Date(isoTimestamp);
  const dateStr = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const allPassed = results.every((r) => r.pass);

  let markdown = `## Verification Bundle - ${dateStr}\n\n`;
  markdown += `### Results\n`;
  markdown += `| Gate | Status | Details |\n`;
  markdown += `|------|--------|---------|\n`;

  const gateNames: Record<string, string> = {
    lint: 'Lint',
    build: 'Build',
    unit: 'Unit',
    e2e: 'E2E',
  };

  for (const result of results) {
    const status = result.pass ? '✅ Pass' : '❌ Fail';
    const gateName = gateNames[result.name] || result.name;
    markdown += `| ${gateName} | ${status} | ${result.summary} |\n`;
  }

  markdown += `\n### Proof\n`;
  markdown += `Outputs saved to: \`reports/verification/${timestamp}/\`\n`;

  if (allPassed) {
    markdown += `\n### ✅ All Quality Gates Passed\n`;
  } else {
    markdown += `\n### ❌ Some Quality Gates Failed\n`;
    markdown += `Review individual gate outputs for details.\n`;
  }

  return markdown;
}

function checkSessionLogSize(): void {
  const sessionLogPath = path.join('.ai', 'SESSION_LOG.md');

  if (!fs.existsSync(sessionLogPath)) {
    return; // File doesn't exist, nothing to check
  }

  const content = fs.readFileSync(sessionLogPath, 'utf8');
  // Count session entries (lines starting with "## " followed by a date)
  const sessionEntries = content.match(/^## \d{4}-\d{2}-\d{2}/gm) || [];

  if (sessionEntries.length > 5) {
    console.log('⚠️  SESSION_LOG.md has', sessionEntries.length, 'entries');
    console.log('   Trim to 3 per CLAUDE.md Rule #5. Git history preserves everything.\n');
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('   AI Verification Bundle');
  console.log('═══════════════════════════════════════\n');

  // CRITICAL: Check server health BEFORE running tests
  // This prevents infinite loops when server is crashed
  console.log('Checking server health...');
  const serverHealth = await checkServerHealth();
  if (!serverHealth.ok) {
    console.error('\n❌ SERVER HEALTH CHECK FAILED');
    console.error(`   ${serverHealth.message}`);
    console.error('\n   FIX THE SERVER BEFORE RETRYING.');
    console.error('   DO NOT retry ai:verify until server is fixed.\n');
    process.exit(1);
  }
  console.log(`✅ ${serverHealth.message}\n`);

  // Check session log size (warning only, doesn't block)
  checkSessionLogSize();

  // Create timestamp and output directory
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const outDir = path.join('reports', 'verification', timestamp);

  fs.mkdirSync(outDir, { recursive: true });

  const e2eEnv = serverHealth.playwrightBaseUrl
    ? { PLAYWRIGHT_BASE_URL: serverHealth.playwrightBaseUrl }
    : undefined;

  // Define gates
  const gates: Array<{ name: string; cmd: string; env?: NodeJS.ProcessEnv }> = [
    { name: 'lint', cmd: 'npm run lint' },
    { name: 'build', cmd: 'npm run build' },
    { name: 'unit', cmd: 'npm run test:unit' },
    { name: 'e2e', cmd: 'npm run test:e2e', env: e2eEnv },
  ];

  // Run all gates
  const results: GateResult[] = [];

  for (const gate of gates) {
    const result = await runGate(gate.name, gate.cmd, outDir, gate.env);
    results.push(result);
  }

  // Generate summary
  const summary = generateSummary(results, timestamp);
  const summaryPath = path.join(outDir, 'summary.md');
  fs.writeFileSync(summaryPath, summary);

  console.log('\n═══════════════════════════════════════');
  console.log('   Verification Complete');
  console.log('═══════════════════════════════════════\n');

  console.log(summary);

  // Exit with appropriate code
  const allPassed = results.every((r) => r.pass);
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
