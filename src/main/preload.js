const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveAgent: (agentData) => ipcRenderer.invoke('save-agent', agentData),
  loadAgents: () => ipcRenderer.invoke('load-agents'),
  getExistingAgents: () => ipcRenderer.invoke('get-existing-agents'),

  // PDF processing
  processPDF: (filePath) => ipcRenderer.invoke('process-pdf', filePath),

  // Settings
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // Agent consultation
  consultAgent: (agentType, query) => ipcRenderer.invoke('consult-agent', agentType, query),

  // Template operations
  loadTemplate: () => ipcRenderer.invoke('load-template'),

  // System info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
