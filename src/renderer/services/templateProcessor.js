/**
 * TemplateProcessor - Processes agent templates and fills them with data
 */
class TemplateProcessor {
  constructor(template) {
    this.template = template;
  }

  /**
   * Joins array fields with semicolons, filtering out empty values
   * @param {string[]} fields - Array of field values
   * @returns {string} Joined string or "Not specified" if empty
   */
  joinFields(fields) {
    if (!Array.isArray(fields)) {
      return 'Not specified';
    }

    const filtered = fields.filter(field => field && field.trim() !== '');

    if (filtered.length === 0) {
      return 'Not specified';
    }

    return filtered.join('; ');
  }

  /**
   * Fills the template with provided data
   * @param {Object} templateData - The data to fill the template with
   * @param {Object} metadata - Metadata including type and prefix
   * @returns {string} Filled template
   */
  fillTemplate(templateData, metadata) {
    let result = this.template;

    // Generate prefix from type if not provided
    const prefix = metadata.prefix || metadata.type.replace(/-/g, '_');

    // Replace placeholders
    const replacements = {
      '[SUBAGENT_TYPE]': metadata.type,
      '[CORE_FUNCTION]': this.joinFields(templateData.coreFunctions),
      '[DOMAIN]': this.joinFields(templateData.domainExpertise),
      '[INPUT_TYPES]': this.joinFields(templateData.inputTypes),
      '[VALIDATION]': this.joinFields(templateData.validationRules),
      '[OUTPUT_FORMAT]': this.joinFields(templateData.outputFormat),
      '[PERFORMANCE]': this.joinFields(templateData.performanceConstraints),
      '[STYLE_GUIDE]': this.joinFields(templateData.styleGuide),
      '[INTEGRATION_TARGETS]': this.joinFields(templateData.integrationTargets),
      '[PREFIX]': prefix,
      '[TEST_COVERAGE]': this.joinFields(templateData.testCoverage || [])
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      result = result.replaceAll(placeholder, value);
    });

    return result;
  }

  /**
   * Extracts and categorizes requirements from template data
   * @param {Object} templateData - The template data
   * @returns {Object} Categorized requirements
   */
  extractRequirements(templateData) {
    const filterEmpty = (arr) => (arr || []).filter(item => item && item.trim() !== '');

    return {
      functions: [
        ...filterEmpty(templateData.coreFunctions),
        ...filterEmpty(templateData.domainExpertise)
      ],
      inputs: [
        ...filterEmpty(templateData.inputTypes),
        ...filterEmpty(templateData.validationRules)
      ],
      outputs: filterEmpty(templateData.outputFormat),
      constraints: [
        ...filterEmpty(templateData.performanceConstraints),
        ...filterEmpty(templateData.styleGuide),
        ...filterEmpty(templateData.integrationTargets)
      ]
    };
  }

  /**
   * Validates template data completeness
   * @param {Object} templateData - The template data to validate
   * @returns {Object} Validation result with isValid, errors, warnings, and completeness
   */
  validateTemplateData(templateData) {
    const errors = [];
    const warnings = [];

    // Check for at least one core function
    const hasCoreFunction = templateData.coreFunctions.some(
      func => func && func.trim() !== ''
    );

    if (!hasCoreFunction) {
      errors.push('At least one core function must be specified');
    }

    // Check each category and warn if empty
    const categories = [
      'coreFunctions',
      'domainExpertise',
      'inputTypes',
      'validationRules',
      'outputFormat',
      'performanceConstraints',
      'styleGuide',
      'integrationTargets'
    ];

    let filledCategories = 0;
    categories.forEach(category => {
      const hasValues = templateData[category].some(
        item => item && item.trim() !== ''
      );
      if (hasValues) {
        filledCategories++;
      } else if (category !== 'coreFunctions') {
        warnings.push(`Category ${category} is empty`);
      }
    });

    // Calculate completeness percentage
    const completeness = Math.round((filledCategories / categories.length) * 100);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness
    };
  }

  /**
   * Generates statistics about the template data
   * @param {Object} templateData - The template data
   * @param {Array} documents - Array of document objects
   * @returns {Object} Statistics
   */
  generateStatistics(templateData, documents = []) {
    const categories = [
      'coreFunctions',
      'domainExpertise',
      'inputTypes',
      'validationRules',
      'outputFormat',
      'performanceConstraints',
      'styleGuide',
      'integrationTargets'
    ];

    let totalFields = 0;
    categories.forEach(category => {
      const count = templateData[category].filter(
        item => item && item.trim() !== ''
      ).length;
      totalFields += count;
    });

    const documentCount = documents.length;
    const totalDocumentPages = documents.reduce((sum, doc) => sum + (doc.pages || 0), 0);

    return {
      totalFields,
      totalCategories: categories.length,
      documentCount,
      totalDocumentPages,
      estimatedComplexity: this.estimateComplexity(templateData, documents)
    };
  }

  /**
   * Estimates complexity based on field count and document count
   * @param {Object} templateData - The template data
   * @param {Array} documents - Array of document objects
   * @returns {string} 'low', 'medium', or 'high'
   */
  estimateComplexity(templateData, documents = []) {
    const categories = [
      'coreFunctions',
      'domainExpertise',
      'inputTypes',
      'validationRules',
      'outputFormat',
      'performanceConstraints',
      'styleGuide',
      'integrationTargets'
    ];

    let totalFields = 0;
    categories.forEach(category => {
      const count = templateData[category].filter(
        item => item && item.trim() !== ''
      ).length;
      totalFields += count;
    });

    const documentCount = documents.length;

    // High complexity: >50 fields or >5 documents
    if (totalFields > 50 || documentCount > 5) {
      return 'high';
    }

    // Medium complexity: >15 fields or >2 documents
    if (totalFields > 15 || documentCount > 2) {
      return 'medium';
    }

    // Low complexity: everything else
    return 'low';
  }
}

export default TemplateProcessor;
