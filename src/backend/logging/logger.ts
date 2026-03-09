export const logger = {
  /**
   * Internal helper to format log messages
   */
  _formatMessage(level: string, module: string, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${module}]: ${message}`;
  },

  /**
   * Log informational messages
   */
  info(module: string, message: string, data?: any) {
    console.log(this._formatMessage('INFO', module, message), data ? data : '');
  },

  /**
   * Log warnings
   */
  warn(module: string, message: string, data?: any) {
    console.warn(this._formatMessage('WARN', module, message), data ? data : '');
  },

  /**
   * Log critical errors
   */
  error(module: string, message: string, error?: any) {
    console.error(this._formatMessage('ERROR', module, message), error ? error : '');
  }
};
