import mongoose from 'mongoose';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from '../seeds/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localDbPath = path.join(__dirname, '..', 'tmp', 'mongo-data');

const getMongoExecutable = () => {
  const candidates = [
    process.env.MONGOD_PATH,
    '/opt/homebrew/bin/mongod',
    '/usr/local/bin/mongod',
    '/usr/bin/mongod',
    'C:\\Program Files\\MongoDB\\Server\\9.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  try {
    const isWin = process.platform === 'win32';
    const checkCmd = isWin ? 'where mongod' : 'which mongod';
    const resolved = execSync(checkCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split('\n')[0].trim();
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch (err) {
    // ignore
  }

  return 'mongod';
};

const tryAutoSpawnMongo = () => {
  return new Promise((resolve) => {
    const mongoExe = getMongoExecutable();
    try {
      if (!fs.existsSync(localDbPath)) {
        fs.mkdirSync(localDbPath, { recursive: true });
      }
      console.log(`[CivicFix] Attempting to auto-spawn MongoDB instance via ${mongoExe}...`);
      const child = spawn(mongoExe, [
        '--dbpath', localDbPath,
        '--port', '27017',
        '--bind_ip', '127.0.0.1',
      ], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      child.on('error', (err) => {
        console.warn('[CivicFix] Auto-spawn warning:', err.message);
      });
    } catch (e) {
      console.warn('[CivicFix] Auto-spawn notice:', e.message);
    }
    setTimeout(resolve, 2500);
  });
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicfix';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[CivicFix] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await seedDatabase();
    return true;
  } catch (initialErr) {
    // Attempt auto-spawn if installed locally
    console.log('[CivicFix] Connecting to local MongoDB...');
    await tryAutoSpawnMongo();

    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[CivicFix] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      await seedDatabase();
      return true;
    } catch (finalErr) {
      console.warn(`[CivicFix] MongoDB Notice: Could not connect to ${mongoURI} (${finalErr.message}).`);
      console.warn(`[CivicFix] Run 'npm run db:start' or start MongoDB service to persist data.`);
      return false;
    }
  }
};

export default connectDB;
