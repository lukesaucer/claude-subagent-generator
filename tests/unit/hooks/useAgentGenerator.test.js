import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAgentGenerator } from '@renderer/hooks/useAgentGenerator';

describe('useAgentGenerator', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    global.window.electronAPI.processPDF = vi.fn().mockResolvedValue({
      success: true,
      text: 'Sample PDF text',
      pages: 5,
    });

    global.window.electronAPI.saveAgent = vi.fn().mockResolvedValue({
      success: true,
      path: '/path/to/agent.md',
    });
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAgentGenerator());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.generatedAgent).toBeNull();
      expect(result.current.documents).toEqual([]);
    });

    it('should initialize templateData with empty arrays', () => {
      const { result } = renderHook(() => useAgentGenerator());

      expect(result.current.templateData.coreFunctions).toHaveLength(12);
      expect(result.current.templateData.domainExpertise).toHaveLength(12);
      expect(result.current.templateData.inputTypes).toHaveLength(12);
      expect(result.current.templateData.coreFunctions.every(f => f === '')).toBe(true);
    });
  });

  describe('updateTemplateField', () => {
    it('should update a specific field', () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'New Function');
      });

      expect(result.current.templateData.coreFunctions[0]).toBe('New Function');
    });

    it('should not affect other fields', () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Function 1');
        result.current.updateTemplateField('coreFunctions', 1, 'Function 2');
      });

      expect(result.current.templateData.coreFunctions[0]).toBe('Function 1');
      expect(result.current.templateData.coreFunctions[1]).toBe('Function 2');
      expect(result.current.templateData.coreFunctions[2]).toBe('');
    });

    it('should update different categories independently', () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Core 1');
        result.current.updateTemplateField('domainExpertise', 0, 'Domain 1');
      });

      expect(result.current.templateData.coreFunctions[0]).toBe('Core 1');
      expect(result.current.templateData.domainExpertise[0]).toBe('Domain 1');
    });
  });

  describe('addDocument', () => {
    it('should add a document successfully', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      const file = {
        name: 'test.pdf',
        path: '/path/to/test.pdf',
      };

      await act(async () => {
        await result.current.addDocument(file);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].name).toBe('test.pdf');
      expect(result.current.documents[0].text).toBe('Sample PDF text');
      expect(result.current.documents[0].pages).toBe(5);
    });

    it('should set loading state during processing', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      let loadingDuringCall = false;

      global.window.electronAPI.processPDF = vi.fn().mockImplementation(() => {
        loadingDuringCall = result.current.loading;
        return Promise.resolve({
          success: true,
          text: 'Sample text',
          pages: 5,
        });
      });

      const file = { name: 'test.pdf', path: '/path/to/test.pdf' };

      await act(async () => {
        await result.current.addDocument(file);
      });

      expect(loadingDuringCall).toBe(true);
      expect(result.current.loading).toBe(false);
    });

    it('should handle document limit', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Add 12 documents
      for (let i = 0; i < 12; i++) {
        await act(async () => {
          await result.current.addDocument({
            name: `doc${i}.pdf`,
            path: `/path/doc${i}.pdf`,
          });
        });
      }

      // Try to add 13th document
      await act(async () => {
        await result.current.addDocument({
          name: 'doc13.pdf',
          path: '/path/doc13.pdf',
        });
      });

      expect(result.current.documents).toHaveLength(12);
      expect(result.current.error).toBe('Maximum 12 documents allowed');
    });

    it('should handle PDF processing errors', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      global.window.electronAPI.processPDF = vi.fn().mockResolvedValue({
        success: false,
        error: 'Failed to parse PDF',
      });

      const file = { name: 'test.pdf', path: '/path/to/test.pdf' };

      await act(async () => {
        await result.current.addDocument(file);
      });

      expect(result.current.documents).toHaveLength(0);
      expect(result.current.error).toBe('Failed to parse PDF');
    });

    it('should handle exceptions', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      global.window.electronAPI.processPDF = vi.fn().mockRejectedValue(
        new Error('Network error')
      );

      const file = { name: 'test.pdf', path: '/path/to/test.pdf' };

      await act(async () => {
        await result.current.addDocument(file);
      });

      expect(result.current.documents).toHaveLength(0);
      expect(result.current.error).toBe('Network error');
    });
  });

  describe('removeDocument', () => {
    it('should remove a document by index', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Add two documents
      await act(async () => {
        await result.current.addDocument({ name: 'doc1.pdf', path: '/path1' });
        await result.current.addDocument({ name: 'doc2.pdf', path: '/path2' });
      });

      // Remove first document
      act(() => {
        result.current.removeDocument(0);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].name).toBe('doc2.pdf');
    });

    it('should handle invalid index gracefully', () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.removeDocument(99);
      });

      expect(result.current.documents).toEqual([]);
    });
  });

  describe('generateAgent', () => {
    it('should generate agent with correct data', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Function 1');
      });

      let generatedData;
      await act(async () => {
        generatedData = await result.current.generateAgent(
          'TestAgent',
          'backend-developer'
        );
      });

      expect(generatedData.name).toBe('TestAgent');
      expect(generatedData.type).toBe('backend-developer');
      expect(generatedData.timestamp).toBeDefined();
    });

    it('should set generated agent in state', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      await act(async () => {
        await result.current.generateAgent('TestAgent', 'backend-developer');
      });

      expect(result.current.generatedAgent).toBeDefined();
      expect(result.current.generatedAgent.name).toBe('TestAgent');
    });

    it('should include template data and documents', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Function 1');
      });

      await act(async () => {
        await result.current.addDocument({
          name: 'test.pdf',
          path: '/path/test.pdf',
        });
      });

      let generatedData;
      await act(async () => {
        generatedData = await result.current.generateAgent(
          'TestAgent',
          'backend-developer'
        );
      });

      expect(generatedData.templateData.coreFunctions[0]).toBe('Function 1');
      expect(generatedData.documents).toHaveLength(1);
    });

    it('should handle errors during generation', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Force an error by making generateAgent fail
      const originalConsoleError = console.error;
      console.error = vi.fn();

      await act(async () => {
        try {
          await result.current.generateAgent(null, null);
        } catch (e) {
          // Expected to potentially throw
        }
      });

      console.error = originalConsoleError;

      // Should handle gracefully
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('saveAgent', () => {
    it('should save agent successfully', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      const metadata = {
        name: 'TestAgent',
        type: 'backend-developer',
      };

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveAgent('Agent content', metadata);
      });

      expect(saveResult.success).toBe(true);
      expect(global.window.electronAPI.saveAgent).toHaveBeenCalledWith({
        name: 'TestAgent',
        content: 'Agent content',
        metadata,
      });
    });

    it('should handle save errors', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      global.window.electronAPI.saveAgent = vi.fn().mockResolvedValue({
        success: false,
        error: 'Save failed',
      });

      const metadata = { name: 'TestAgent', type: 'backend-developer' };

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveAgent('Content', metadata);
      });

      expect(saveResult).toBeNull();
      expect(result.current.error).toBe('Save failed');
    });

    it('should handle exceptions during save', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      global.window.electronAPI.saveAgent = vi.fn().mockRejectedValue(
        new Error('File system error')
      );

      const metadata = { name: 'TestAgent', type: 'backend-developer' };

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveAgent('Content', metadata);
      });

      expect(saveResult).toBeNull();
      expect(result.current.error).toBe('File system error');
    });
  });

  describe('resetForm', () => {
    it('should reset all form data', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Add some data
      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Function 1');
      });

      await act(async () => {
        await result.current.addDocument({
          name: 'test.pdf',
          path: '/path/test.pdf',
        });
        await result.current.generateAgent('TestAgent', 'backend-developer');
      });

      // Reset
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.templateData.coreFunctions[0]).toBe('');
      expect(result.current.documents).toEqual([]);
      expect(result.current.generatedAgent).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
