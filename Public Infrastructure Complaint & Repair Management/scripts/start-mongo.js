#!/usr/bin/env node
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const localDbPath = path.join(rootDir, 'tmp', 'mongo-data');

const candidates = [
  process.env.MONGOD_PATH,
  '/opt/homebrew/bin/mongod',
  '/usr/local/bin/mongod',
  '/usr/bin/mongod',
  'C:\\Program Files\\MongoDB\\Server\\9.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
];

let mongoExe = 'mongod';
for (const candidate of candidates) {
  if (candidate && fs.existsSync(candidate)) {
    mongoExe = candidate;
    break;
  }
}

if (mongoExe === 'mongod') {
  try {
    const isWin = process.platform === 'win32';
    const checkCmd = isWin ? 'where mongod' : 'which mongod';
    const resolved = execSync(checkCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split('\n')[0].trim();
    if (resolved && fs.existsSync(resolved)) {
      mongoExe = resolved;
    }
  } catch (err) {
    // fallback to 'mongod'
  }
}

if (!fs.existsSync(localDbPath)) {
  fs.mkdirSync(localDbPath, { recursive: true });
}

console.log(`[CivicFix] Starting MongoDB using executable: ${mongoExe}`);
console.log(`[CivicFix] DB Path: ${localDbPath}`);

const child = spawn(mongoExe, [
  '--dbpath', localDbPath,
  '--port', '27017',
  '--bind_ip', '127.0.0.1',
], { stdio: 'inherit' });

child.on('error', (err) => {
  console.error('[CivicFix] Failed to start MongoDB:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
