import { describe, it, expect, beforeEach } from 'vitest';
import PDFAnalyzer from '@renderer/services/pdfParser';

describe('PDFAnalyzer', () => {
  let analyzer;
  let mockDocuments;

  beforeEach(() => {
    analyzer = new PDFAnalyzer();

    mockDocuments = [
      {
        name: 'doc1.pdf',
        pages: 5,
        text: `
          This document describes the API requirements.
          The system must authenticate users.
          Performance is critical for database queries.
          Security validation is required.
          The interface should integrate with external services.
        `,
      },
      {
        name: 'doc2.pdf',
        pages: 3,
        text: `
          Additional API documentation.
          Database schema design.
          Authentication flows.
        `,
      },
    ];
  });

  describe('analyzeDocuments', () => {
    it('should calculate total pages correctly', () => {
      const analysis = analyzer.analyzeDocuments(mockDocuments);

      expect(analysis.totalPages).toBe(8);
    });

    it('should calculate total characters', () => {
      const analysis = analyzer.analyzeDocuments(mockDocuments);

      expect(analysis.totalCharacters).toBeGreaterThan(0);
    });

    it('should extract key terms', () => {
      const analysis = analyzer.analyzeDocuments(mockDocuments);

      expect(analysis.keyTerms).toBeInstanceOf(Array);
      expect(analysis.keyTerms.length).toBeGreaterThan(0);
    });

    it('should deduplicate and rank terms', () => {
      const analysis = analyzer.analyzeDocuments(mockDocuments);

      // API appears in both documents, should be ranked higher
      const apiTerm = analysis.keyTerms.find(t => t.term.toLowerCase() === 'api');
      expect(apiTerm).toBeDefined();
      expect(apiTerm.count).toBeGreaterThan(1);
    });

    it('should limit key terms to 10', () => {
      const manyDocs = Array(20).fill({
        name: 'doc.pdf',
        pages: 1,
        text: 'API database security authentication validation performance interface integration',
      });

      const analysis = analyzer.analyzeDocuments(manyDocs);

      expect(analysis.keyTerms.length).toBeLessThanOrEqual(10);
    });

    it('should handle empty documents', () => {
      const analysis = analyzer.analyzeDocuments([]);

      expect(analysis.totalPages).toBe(0);
      expect(analysis.totalCharacters).toBe(0);
      expect(analysis.keyTerms).toEqual([]);
    });
  });

  describe('analyzeDocument', () => {
    it('should extract technical terms', () => {
      const doc = mockDocuments[0];
      const analysis = analyzer.analyzeDocument(doc);

      expect(analysis.keyTerms).toBeInstanceOf(Array);
      expect(analysis.keyTerms.length).toBeGreaterThan(0);
    });

    it('should identify API references', () => {
      const doc = {
        text: 'The API should handle REST requests. API authentication is required.',
      };

      const analysis = analyzer.analyzeDocument(doc);

      const apiTerms = analysis.keyTerms.filter(
        t => t.term.toLowerCase() === 'api'
      );
      expect(apiTerms.length).toBeGreaterThan(0);
      expect(apiTerms[0].count).toBe(2);
    });

    it('should identify database references', () => {
      const doc = {
        text: 'Database queries must be optimized. The database should scale.',
      };

      const analysis = analyzer.analyzeDocument(doc);

      const dbTerms = analysis.keyTerms.filter(
        t => t.term.toLowerCase() === 'database'
      );
      expect(dbTerms.length).toBeGreaterThan(0);
    });

    it('should extract requirement statements', () => {
      const doc = {
        text: 'The system must validate input. Users should authenticate. Required to support OAuth.',
      };

      const analysis = analyzer.analyzeDocument(doc);

      expect(analysis.requirements).toBeInstanceOf(Array);
      expect(analysis.requirements.length).toBeGreaterThan(0);
    });

    it('should prioritize "must" requirements as high', () => {
      const doc = {
        text: 'The system must validate input. Users should authenticate.',
      };

      const analysis = analyzer.analyzeDocument(doc);

      const mustRequirement = analysis.requirements.find(
        r => r.text.toLowerCase().includes('must')
      );
      expect(mustRequirement.priority).toBe('high');
    });

    it('should prioritize "should" requirements as medium', () => {
      const doc = {
        text: 'Users should authenticate.',
      };

      const analysis = analyzer.analyzeDocument(doc);

      const shouldRequirement = analysis.requirements.find(
        r => r.text.toLowerCase().includes('should')
      );
      expect(shouldRequirement.priority).toBe('medium');
    });

    it('should handle documents without text', () => {
      const doc = { name: 'empty.pdf', pages: 0 };

      const analysis = analyzer.analyzeDocument(doc);

      expect(analysis.keyTerms).toEqual([]);
      expect(analysis.requirements).toEqual([]);
    });
  });

  describe('deduplicateAndRank', () => {
    it('should deduplicate string items', () => {
      const items = ['API', 'database', 'API', 'security', 'API'];

      const result = analyzer.deduplicateAndRank(items);

      expect(result.length).toBe(3);
      const apiItem = result.find(r => r.term === 'API');
      expect(apiItem.count).toBe(3);
    });

    it('should deduplicate object items by term', () => {
      const items = [
        { term: 'API', count: 1 },
        { term: 'database', count: 1 },
        { term: 'API', count: 1 },
      ];

      const result = analyzer.deduplicateAndRank(items);

      expect(result.length).toBe(2);
    });

    it('should sort by frequency descending', () => {
      const items = ['API', 'API', 'API', 'database', 'security', 'security'];

      const result = analyzer.deduplicateAndRank(items);

      expect(result[0].term).toBe('API');
      expect(result[0].count).toBe(3);
      expect(result[1].count).toBeLessThanOrEqual(result[0].count);
    });

    it('should limit results to 10', () => {
      const items = Array(100).fill('term').map((t, i) => `${t}${i % 15}`);

      const result = analyzer.deduplicateAndRank(items);

      expect(result.length).toBe(10);
    });

    it('should handle empty arrays', () => {
      const result = analyzer.deduplicateAndRank([]);

      expect(result).toEqual([]);
    });
  });

  describe('generateSuggestions', () => {
    it('should suggest agent types based on key terms', () => {
      const analysis = {
        keyTerms: [
          { term: 'API', count: 5 },
          { term: 'database', count: 3 },
        ],
        suggestedFeatures: [],
        technicalRequirements: [],
      };

      const suggestions = analyzer.generateSuggestions(analysis);

      expect(suggestions.agentTypes).toContain('API Integration Specialist');
      expect(suggestions.agentTypes).toContain('Database Handler');
    });

    it('should suggest security agent for security keywords', () => {
      const analysis = {
        keyTerms: [
          { term: 'authentication', count: 3 },
        ],
        suggestedFeatures: [],
        technicalRequirements: [],
      };

      const suggestions = analyzer.generateSuggestions(analysis);

      expect(suggestions.agentTypes).toContain('Security Agent');
    });

    it('should suggest performance optimizer for performance keywords', () => {
      const analysis = {
        keyTerms: [
          { term: 'performance', count: 2 },
        ],
        suggestedFeatures: [],
        technicalRequirements: [],
      };

      const suggestions = analyzer.generateSuggestions(analysis);

      expect(suggestions.agentTypes).toContain('Performance Optimizer');
    });

    it('should not duplicate agent type suggestions', () => {
      const analysis = {
        keyTerms: [
          { term: 'API', count: 5 },
          { term: 'API', count: 3 },
        ],
        suggestedFeatures: [],
        technicalRequirements: [],
      };

      const suggestions = analyzer.generateSuggestions(analysis);

      const apiSuggestions = suggestions.agentTypes.filter(
        a => a === 'API Integration Specialist'
      );
      expect(apiSuggestions.length).toBe(1);
    });

    it('should handle analysis with no matching terms', () => {
      const analysis = {
        keyTerms: [
          { term: 'unknown', count: 1 },
          { term: 'other', count: 1 },
        ],
        suggestedFeatures: [],
        technicalRequirements: [],
      };

      const suggestions = analyzer.generateSuggestions(analysis);

      expect(suggestions.agentTypes).toEqual([]);
    });
  });

  describe('maxDocuments limit', () => {
    it('should have a maximum document limit', () => {
      expect(analyzer.maxDocuments).toBe(12);
    });
  });
});
