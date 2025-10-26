import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAgentGenerator } from '@renderer/hooks/useAgentGenerator';
import HeadArchitectAgent from '@renderer/services/agentGenerator';
import TemplateProcessor from '@renderer/services/templateProcessor';
import PDFAnalyzer from '@renderer/services/pdfParser';

describe('Agent Generation Integration Flow', () => {
  let mockTemplate;
  let mockPDFData;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTemplate = `
# [SUBAGENT_TYPE] Agent
Core Functions: [CORE_FUNCTION]
Domain: [DOMAIN]
`;

    mockPDFData = {
      success: true,
      text: 'API requirements with database integration and security validation',
      pages: 10,
    };

    global.window.electronAPI.loadTemplate = vi.fn().mockResolvedValue({
      success: true,
      template: mockTemplate,
    });

    global.window.electronAPI.processPDF = vi.fn().mockResolvedValue(mockPDFData);

    global.window.electronAPI.consultAgent = vi.fn().mockResolvedValue({
      success: true,
      response: {
        agentType: 'code-reviewer',
        available: true,
        guidance: 'Follow best practices',
      },
    });

    global.window.electronAPI.saveAgent = vi.fn().mockResolvedValue({
      success: true,
      path: '/output/agent.md',
    });
  });

  describe('Complete agent generation workflow', () => {
    it('should complete full workflow from template to generation', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Step 1: Fill template fields
      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Handle API requests');
        result.current.updateTemplateField('coreFunctions', 1, 'Validate input data');
        result.current.updateTemplateField('domainExpertise', 0, 'RESTful APIs');
        result.current.updateTemplateField('inputTypes', 0, 'JSON payloads');
        result.current.updateTemplateField('outputFormat', 0, 'JSON responses');
      });

      // Step 2: Upload documents
      await act(async () => {
        await result.current.addDocument({
          name: 'requirements.pdf',
          path: '/path/requirements.pdf',
        });
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.error).toBeNull();

      // Step 3: Generate agent
      let generatedAgent;
      await act(async () => {
        generatedAgent = await result.current.generateAgent(
          'APIHandler',
          'backend-developer'
        );
      });

      expect(generatedAgent).toBeDefined();
      expect(generatedAgent.name).toBe('APIHandler');
      expect(generatedAgent.type).toBe('backend-developer');
      expect(generatedAgent.templateData.coreFunctions[0]).toBe('Handle API requests');
      expect(generatedAgent.documents).toHaveLength(1);

      // Step 4: Save agent
      const specification = 'Generated agent specification content';
      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveAgent(specification, {
          name: 'APIHandler',
          type: 'backend-developer',
        });
      });

      expect(saveResult.success).toBe(true);
      expect(global.window.electronAPI.saveAgent).toHaveBeenCalledWith({
        name: 'APIHandler',
        content: specification,
        metadata: {
          name: 'APIHandler',
          type: 'backend-developer',
        },
      });
    });

    it('should handle multiple documents in workflow', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Add multiple documents
      await act(async () => {
        await result.current.addDocument({
          name: 'requirements.pdf',
          path: '/path/requirements.pdf',
        });
        await result.current.addDocument({
          name: 'architecture.pdf',
          path: '/path/architecture.pdf',
        });
        await result.current.addDocument({
          name: 'api-spec.pdf',
          path: '/path/api-spec.pdf',
        });
      });

      expect(result.current.documents).toHaveLength(3);

      // Generate with all documents
      let generatedAgent;
      await act(async () => {
        generatedAgent = await result.current.generateAgent(
          'ComplexAgent',
          'backend-developer'
        );
      });

      expect(generatedAgent.documents).toHaveLength(3);
    });

    it('should validate template data before generation', async () => {
      const templateData = {
        coreFunctions: ['Function 1', 'Function 2'],
        domainExpertise: ['Domain 1'],
        inputTypes: ['Input 1'],
        validationRules: ['Rule 1'],
        outputFormat: ['Output 1'],
        performanceConstraints: [],
        styleGuide: [],
        integrationTargets: [],
      };

      const processor = new TemplateProcessor(mockTemplate);
      const validation = processor.validateTemplateData(templateData);

      expect(validation.isValid).toBe(true);
      expect(validation.completeness).toBeGreaterThan(0);
    });

    it('should analyze documents and suggest consultants', async () => {
      const documents = [
        {
          name: 'api-doc.pdf',
          pages: 5,
          text: 'REST API with database queries and authentication security',
        },
      ];

      const analyzer = new PDFAnalyzer();
      const analysis = analyzer.analyzeDocuments(documents);

      expect(analysis.keyTerms.length).toBeGreaterThan(0);

      const agent = new HeadArchitectAgent();
      const templateData = {
        coreFunctions: ['Build API', 'Handle database'],
        domainExpertise: [],
        inputTypes: [],
        validationRules: [],
        outputFormat: [],
        performanceConstraints: [],
        styleGuide: [],
        integrationTargets: [],
      };

      const consultants = agent.suggestConsultants(templateData);
      expect(consultants).toContain('backend-developer');
    });

    it('should reset workflow completely', async () => {
      const { result } = renderHook(() => useAgentGenerator());

      // Fill data
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

      // Verify data exists
      expect(result.current.templateData.coreFunctions[0]).toBe('Function 1');
      expect(result.current.documents).toHaveLength(1);
      expect(result.current.generatedAgent).toBeDefined();

      // Reset
      act(() => {
        result.current.resetForm();
      });

      // Verify complete reset
      expect(result.current.templateData.coreFunctions[0]).toBe('');
      expect(result.current.documents).toEqual([]);
      expect(result.current.generatedAgent).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error handling in workflow', () => {
    it('should handle PDF processing errors gracefully', async () => {
      global.window.electronAPI.processPDF = vi.fn().mockResolvedValue({
        success: false,
        error: 'Invalid PDF format',
      });

      const { result } = renderHook(() => useAgentGenerator());

      await act(async () => {
        await result.current.addDocument({
          name: 'invalid.pdf',
          path: '/path/invalid.pdf',
        });
      });

      expect(result.current.documents).toHaveLength(0);
      expect(result.current.error).toBe('Invalid PDF format');

      // Workflow should still be usable
      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Function 1');
      });

      expect(result.current.templateData.coreFunctions[0]).toBe('Function 1');
    });

    it('should handle template load errors', async () => {
      global.window.electronAPI.loadTemplate = vi.fn().mockResolvedValue({
        success: false,
        error: 'Template not found',
      });

      const agent = new HeadArchitectAgent();
      const result = await agent.generateSubagent(
        { coreFunctions: ['Function 1'] },
        [],
        'TestAgent',
        'backend-developer'
      );

      // Should still generate, just without template
      expect(result.success).toBe(true);
      expect(result.specification).toBeDefined();
    });

    it('should handle save errors without losing data', async () => {
      global.window.electronAPI.saveAgent = vi.fn().mockResolvedValue({
        success: false,
        error: 'Disk full',
      });

      const { result } = renderHook(() => useAgentGenerator());

      act(() => {
        result.current.updateTemplateField('coreFunctions', 0, 'Important Function');
      });

      await act(async () => {
        await result.current.generateAgent('TestAgent', 'backend-developer');
      });

      const saveResult = await act(async () => {
        return await result.current.saveAgent('Content', {
          name: 'TestAgent',
          type: 'backend-developer',
        });
      });

      expect(saveResult).toBeNull();
      expect(result.current.error).toBe('Disk full');

      // Data should still be intact
      expect(result.current.generatedAgent).toBeDefined();
      expect(result.current.templateData.coreFunctions[0]).toBe('Important Function');
    });
  });

  describe('Service integration', () => {
    it('should integrate TemplateProcessor with agent generation', () => {
      const templateData = {
        coreFunctions: ['Function 1', 'Function 2'],
        domainExpertise: ['Domain 1'],
        inputTypes: ['Input 1'],
        validationRules: [],
        outputFormat: [],
        performanceConstraints: [],
        styleGuide: [],
        integrationTargets: [],
      };

      const processor = new TemplateProcessor(mockTemplate);
      const filled = processor.fillTemplate(templateData, {
        type: 'backend-developer',
      });

      expect(filled).toContain('backend-developer Agent');
      expect(filled).toContain('Function 1; Function 2');
      expect(filled).toContain('Domain 1');

      const stats = processor.generateStatistics(templateData, []);
      expect(stats.totalFields).toBe(4);
      expect(stats.estimatedComplexity).toBe('low');
    });

    it('should integrate PDFAnalyzer with agent generation', () => {
      const documents = [
        {
          name: 'doc1.pdf',
          pages: 5,
          text: 'API backend with database and security authentication',
        },
        {
          name: 'doc2.pdf',
          pages: 3,
          text: 'Performance optimization and validation requirements',
        },
      ];

      const analyzer = new PDFAnalyzer();
      const analysis = analyzer.analyzeDocuments(documents);

      expect(analysis.totalPages).toBe(8);
      expect(analysis.keyTerms.length).toBeGreaterThan(0);

      const suggestions = analyzer.generateSuggestions(analysis);
      expect(suggestions.agentTypes.length).toBeGreaterThan(0);
    });

    it('should coordinate all services in agent generation', async () => {
      // Create instances
      const agent = new HeadArchitectAgent();
      const analyzer = new PDFAnalyzer();

      // Prepare data
      const templateData = {
        coreFunctions: ['Build REST API', 'Handle authentication'],
        domainExpertise: ['Backend development', 'Security'],
        inputTypes: ['JSON payloads'],
        validationRules: ['Validate JWT tokens'],
        outputFormat: ['JSON responses'],
        performanceConstraints: ['< 200ms response time'],
        styleGuide: ['Follow REST conventions'],
        integrationTargets: ['PostgreSQL database'],
      };

      const documents = [
        {
          name: 'requirements.pdf',
          pages: 10,
          text: 'System must support API authentication with database integration',
        },
      ];

      // Analyze documents
      const docAnalysis = analyzer.analyzeDocuments(documents);
      expect(docAnalysis.totalPages).toBe(10);

      // Analyze template data
      const inputAnalysis = agent.analyzeInputData(templateData, documents);
      expect(inputAnalysis.complexity).toBe('moderate');
      expect(inputAnalysis.hasDocuments).toBe(true);

      // Generate specification
      const result = await agent.generateSubagent(
        templateData,
        documents,
        'AuthAPI',
        'backend-developer'
      );

      expect(result.success).toBe(true);
      expect(result.specification).toContain('AuthAPI');
      expect(result.specification).toContain('Build REST API');
      expect(result.specification).toContain('requirements.pdf');
      expect(result.metadata.complexity).toBe('moderate');
    });
  });
});
