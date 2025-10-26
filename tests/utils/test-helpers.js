/**
 * Test Utilities and Helpers
 *
 * Common utilities for testing across the application
 */

import { vi } from 'vitest';

/**
 * Create a mock file object for testing
 */
export function createMockFile(name = 'test.pdf', size = 1024) {
  return {
    name,
    size,
    type: 'application/pdf',
    path: `/path/to/${name}`,
    lastModified: Date.now(),
  };
}

/**
 * Create mock PDF processing result
 */
export function createMockPDFResult(overrides = {}) {
  return {
    success: true,
    text: 'Sample PDF text content with API and database keywords',
    pages: 5,
    info: {
      Title: 'Test Document',
      Author: 'Test Author',
    },
    ...overrides,
  };
}

/**
 * Create mock template data
 */
export function createMockTemplateData(overrides = {}) {
  return {
    coreFunctions: ['Function 1', 'Function 2', ...Array(10).fill('')],
    domainExpertise: ['Expertise 1', ...Array(11).fill('')],
    inputTypes: ['Input 1', ...Array(11).fill('')],
    validationRules: ['Rule 1', ...Array(11).fill('')],
    outputFormat: ['Output 1', ...Array(11).fill('')],
    performanceConstraints: ['Constraint 1', ...Array(11).fill('')],
    styleGuide: ['Style 1', ...Array(11).fill('')],
    integrationTargets: ['Target 1', ...Array(11).fill('')],
    ...overrides,
  };
}

/**
 * Create mock document
 */
export function createMockDocument(overrides = {}) {
  return {
    name: 'test.pdf',
    path: '/path/to/test.pdf',
    text: 'Sample document text',
    pages: 5,
    ...overrides,
  };
}

/**
 * Create mock agent metadata
 */
export function createMockAgentMetadata(overrides = {}) {
  return {
    name: 'TestAgent',
    type: 'backend-developer',
    timestamp: new Date().toISOString(),
    complexity: 'moderate',
    consultedAgents: ['code-reviewer'],
    ...overrides,
  };
}

/**
 * Wait for async updates
 */
export async function waitForAsync(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock successful Electron API
 */
export function mockElectronAPISuccess() {
  return {
    saveAgent: vi.fn().mockResolvedValue({
      success: true,
      path: '/output/agent.md',
    }),
    loadAgents: vi.fn().mockResolvedValue({
      success: true,
      agents: [],
    }),
    getExistingAgents: vi.fn().mockResolvedValue({
      success: true,
      agents: ['code-reviewer', 'backend-developer'],
    }),
    processPDF: vi.fn().mockResolvedValue(createMockPDFResult()),
    loadSettings: vi.fn().mockResolvedValue({
      success: true,
      settings: { theme: 'dark' },
    }),
    saveSettings: vi.fn().mockResolvedValue({
      success: true,
    }),
    consultAgent: vi.fn().mockResolvedValue({
      success: true,
      response: {
        agentType: 'code-reviewer',
        available: true,
        guidance: 'Best practices guidance',
      },
    }),
    loadTemplate: vi.fn().mockResolvedValue({
      success: true,
      template: 'Mock template content',
    }),
    getAppVersion: vi.fn().mockReturnValue('1.0.0'),
  };
}

/**
 * Mock failed Electron API
 */
export function mockElectronAPIFailure(errorMessage = 'Operation failed') {
  return {
    saveAgent: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    loadAgents: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    getExistingAgents: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    processPDF: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    loadSettings: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    saveSettings: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    consultAgent: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    loadTemplate: vi.fn().mockResolvedValue({
      success: false,
      error: errorMessage,
    }),
    getAppVersion: vi.fn().mockReturnValue('1.0.0'),
  };
}

/**
 * Setup Electron API mocks for tests
 */
export function setupElectronMocks(success = true) {
  const mocks = success ? mockElectronAPISuccess() : mockElectronAPIFailure();

  global.window = global.window || {};
  global.window.electronAPI = mocks;

  return mocks;
}

/**
 * Reset all Electron API mocks
 */
export function resetElectronMocks() {
  if (global.window?.electronAPI) {
    Object.values(global.window.electronAPI).forEach(mock => {
      if (mock.mockReset) {
        mock.mockReset();
      }
    });
  }
}

/**
 * Create a spy on console methods
 */
export function spyOnConsole() {
  const originalConsole = { ...console };

  const spies = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  };

  return {
    spies,
    restore: () => {
      Object.entries(originalConsole).forEach(([key, value]) => {
        console[key] = value;
      });
    },
  };
}

/**
 * Assert async error is thrown
 */
export async function expectAsyncError(fn, errorMessage) {
  let error;

  try {
    await fn();
  } catch (e) {
    error = e;
  }

  if (!error) {
    throw new Error('Expected function to throw an error');
  }

  if (errorMessage && !error.message.includes(errorMessage)) {
    throw new Error(
      `Expected error message to include "${errorMessage}", got "${error.message}"`
    );
  }

  return error;
}

/**
 * Create a mock React component
 */
export function createMockComponent(name) {
  const Component = ({ children, ...props }) => {
    return children || null;
  };
  Component.displayName = name;
  return Component;
}

/**
 * Generate test data for multiple documents
 */
export function generateMultipleDocuments(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `document-${i + 1}.pdf`,
    path: `/path/to/document-${i + 1}.pdf`,
    text: `Document ${i + 1} content with API and database references`,
    pages: Math.floor(Math.random() * 20) + 1,
  }));
}

/**
 * Validate agent specification structure
 */
export function validateAgentSpecification(spec) {
  const requiredSections = [
    '# Subagent:',
    '## Overview',
    '## Core Specifications',
    '## Technical Requirements',
    '## Quality Criteria',
  ];

  const missing = requiredSections.filter(section => !spec.includes(section));

  if (missing.length > 0) {
    throw new Error(`Missing required sections: ${missing.join(', ')}`);
  }

  return true;
}

/**
 * Extract sections from agent specification
 */
export function extractSpecSections(spec) {
  const sections = {};
  const lines = spec.split('\n');

  let currentSection = null;
  let currentContent = [];

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = line.substring(3).trim();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  });

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }

  return sections;
}

/**
 * Create a mock template processor
 */
export function createMockTemplateProcessor() {
  return {
    fillTemplate: vi.fn().mockReturnValue('Filled template'),
    extractRequirements: vi.fn().mockReturnValue({
      functions: [],
      inputs: [],
      outputs: [],
      constraints: [],
    }),
    validateTemplateData: vi.fn().mockReturnValue({
      isValid: true,
      errors: [],
      warnings: [],
      completeness: 85,
    }),
    generateStatistics: vi.fn().mockReturnValue({
      totalFields: 10,
      totalCategories: 8,
      documentCount: 0,
      totalDocumentPages: 0,
      estimatedComplexity: 'low',
    }),
  };
}

/**
 * Create a mock PDF analyzer
 */
export function createMockPDFAnalyzer() {
  return {
    analyzeDocuments: vi.fn().mockReturnValue({
      totalPages: 10,
      totalCharacters: 5000,
      keyTerms: [
        { term: 'API', count: 5 },
        { term: 'database', count: 3 },
      ],
      suggestedFeatures: [],
      technicalRequirements: [],
    }),
    generateSuggestions: vi.fn().mockReturnValue({
      agentTypes: ['API Integration Specialist'],
      features: [],
      integrations: [],
    }),
  };
}

/**
 * Measure async function execution time
 */
export async function measureExecutionTime(fn) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  return {
    result,
    duration: end - start,
  };
}

/**
 * Retry async function with exponential backoff
 */
export async function retryAsync(fn, maxRetries = 3, delay = 100) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await waitForAsync(delay * Math.pow(2, i));
      }
    }
  }

  throw lastError;
}

/**
 * Create a test timeout wrapper
 */
export function withTimeout(fn, timeout = 5000) {
  return Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Test timeout')), timeout)
    ),
  ]);
}
