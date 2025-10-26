import { describe, it, expect, beforeEach, vi } from 'vitest';
import HeadArchitectAgent from '@renderer/services/agentGenerator';

describe('HeadArchitectAgent', () => {
  let agent;
  let mockTemplateData;
  let mockDocuments;

  beforeEach(() => {
    agent = new HeadArchitectAgent();

    mockTemplateData = {
      coreFunctions: ['Function 1', 'Function 2', ''],
      domainExpertise: ['Expertise 1', '', ''],
      inputTypes: ['Input 1', 'Input 2', ''],
      validationRules: ['Rule 1', ''],
      outputFormat: ['Output 1', ''],
      performanceConstraints: ['Constraint 1', ''],
      styleGuide: ['Style 1', ''],
      integrationTargets: ['Target 1', ''],
    };

    mockDocuments = [
      {
        name: 'test.pdf',
        pages: 5,
        text: 'Sample document text with API and security keywords',
      },
    ];

    // Mock electron API
    global.window.electronAPI.loadTemplate = vi.fn().mockResolvedValue({
      success: true,
      template: 'Mock template content',
    });

    global.window.electronAPI.consultAgent = vi.fn().mockResolvedValue({
      success: true,
      response: {
        agentType: 'code-reviewer',
        available: true,
        guidance: 'Best practices',
      },
    });
  });

  describe('analyzeInputData', () => {
    it('should correctly count core functions', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);

      expect(analysis.coreFunctionCount).toBe(2);
      expect(analysis.domainExpertiseCount).toBe(1);
    });

    it('should detect documents', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);

      expect(analysis.hasDocuments).toBe(true);
      expect(analysis.documentCount).toBe(1);
      expect(analysis.totalDocumentPages).toBe(5);
    });

    it('should determine complexity correctly', () => {
      // Simple complexity
      const simpleData = {
        coreFunctions: ['Func 1', ''],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };
      const simpleAnalysis = agent.analyzeInputData(simpleData, []);
      expect(simpleAnalysis.complexity).toBe('simple');

      // Complex complexity (> 50 fields)
      const complexData = {
        coreFunctions: Array(20).fill('Function'),
        domainExpertise: Array(20).fill('Expertise'),
        inputTypes: Array(20).fill('Input'),
        validationRules: Array(20).fill('Rule'),
        outputFormat: Array(20).fill('Output'),
        performanceConstraints: Array(20).fill('Constraint'),
        styleGuide: Array(20).fill('Style'),
        integrationTargets: Array(20).fill('Target'),
      };
      const complexAnalysis = agent.analyzeInputData(complexData, []);
      expect(complexAnalysis.complexity).toBe('complex');
    });

    it('should suggest consultants based on content', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);

      expect(analysis.suggestedConsultants).toBeInstanceOf(Array);
      expect(analysis.suggestedConsultants.length).toBeLessThanOrEqual(3);
    });
  });

  describe('suggestConsultants', () => {
    it('should suggest backend-developer for API keywords', () => {
      const data = {
        coreFunctions: ['Build REST API', 'Handle database queries'],
        domainExpertise: ['Backend development'],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const consultants = agent.suggestConsultants(data);

      expect(consultants).toContain('backend-developer');
    });

    it('should suggest frontend-developer for UI keywords', () => {
      const data = {
        coreFunctions: ['Build React components', 'Design user interface'],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const consultants = agent.suggestConsultants(data);

      expect(consultants).toContain('frontend-developer');
    });

    it('should suggest security-engineer for security keywords', () => {
      const data = {
        coreFunctions: ['Implement authentication', 'Handle encryption'],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const consultants = agent.suggestConsultants(data);

      expect(consultants).toContain('security-engineer');
    });

    it('should limit consultants to 3', () => {
      const data = {
        coreFunctions: [
          'API backend database security test performance code review',
        ],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const consultants = agent.suggestConsultants(data);

      expect(consultants.length).toBeLessThanOrEqual(3);
    });
  });

  describe('generateSubagent', () => {
    it('should successfully generate a subagent specification', async () => {
      const result = await agent.generateSubagent(
        mockTemplateData,
        mockDocuments,
        'TestAgent',
        'backend-developer'
      );

      expect(result.success).toBe(true);
      expect(result.specification).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.name).toBe('TestAgent');
      expect(result.metadata.type).toBe('backend-developer');
    });

    it('should include metadata in generation', async () => {
      const result = await agent.generateSubagent(
        mockTemplateData,
        mockDocuments,
        'TestAgent',
        'backend-developer'
      );

      expect(result.metadata.timestamp).toBeDefined();
      expect(result.metadata.consultedAgents).toBeInstanceOf(Array);
    });

    it('should handle errors gracefully', async () => {
      global.window.electronAPI.loadTemplate = vi.fn().mockRejectedValue(
        new Error('Template load failed')
      );

      const result = await agent.generateSubagent(
        mockTemplateData,
        mockDocuments,
        'TestAgent',
        'backend-developer'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('createSpecification', () => {
    it('should create a properly formatted specification', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);
      const consultations = [
        { agentType: 'code-reviewer', available: true },
      ];

      const spec = agent.createSpecification(
        'TestAgent',
        'backend-developer',
        mockTemplateData,
        mockDocuments,
        analysis,
        consultations,
        'Template content'
      );

      // Check for key sections
      expect(spec).toContain('# Subagent: TestAgent');
      expect(spec).toContain('## Overview');
      expect(spec).toContain('## Core Specifications');
      expect(spec).toContain('## Technical Requirements');
      expect(spec).toContain('## Quality Criteria');
    });

    it('should include all non-empty template fields', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);
      const spec = agent.createSpecification(
        'TestAgent',
        'backend-developer',
        mockTemplateData,
        mockDocuments,
        analysis,
        [],
        ''
      );

      expect(spec).toContain('Function 1');
      expect(spec).toContain('Function 2');
      expect(spec).toContain('Expertise 1');
      expect(spec).toContain('Input 1');
    });

    it('should document uploaded documents', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);
      const spec = agent.createSpecification(
        'TestAgent',
        'backend-developer',
        mockTemplateData,
        mockDocuments,
        analysis,
        [],
        ''
      );

      expect(spec).toContain('## Contextual Documentation');
      expect(spec).toContain('test.pdf');
      expect(spec).toContain('5 pages');
    });

    it('should list consulted agents', () => {
      const analysis = agent.analyzeInputData(mockTemplateData, mockDocuments);
      const consultations = [
        { agentType: 'code-reviewer', available: true },
        { agentType: 'security-engineer', available: true },
      ];

      const spec = agent.createSpecification(
        'TestAgent',
        'backend-developer',
        mockTemplateData,
        mockDocuments,
        analysis,
        consultations,
        ''
      );

      expect(spec).toContain('## Expert Consultations');
      expect(spec).toContain('code-reviewer');
      expect(spec).toContain('security-engineer');
    });
  });

  describe('consultExistingAgents', () => {
    it('should always consult code-reviewer', async () => {
      const analysis = { suggestedConsultants: [] };

      await agent.consultExistingAgents('backend-developer', analysis);

      expect(global.window.electronAPI.consultAgent).toHaveBeenCalledWith(
        'code-reviewer',
        expect.stringContaining('backend-developer')
      );
    });

    it('should consult suggested agents', async () => {
      const analysis = {
        suggestedConsultants: ['security-engineer', 'database-optimizer'],
      };

      await agent.consultExistingAgents('backend-developer', analysis);

      expect(global.window.electronAPI.consultAgent).toHaveBeenCalledWith(
        'security-engineer',
        expect.any(String)
      );
      expect(global.window.electronAPI.consultAgent).toHaveBeenCalledWith(
        'database-optimizer',
        expect.any(String)
      );
    });

    it('should handle consultation failures gracefully', async () => {
      global.window.electronAPI.consultAgent = vi.fn().mockRejectedValue(
        new Error('Consultation failed')
      );

      const analysis = { suggestedConsultants: [] };
      const consultations = await agent.consultExistingAgents(
        'backend-developer',
        analysis
      );

      // Should not throw, just return empty or null results
      expect(consultations).toBeInstanceOf(Array);
    });
  });
});
