const { app } = require('electron');
const FileManager = require('./fileManager');
const fs = require('fs').promises;
const path = require('path');

/**
 * SECURITY FIX: Pass app object to FileManager for secure path resolution
 *
 * This ensures FileManager uses app.getAppPath() instead of process.cwd()
 * which prevents directory traversal attacks at the root level.
 */
const fileManager = new FileManager(app);

/**
 * SECURITY: Rate Limiting Implementation
 *
 * Prevents DoS attacks by limiting IPC request frequency per channel.
 *
 * Structure: Map<channel, Map<timestamp, count>>
 * - Tracks requests per channel in sliding time window
 * - Automatically cleans up old entries
 * - Configurable limits per channel type
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute window
const RATE_LIMITS = {
  'save-agent': 10,           // 10 saves per minute (reasonable for normal use)
  'load-agents': 20,          // 20 loads per minute
  'get-existing-agents': 20,  // 20 loads per minute
  'process-pdf': 5,           // 5 PDF uploads per minute (resource intensive)
  'load-settings': 30,        // 30 per minute (lightweight)
  'save-settings': 20,        // 20 per minute
  'load-template': 10,        // 10 per minute
  'consult-agent': 30,        // 30 consultations per minute
  'get-app-version': 60,      // 60 per minute (very lightweight)
};

/**
 * Check if request should be rate limited
 *
 * @param {string} channel - IPC channel name
 * @returns {boolean} true if request should be blocked
 */
function isRateLimited(channel) {
  const now = Date.now();
  const limit = RATE_LIMITS[channel] || 10; // Default 10 requests per minute

  if (!rateLimitMap.has(channel)) {
    rateLimitMap.set(channel, []);
  }

  const requests = rateLimitMap.get(channel);

  // Remove requests outside the time window
  const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  rateLimitMap.set(channel, validRequests);

  // Check if limit exceeded
  if (validRequests.length >= limit) {
    console.warn(`Rate limit exceeded for channel: ${channel}`);
    return true;
  }

  // Add current request
  validRequests.push(now);
  return false;
}

/**
 * SECURITY: Input Validation Helpers
 *
 * Validates and sanitizes inputs before processing.
 * Prevents injection attacks and unexpected behavior.
 */
const validators = {
  /**
   * Validate agent data object
   */
  validateAgentData(agentData) {
    if (!agentData || typeof agentData !== 'object') {
      throw new Error('Invalid agent data: must be an object');
    }

    if (!agentData.name || typeof agentData.name !== 'string') {
      throw new Error('Invalid agent data: name is required and must be a string');
    }

    if (agentData.name.length > 200) {
      throw new Error('Invalid agent data: name too long (max 200 characters)');
    }

    if (!agentData.content || typeof agentData.content !== 'string') {
      throw new Error('Invalid agent data: content is required and must be a string');
    }

    if (agentData.content.length > 1000000) { // 1MB text limit
      throw new Error('Invalid agent data: content too large (max 1MB)');
    }

    if (agentData.metadata && typeof agentData.metadata !== 'object') {
      throw new Error('Invalid agent data: metadata must be an object');
    }

    return true;
  },

  /**
   * Validate settings object
   */
  validateSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings: must be an object');
    }

    // Validate theme if present
    if (settings.theme && !['light', 'dark'].includes(settings.theme)) {
      throw new Error('Invalid settings: theme must be "light" or "dark"');
    }

    // Validate boolean flags
    ['autoSave', 'consultAgents'].forEach(key => {
      if (settings[key] !== undefined && typeof settings[key] !== 'boolean') {
        throw new Error(`Invalid settings: ${key} must be a boolean`);
      }
    });

    return true;
  },

  /**
   * Validate file path for PDF processing
   *
   * SECURITY: Validates path is absolute and file exists
   */
  async validatePdfPath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path: must be a string');
    }

    if (!path.isAbsolute(filePath)) {
      throw new Error('Invalid file path: must be absolute');
    }

    // Verify file exists and get size
    try {
      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        throw new Error('Invalid file path: not a file');
      }

      // Check file size (10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (stats.size > MAX_FILE_SIZE) {
        throw new Error(`File too large: maximum ${MAX_FILE_SIZE / 1024 / 1024}MB allowed`);
      }

      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw error;
    }
  },

  /**
   * Validate agent type string
   */
  validateAgentType(agentType) {
    if (!agentType || typeof agentType !== 'string') {
      throw new Error('Invalid agent type: must be a non-empty string');
    }

    if (agentType.length > 100) {
      throw new Error('Invalid agent type: too long (max 100 characters)');
    }

    // Agent type should only contain safe characters
    if (!/^[a-zA-Z0-9-_]+$/.test(agentType)) {
      throw new Error('Invalid agent type: only alphanumeric, hyphens, and underscores allowed');
    }

    return true;
  },
};

/**
 * SECURITY: Error Message Sanitizer
 *
 * Removes sensitive information from error messages before sending to renderer.
 * Prevents information disclosure through error messages.
 */
function sanitizeErrorMessage(error) {
  const message = error.message || 'An error occurred';

  // Remove file paths from error messages
  const sanitized = message
    .replace(/\/[^\s]+/g, '[path]')           // Remove Unix paths
    .replace(/[A-Z]:\\[^\s]+/g, '[path]')     // Remove Windows paths
    .replace(/\bat\s+.*$/gm, '')              // Remove stack trace locations
    .replace(/\(.*?:\d+:\d+\)/g, '');         // Remove line:column references

  return sanitized.trim() || 'An error occurred';
}

function setupIpcHandlers(ipcMain, _mainWindow) {
  /**
   * HANDLER: save-agent
   * SECURITY: Rate limited, input validated, error sanitized
   */
  ipcMain.handle('save-agent', async (event, agentData) => {
    try {
      // Rate limit check
      if (isRateLimited('save-agent')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      // Input validation
      validators.validateAgentData(agentData);

      const result = await fileManager.saveAgent(agentData);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error saving agent:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: load-agents
   * SECURITY: Rate limited, error sanitized
   */
  ipcMain.handle('load-agents', async () => {
    try {
      // Rate limit check
      if (isRateLimited('load-agents')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      const agents = await fileManager.loadGeneratedAgents();
      return { success: true, agents };
    } catch (error) {
      console.error('Error loading agents:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: get-existing-agents
   * SECURITY: Rate limited, error sanitized
   */
  ipcMain.handle('get-existing-agents', async () => {
    try {
      // Rate limit check
      if (isRateLimited('get-existing-agents')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      const agents = await fileManager.loadExistingAgents();
      return { success: true, agents };
    } catch (error) {
      console.error('Error loading existing agents:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: process-pdf
   * SECURITY: Rate limited, path validated, file size checked, error sanitized
   */
  ipcMain.handle('process-pdf', async (event, filePath) => {
    try {
      // Rate limit check (most restrictive due to resource intensity)
      if (isRateLimited('process-pdf')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      // Input validation (includes file size check)
      await validators.validatePdfPath(filePath);

      const pdfParse = require('pdf-parse');

      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);

      return {
        success: true,
        text: pdfData.text,
        pages: pdfData.numpages,
        info: pdfData.info,
      };
    } catch (error) {
      console.error('Error processing PDF:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: load-settings
   * SECURITY: Rate limited, error sanitized
   */
  ipcMain.handle('load-settings', async () => {
    try {
      // Rate limit check
      if (isRateLimited('load-settings')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.', settings: {} };
      }

      const settings = await fileManager.loadSettings();
      return { success: true, settings };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { success: false, error: sanitizeErrorMessage(error), settings: {} };
    }
  });

  /**
   * HANDLER: save-settings
   * SECURITY: Rate limited, input validated, error sanitized
   */
  ipcMain.handle('save-settings', async (event, settings) => {
    try {
      // Rate limit check
      if (isRateLimited('save-settings')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      // Input validation
      validators.validateSettings(settings);

      await fileManager.saveSettings(settings);
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: load-template
   * SECURITY: Rate limited, error sanitized
   */
  ipcMain.handle('load-template', async () => {
    try {
      // Rate limit check
      if (isRateLimited('load-template')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      const template = await fileManager.loadTemplate();
      return { success: true, template };
    } catch (error) {
      console.error('Error loading template:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });

  /**
   * HANDLER: get-app-version
   * SECURITY: Rate limited (lightweight operation)
   */
  ipcMain.handle('get-app-version', () => {
    try {
      // Rate limit check
      if (isRateLimited('get-app-version')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      return app.getVersion();
    } catch (error) {
      console.error('Error getting app version:', error);
      return '1.0.0'; // Fallback version
    }
  });

  /**
   * HANDLER: consult-agent
   * SECURITY: Rate limited, input validated, error sanitized
   */
  ipcMain.handle('consult-agent', async (event, agentType, query) => {
    try {
      // Rate limit check
      if (isRateLimited('consult-agent')) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      // Input validation
      validators.validateAgentType(agentType);

      if (!query || typeof query !== 'string') {
        throw new Error('Invalid query: must be a non-empty string');
      }

      if (query.length > 10000) {
        throw new Error('Query too long: maximum 10,000 characters allowed');
      }

      const response = await fileManager.consultAgent(agentType, query);
      return { success: true, response };
    } catch (error) {
      console.error('Error consulting agent:', error);
      return { success: false, error: sanitizeErrorMessage(error) };
    }
  });
}

module.exports = { setupIpcHandlers };
