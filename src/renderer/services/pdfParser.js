/**
 * PDF Parser Service
 *
 * Analyzes PDF documents to extract context and requirements
 * for subagent generation
 */

class PDFAnalyzer {
  constructor() {
    this.maxDocuments = 12;
  }

  /**
   * Analyze a collection of documents
   */
  analyzeDocuments(documents) {
    const analysis = {
      totalPages: 0,
      totalCharacters: 0,
      keyTerms: [],
      suggestedFeatures: [],
      technicalRequirements: [],
    };

    documents.forEach((doc) => {
      analysis.totalPages += doc.pages || 0;
      analysis.totalCharacters += doc.text?.length || 0;

      // Extract key information
      const docAnalysis = this.analyzeDocument(doc);
      analysis.keyTerms.push(...docAnalysis.keyTerms);
      analysis.suggestedFeatures.push(...docAnalysis.features);
      analysis.technicalRequirements.push(...docAnalysis.requirements);
    });

    // Deduplicate and rank
    analysis.keyTerms = this.deduplicateAndRank(analysis.keyTerms);
    analysis.suggestedFeatures = this.deduplicateAndRank(analysis.suggestedFeatures);
    analysis.technicalRequirements = this.deduplicateAndRank(analysis.technicalRequirements);

    return analysis;
  }

  /**
   * Analyze a single document
   */
  analyzeDocument(document) {
    const text = document.text || '';
    const analysis = {
      keyTerms: [],
      features: [],
      requirements: [],
    };

    // Extract technical terms (simple heuristic)
    const technicalPatterns = [
      /API/gi,
      /database/gi,
      /authentication/gi,
      /validation/gi,
      /performance/gi,
      /security/gi,
      /interface/gi,
      /integration/gi,
    ];

    technicalPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        analysis.keyTerms.push({
          term: matches[0],
          count: matches.length,
        });
      }
    });

    // Look for requirement indicators
    const requirementPatterns = [
      /must\s+\w+/gi,
      /should\s+\w+/gi,
      /required\s+to\s+\w+/gi,
      /needs\s+to\s+\w+/gi,
    ];

    requirementPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          analysis.requirements.push({
            text: match,
            priority: match.toLowerCase().includes('must') ? 'high' : 'medium',
          });
        });
      }
    });

    return analysis;
  }

  /**
   * Deduplicate and rank items by frequency
   */
  deduplicateAndRank(items) {
    const counts = new Map();

    items.forEach((item) => {
      const key = typeof item === 'string' ? item : item.term || item.text;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, count]) => ({ term, count }));
  }

  /**
   * Generate suggestions based on document analysis
   */
  generateSuggestions(analysis) {
    const suggestions = {
      agentTypes: [],
      features: [],
      integrations: [],
    };

    // Suggest agent types based on key terms
    const typeMapping = {
      API: 'API Integration Specialist',
      database: 'Database Handler',
      authentication: 'Security Agent',
      validation: 'Validation Specialist',
      performance: 'Performance Optimizer',
    };

    analysis.keyTerms.forEach(({ term }) => {
      const suggestion = typeMapping[term];
      if (suggestion && !suggestions.agentTypes.includes(suggestion)) {
        suggestions.agentTypes.push(suggestion);
      }
    });

    return suggestions;
  }
}

export default PDFAnalyzer;
