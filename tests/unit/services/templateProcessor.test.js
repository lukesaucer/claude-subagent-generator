import { describe, it, expect, beforeEach } from 'vitest';
import TemplateProcessor from '@renderer/services/templateProcessor';

describe('TemplateProcessor', () => {
  let processor;
  let mockTemplate;
  let mockTemplateData;
  let mockMetadata;

  beforeEach(() => {
    mockTemplate = `
      [SUBAGENT_TYPE] Agent
      Core: [CORE_FUNCTION]
      Domain: [DOMAIN]
      Input: [INPUT_TYPES]
      Validation: [VALIDATION]
      Output: [OUTPUT_FORMAT]
      Performance: [PERFORMANCE]
      Style: [STYLE_GUIDE]
      Integration: [INTEGRATION_TARGETS]
      Prefix: [PREFIX]
      Coverage: [TEST_COVERAGE]
    `;

    processor = new TemplateProcessor(mockTemplate);

    mockTemplateData = {
      coreFunctions: ['Function 1', 'Function 2', ''],
      domainExpertise: ['Expertise 1', 'Expertise 2', ''],
      inputTypes: ['Input 1', ''],
      validationRules: ['Rule 1', 'Rule 2', ''],
      outputFormat: ['Output 1', ''],
      performanceConstraints: ['Constraint 1', ''],
      styleGuide: ['Style 1', 'Style 2', ''],
      integrationTargets: ['Target 1', ''],
    };

    mockMetadata = {
      type: 'backend-developer',
      prefix: 'backend',
    };
  });

  describe('joinFields', () => {
    it('should join non-empty fields with semicolons', () => {
      const fields = ['Field 1', 'Field 2', 'Field 3'];
      const result = processor.joinFields(fields);

      expect(result).toBe('Field 1; Field 2; Field 3');
    });

    it('should filter out empty fields', () => {
      const fields = ['Field 1', '', 'Field 2', '   ', 'Field 3'];
      const result = processor.joinFields(fields);

      expect(result).toBe('Field 1; Field 2; Field 3');
    });

    it('should return "Not specified" for empty arrays', () => {
      const fields = [];
      const result = processor.joinFields(fields);

      expect(result).toBe('Not specified');
    });

    it('should return "Not specified" for arrays with only empty strings', () => {
      const fields = ['', '   ', ''];
      const result = processor.joinFields(fields);

      expect(result).toBe('Not specified');
    });
  });

  describe('fillTemplate', () => {
    it('should replace all placeholders with data', () => {
      const result = processor.fillTemplate(mockTemplateData, mockMetadata);

      expect(result).toContain('backend-developer Agent');
      expect(result).toContain('Function 1; Function 2');
      expect(result).toContain('Expertise 1; Expertise 2');
      expect(result).toContain('Input 1');
      expect(result).toContain('Rule 1; Rule 2');
    });

    it('should use metadata prefix', () => {
      const result = processor.fillTemplate(mockTemplateData, mockMetadata);

      expect(result).toContain('Prefix: backend');
    });

    it('should generate prefix from type if not provided', () => {
      const metadataWithoutPrefix = { type: 'backend-developer' };
      const result = processor.fillTemplate(mockTemplateData, metadataWithoutPrefix);

      expect(result).toContain('Prefix: backend_developer');
    });

    it('should handle empty fields gracefully', () => {
      const emptyData = {
        coreFunctions: [''],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const result = processor.fillTemplate(emptyData, mockMetadata);

      expect(result).toContain('Not specified');
    });
  });

  describe('extractRequirements', () => {
    it('should categorize fields correctly', () => {
      const requirements = processor.extractRequirements(mockTemplateData);

      expect(requirements.functions).toContain('Function 1');
      expect(requirements.functions).toContain('Expertise 1');
      expect(requirements.inputs).toContain('Input 1');
      expect(requirements.inputs).toContain('Rule 1');
      expect(requirements.outputs).toContain('Output 1');
      expect(requirements.constraints).toContain('Constraint 1');
    });

    it('should filter out empty fields', () => {
      const requirements = processor.extractRequirements(mockTemplateData);

      expect(requirements.functions).not.toContain('');
      expect(requirements.inputs).not.toContain('');
      expect(requirements.outputs).not.toContain('');
    });

    it('should return empty arrays for completely empty data', () => {
      const emptyData = {
        coreFunctions: [''],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const requirements = processor.extractRequirements(emptyData);

      expect(requirements.functions).toEqual([]);
      expect(requirements.inputs).toEqual([]);
      expect(requirements.outputs).toEqual([]);
      expect(requirements.constraints).toEqual([]);
    });
  });

  describe('validateTemplateData', () => {
    it('should validate complete data as valid', () => {
      const validation = processor.validateTemplateData(mockTemplateData);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
      expect(validation.completeness).toBeGreaterThan(0);
    });

    it('should require at least one core function', () => {
      const invalidData = {
        coreFunctions: ['', '', ''],
        domainExpertise: ['Expertise 1'],
        inputTypes: ['Input 1'],
        validationRules: ['Rule 1'],
        outputFormat: ['Output 1'],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const validation = processor.validateTemplateData(invalidData);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'At least one core function must be specified'
      );
    });

    it('should calculate completeness percentage', () => {
      const validation = processor.validateTemplateData(mockTemplateData);

      expect(validation.completeness).toBeGreaterThan(0);
      expect(validation.completeness).toBeLessThanOrEqual(100);
    });

    it('should warn about empty categories', () => {
      const partialData = {
        coreFunctions: ['Function 1'],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const validation = processor.validateTemplateData(partialData);

      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('domainExpertise'))).toBe(true);
    });
  });

  describe('generateStatistics', () => {
    it('should count total filled fields', () => {
      const stats = processor.generateStatistics(mockTemplateData, []);

      expect(stats.totalFields).toBe(11); // Count of non-empty fields
      expect(stats.totalCategories).toBe(8);
    });

    it('should count documents', () => {
      const documents = [
        { pages: 5 },
        { pages: 10 },
        { pages: 3 },
      ];

      const stats = processor.generateStatistics(mockTemplateData, documents);

      expect(stats.documentCount).toBe(3);
      expect(stats.totalDocumentPages).toBe(18);
    });

    it('should estimate complexity', () => {
      const stats = processor.generateStatistics(mockTemplateData, []);

      expect(stats.estimatedComplexity).toBeOneOf(['low', 'medium', 'high']);
    });
  });

  describe('estimateComplexity', () => {
    it('should return "low" for simple templates', () => {
      const simpleData = {
        coreFunctions: ['Function 1'],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const complexity = processor.estimateComplexity(simpleData, []);

      expect(complexity).toBe('low');
    });

    it('should return "medium" for moderate templates', () => {
      const mediumData = {
        coreFunctions: Array(10).fill('Function'),
        domainExpertise: Array(10).fill('Expertise'),
        inputTypes: Array(5).fill('Input'),
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const complexity = processor.estimateComplexity(mediumData, []);

      expect(complexity).toBe('medium');
    });

    it('should return "high" for complex templates', () => {
      const complexData = {
        coreFunctions: Array(20).fill('Function'),
        domainExpertise: Array(20).fill('Expertise'),
        inputTypes: Array(20).fill('Input'),
        validationRules: Array(20).fill('Rule'),
        outputFormat: Array(20).fill('Output'),
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const complexity = processor.estimateComplexity(complexData, []);

      expect(complexity).toBe('high');
    });

    it('should consider document count in complexity', () => {
      const simpleData = {
        coreFunctions: ['Function 1'],
        domainExpertise: [''],
        inputTypes: [''],
        validationRules: [''],
        outputFormat: [''],
        performanceConstraints: [''],
        styleGuide: [''],
        integrationTargets: [''],
      };

      const manyDocuments = Array(6).fill({ pages: 10 });
      const complexity = processor.estimateComplexity(simpleData, manyDocuments);

      expect(complexity).toBe('high');
    });
  });
});
