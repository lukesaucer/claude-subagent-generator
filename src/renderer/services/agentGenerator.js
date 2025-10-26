/**
 * Head Architect Agent Generator
 *
 * This service coordinates the generation of subagents by:
 * 1. Analyzing template data and documents
 * 2. Consulting with existing subagents for best practices
 * 3. Generating comprehensive subagent specifications
 * 4. Formatting output according to the template
 */

class HeadArchitectAgent {
  constructor() {
    this.templateEngine = null;
  }

  /**
   * Main generation method
   */
  async generateSubagent(templateData, documents, agentName, agentType) {
    try {
      // Load the template
      const templateResult = await window.electronAPI.loadTemplate();
      const template = templateResult.success ? templateResult.template : '';

      // Analyze the provided data
      const analysis = this.analyzeInputData(templateData, documents);

      // Consult with existing agents for best practices
      const consultations = await this.consultExistingAgents(agentType, analysis);

      // Generate the agent specification
      const specification = this.createSpecification(
        agentName,
        agentType,
        templateData,
        documents,
        analysis,
        consultations,
        template
      );

      return {
        success: true,
        specification,
        metadata: {
          name: agentName,
          type: agentType,
          timestamp: new Date().toISOString(),
          consultedAgents: consultations.map((c) => c.agentType),
        },
      };
    } catch (error) {
      console.error('Error generating subagent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Analyze input data to understand requirements
   */
  analyzeInputData(templateData, documents) {
    const analysis = {
      coreFunctionCount: templateData.coreFunctions.filter((f) => f.trim()).length,
      domainExpertiseCount: templateData.domainExpertise.filter((f) => f.trim()).length,
      hasDocuments: documents.length > 0,
      documentCount: documents.length,
      totalDocumentPages: documents.reduce((sum, doc) => sum + doc.pages, 0),
      complexity: 'simple',
      suggestedConsultants: [],
    };

    // Determine complexity
    const totalFields = Object.values(templateData).reduce(
      (sum, category) => sum + category.filter((f) => f.trim()).length,
      0
    );

    if (totalFields > 50 || documents.length > 5) {
      analysis.complexity = 'complex';
    } else if (totalFields > 20 || documents.length > 2) {
      analysis.complexity = 'moderate';
    }

    // Suggest which agents to consult based on content
    analysis.suggestedConsultants = this.suggestConsultants(templateData);

    return analysis;
  }

  /**
   * Suggest which existing agents to consult
   */
  suggestConsultants(templateData) {
    const consultants = [];
    const allText = Object.values(templateData).flat().join(' ').toLowerCase();

    // Map keywords to agent types
    const agentKeywords = {
      'backend-developer': ['api', 'backend', 'server', 'database', 'rest'],
      'frontend-developer': ['ui', 'frontend', 'react', 'component', 'interface'],
      'security-engineer': ['security', 'authentication', 'authorization', 'encryption'],
      'database-optimizer': ['database', 'query', 'optimization', 'sql'],
      'code-reviewer': ['quality', 'review', 'best practice', 'standards'],
      'documentation-engineer': ['documentation', 'readme', 'guide', 'manual'],
      'test-automator': ['test', 'testing', 'qa', 'validation'],
      'performance-engineer': ['performance', 'optimization', 'speed', 'efficiency'],
    };

    for (const [agent, keywords] of Object.entries(agentKeywords)) {
      if (keywords.some((keyword) => allText.includes(keyword))) {
        consultants.push(agent);
      }
    }

    return consultants.slice(0, 3); // Limit to top 3 consultants
  }

  /**
   * Consult with existing agents
   */
  async consultExistingAgents(agentType, analysis) {
    const consultations = [];

    // Always consult code-reviewer for best practices
    const reviewerConsultation = await this.consultAgent(
      'code-reviewer',
      `What are the best practices for creating a ${agentType} subagent?`
    );
    if (reviewerConsultation) {
      consultations.push(reviewerConsultation);
    }

    // Consult suggested agents
    for (const agentName of analysis.suggestedConsultants) {
      const consultation = await this.consultAgent(
        agentName,
        `Provide guidance for implementing a ${agentType} subagent with your expertise`
      );
      if (consultation) {
        consultations.push(consultation);
      }
    }

    return consultations;
  }

  /**
   * Consult a single agent
   */
  async consultAgent(agentType, query) {
    try {
      const result = await window.electronAPI.consultAgent(agentType, query);
      return result.success ? result.response : null;
    } catch (error) {
      console.error(`Error consulting ${agentType}:`, error);
      return null;
    }
  }

  /**
   * Create the final specification
   */
  // eslint-disable-next-line max-params
  createSpecification(
    agentName,
    agentType,
    templateData,
    documents,
    analysis,
    consultations,
    _template
  ) {
    const sections = [];

    // Header
    sections.push(`# Subagent: ${agentName}`);
    sections.push('');
    sections.push(`**Generated**: ${new Date().toISOString()}`);
    sections.push(`**Version**: 1.0.0`);
    sections.push(`**Type**: ${agentType}`);
    sections.push(`**Complexity**: ${analysis.complexity}`);
    sections.push('');
    sections.push('---');
    sections.push('');

    // Overview
    sections.push('## Overview');
    sections.push(`This is a specialized ${agentType} subagent designed for:`);
    templateData.coreFunctions
      .filter((f) => f.trim())
      .forEach((func, i) => sections.push(`${i + 1}. ${func}`));
    sections.push('');

    // Core Specifications
    sections.push('## Core Specifications');
    sections.push('');

    // Core Functions
    if (templateData.coreFunctions.some((f) => f.trim())) {
      sections.push('### Primary Functions');
      templateData.coreFunctions
        .filter((f) => f.trim())
        .forEach((func) => sections.push(`- ${func}`));
      sections.push('');
    }

    // Domain Expertise
    if (templateData.domainExpertise.some((f) => f.trim())) {
      sections.push('### Domain Expertise');
      templateData.domainExpertise
        .filter((f) => f.trim())
        .forEach((exp) => sections.push(`- ${exp}`));
      sections.push('');
    }

    // Technical Requirements
    sections.push('## Technical Requirements');
    sections.push('');

    // Input Types
    if (templateData.inputTypes.some((f) => f.trim())) {
      sections.push('### Input Interface');
      sections.push('**Expected inputs:**');
      templateData.inputTypes
        .filter((f) => f.trim())
        .forEach((input) => sections.push(`- ${input}`));
      sections.push('');
    }

    // Validation Rules
    if (templateData.validationRules.some((f) => f.trim())) {
      sections.push('### Validation Rules');
      templateData.validationRules
        .filter((f) => f.trim())
        .forEach((rule) => sections.push(`- ${rule}`));
      sections.push('');
    }

    // Output Format
    if (templateData.outputFormat.some((f) => f.trim())) {
      sections.push('### Output Contract');
      sections.push('**Return format:**');
      templateData.outputFormat
        .filter((f) => f.trim())
        .forEach((output) => sections.push(`- ${output}`));
      sections.push('');
    }

    // Performance Constraints
    if (templateData.performanceConstraints.some((f) => f.trim())) {
      sections.push('### Performance Constraints');
      templateData.performanceConstraints
        .filter((f) => f.trim())
        .forEach((constraint) => sections.push(`- ${constraint}`));
      sections.push('');
    }

    // Style Guide
    if (templateData.styleGuide.some((f) => f.trim())) {
      sections.push('## Implementation Guidelines');
      sections.push('');
      sections.push('### Code Style');
      templateData.styleGuide
        .filter((f) => f.trim())
        .forEach((style) => sections.push(`- ${style}`));
      sections.push('');
    }

    // Integration Targets
    if (templateData.integrationTargets.some((f) => f.trim())) {
      sections.push('### Integration Points');
      sections.push('Must interface with:');
      templateData.integrationTargets
        .filter((f) => f.trim())
        .forEach((target) => sections.push(`- ${target}`));
      sections.push('');
    }

    // Document Analysis
    if (documents.length > 0) {
      sections.push('## Contextual Documentation');
      sections.push('');
      sections.push(`This subagent was generated with ${documents.length} supporting document(s):`);
      documents.forEach((doc) => {
        sections.push(
          `- **${doc.name}** (${doc.pages} pages, ${doc.text?.length || 0} characters)`
        );
      });
      sections.push('');
      sections.push('### Key Insights from Documents');
      sections.push(
        'The uploaded documents provide additional context and requirements that should be considered in the implementation.'
      );
      sections.push('');
    }

    // Consultant Recommendations
    if (consultations.length > 0) {
      sections.push('## Expert Consultations');
      sections.push('');
      sections.push('This subagent design was informed by consulting the following expert agents:');
      consultations.forEach((c) => {
        if (c && c.agentType) {
          sections.push(
            `- **${c.agentType}**: ${c.available ? 'Provided guidance' : 'Not available'}`
          );
        }
      });
      sections.push('');
    }

    // Quality Criteria
    sections.push('## Quality Criteria');
    sections.push('');
    sections.push('This subagent must meet the following quality standards:');
    sections.push('- Production-ready code, not proof-of-concept');
    sections.push('- Comprehensive error handling with informative messages');
    sections.push('- Type hints for all functions where applicable');
    sections.push('- Inline documentation for complex logic');
    sections.push('- Test coverage for critical functionality');
    sections.push('- Idempotent operations where applicable');
    sections.push('');

    // Usage Instructions
    sections.push('## Usage Instructions');
    sections.push('');
    sections.push(`This subagent should be used for tasks related to ${agentType}.`);
    sections.push('Import and integrate according to your project structure.');
    sections.push('');

    // Footer
    sections.push('---');
    sections.push('');
    sections.push('*Generated by Claude Subagent Generator v1.0.0*');
    sections.push(
      `*Head Architect: Complexity ${analysis.complexity}, ${consultations.length} consultations*`
    );

    return sections.join('\n');
  }
}

export default HeadArchitectAgent;
