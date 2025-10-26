const { app } = require('electron');
const FileManager = require('./fileManager');

const fileManager = new FileManager();

function setupIpcHandlers(ipcMain, _mainWindow) {
  // Save generated agent
  ipcMain.handle('save-agent', async (event, agentData) => {
    try {
      const result = await fileManager.saveAgent(agentData);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error saving agent:', error);
      return { success: false, error: error.message };
    }
  });

  // Load generated agents list
  ipcMain.handle('load-agents', async () => {
    try {
      const agents = await fileManager.loadGeneratedAgents();
      return { success: true, agents };
    } catch (error) {
      console.error('Error loading agents:', error);
      return { success: false, error: error.message };
    }
  });

  // Get existing agents from .claude/agents for consultation
  ipcMain.handle('get-existing-agents', async () => {
    try {
      const agents = await fileManager.loadExistingAgents();
      return { success: true, agents };
    } catch (error) {
      console.error('Error loading existing agents:', error);
      return { success: false, error: error.message };
    }
  });

  // Process PDF file
  ipcMain.handle('process-pdf', async (event, filePath) => {
    try {
      const pdfParse = require('pdf-parse');
      const fs = require('fs').promises;

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
      return { success: false, error: error.message };
    }
  });

  // Load settings
  ipcMain.handle('load-settings', async () => {
    try {
      const settings = await fileManager.loadSettings();
      return { success: true, settings };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { success: false, settings: {} };
    }
  });

  // Save settings
  ipcMain.handle('save-settings', async (event, settings) => {
    try {
      await fileManager.saveSettings(settings);
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  });

  // Load template
  ipcMain.handle('load-template', async () => {
    try {
      const template = await fileManager.loadTemplate();
      return { success: true, template };
    } catch (error) {
      console.error('Error loading template:', error);
      return { success: false, error: error.message };
    }
  });

  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Consult with existing agent
  ipcMain.handle('consult-agent', async (event, agentType, query) => {
    try {
      const response = await fileManager.consultAgent(agentType, query);
      return { success: true, response };
    } catch (error) {
      console.error('Error consulting agent:', error);
      return { success: false, error: error.message };
    }
  });
}

module.exports = { setupIpcHandlers };
