import fs from 'fs';
import path from 'path';

// Advanced production logger extending Phase 7 logger
export const prodLogger = {
  _logToFile(level: string, message: string, meta: any) {
    const logDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
       try { fs.mkdirSync(logDir, { recursive: true }); } catch (e) {}
    }

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level}]: ${message} ${meta ? JSON.stringify(meta) : ''}\n`;
    
    // Choose file based on level
    const fileName = level === 'ERROR' ? 'error.log' : 'system.log';
    
    try {
      fs.appendFileSync(path.join(logDir, fileName), logEntry);
    } catch (e) {
      console.error('Failed to write to log file', e);
    }
  },

  info(msg: string, meta?: any) {
    console.log(`INFO: ${msg}`, meta || '');
    this._logToFile('INFO', msg, meta);
  },

  warn(msg: string, meta?: any) {
    console.warn(`WARN: ${msg}`, meta || '');
    this._logToFile('WARN', msg, meta);
  },

  error(msg: string, meta?: any) {
    console.error(`ERROR: ${msg}`, meta || '');
    this._logToFile('ERROR', msg, meta);
  }
};
