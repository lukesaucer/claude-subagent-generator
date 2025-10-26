# Subagent Creation Prompt Template

## Overview
This is a comprehensive, reusable prompt template for generating subagents with Claude Code.

## Template

You are an elite software architect tasked with creating a specialized subagent module. This subagent will be: **[SUBAGENT_TYPE]** *(e.g., "data validation specialist", "API integration handler", "test suite generator", "documentation writer")*.

## Core Specifications

**Primary Function**: [CORE_FUNCTION] *(e.g., "validate and sanitize user inputs", "manage REST API calls", "generate comprehensive unit tests")*

**Domain Expertise**: [DOMAIN] *(e.g., "financial data processing", "web scraping", "machine learning pipelines")*

## Technical Requirements

### 1. Input Interface
- **Expected inputs**: [INPUT_TYPES] *(e.g., "JSON objects with schema X", "raw text files", "API responses")*
- **Validation rules**: [VALIDATION] *(e.g., "must handle null values", "enforce type checking")*

### 2. Output Contract
- **Return format**: [OUTPUT_FORMAT] *(e.g., "standardized JSON", "markdown reports", "Python classes")*
- **Success/failure signals**: Include clear status codes and error messages

### 3. Performance Constraints
- [PERFORMANCE] *(e.g., "optimize for memory efficiency", "prioritize speed over readability", "balance both")*
- Handle edge cases gracefully without breaking the pipeline

## Implementation Guidelines

Create a modular, self-contained solution that:
- Uses clear function/class names prefixed with **[PREFIX]** *(e.g., "validator_", "api_", "test_")*
- Implements comprehensive error handling with informative messages
- Includes inline documentation for complex logic
- Follows **[STYLE_GUIDE]** *(e.g., "PEP 8", "Google Python Style", "custom conventions")*
- Can be imported and used independently by other modules

## Quality Criteria
- Code must be production-ready, not proof-of-concept
- Include type hints for all functions
- Provide at least **[TEST_COVERAGE]** *(e.g., "3 test cases", "edge case examples")*
- Ensure idempotency where applicable
- Log important operations at appropriate verbosity levels

## Integration Points
- **Must interface cleanly with**: [INTEGRATION_TARGETS] *(e.g., "main application loop", "other subagents", "external APIs")*
- Use dependency injection where possible
- Avoid global state and side effects

## Deliverables
Generate the complete subagent implementation with:
- All necessary imports
- Classes and functions
- Comprehensive error handling
- Type hints
- Usage example demonstrating capabilities

---

## Usage Instructions

1. Replace all bracketed placeholders `[PLACEHOLDER]` with your specific requirements
2. Each placeholder includes example values in italics to guide your input
3. The template is designed to be:
   - **Modular**: Each section can be customized independently
   - **Comprehensive**: Covers all critical aspects of subagent design
   - **Efficient**: Focuses on production-ready code
   - **Reusable**: Same structure works for any technical subagent
   - **Professional**: Enforces best practices and quality standards

## Example Customization

### Before:
```
**Primary Function**: [CORE_FUNCTION]
```

### After:
```
**Primary Function**: Validate and transform incoming API payloads according to OpenAPI 3.0 specifications
```
