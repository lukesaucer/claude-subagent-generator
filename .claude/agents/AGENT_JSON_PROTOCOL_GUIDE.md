# Agent JSON Communication Protocol - Comprehensive Guide

## Overview

All 62 specialized agents in this project use a standardized JSON communication protocol to exchange information, request context, and track progress. This guide explains every field and pattern used in agent communications.

---

## Table of Contents

1. [Context Request Protocol](#context-request-protocol)
2. [Progress Tracking Protocol](#progress-tracking-protocol)
3. [Field-by-Field Reference](#field-by-field-reference)
4. [Agent-Specific Examples](#agent-specific-examples)
5. [Best Practices](#best-practices)

---

## Context Request Protocol

### Purpose
Agents use context requests to query the system for relevant information before starting work. This ensures they have complete understanding of project requirements, constraints, and current state.

### Standard Structure

```json
{
  // FIELD: requesting_agent
  // TYPE: string
  // PURPOSE: Identifies which specialized agent is making the request
  // USAGE: Used for logging, routing, and tracking agent activity
  // EXAMPLE VALUES: "blockchain-developer", "code-reviewer", "postgres-pro"
  "requesting_agent": "blockchain-developer",

  // FIELD: request_type
  // TYPE: string
  // PURPOSE: Specifies what kind of information the agent needs
  // USAGE: System uses this to route to appropriate context provider
  // COMMON VALUES:
  //   - "get_<domain>_context" (e.g., "get_blockchain_context")
  //   - "get_review_context"
  //   - "get_optimization_context"
  //   - "get_deployment_context"
  "request_type": "get_blockchain_context",

  // FIELD: payload
  // TYPE: object
  // PURPOSE: Contains the actual request data and parameters
  // USAGE: Nested object with query details and optional parameters
  "payload": {

    // FIELD: payload.query
    // TYPE: string
    // PURPOSE: Human-readable description of what context is needed
    // USAGE: Explains to the system what information the agent requires
    // BEST PRACTICE: Be specific and comprehensive in listing needs
    // EXAMPLE: Lists all types of information needed (requirements, constraints, etc.)
    "query": "Blockchain context needed: project type, target chains, security requirements, gas budget, upgrade needs, and compliance requirements."
  }
}
```

### Detailed Field Explanations

#### requesting_agent
- **What it does**: Identifies the agent making the request
- **Why it matters**: Allows system to track which agents are active, log requests, and route responses
- **Format**: Lowercase with hyphens (e.g., "code-reviewer", "database-optimizer")
- **Must match**: The agent's name field from its YAML front matter

#### request_type
- **What it does**: Categorizes the type of context being requested
- **Why it matters**: System uses this to determine how to fetch and format the response
- **Naming convention**: Usually "get_" + domain + "_context"
- **Examples**:
  - `get_blockchain_context` - For blockchain-specific requirements
  - `get_review_context` - For code review standards and scope
  - `get_optimization_context` - For performance tuning needs
  - `get_security_context` - For security requirements and threats

#### payload
- **What it does**: Container for all request parameters
- **Why it matters**: Provides structured way to pass complex request data
- **Common fields**:
  - `query`: Main question or request description
  - `scope`: Optional, limits the context scope
  - `filters`: Optional, refines what information is needed
  - `priority`: Optional, indicates urgency

#### payload.query
- **What it does**: Describes in detail what information the agent needs
- **Why it matters**: Helps context providers understand exactly what to return
- **Best practice**: List all specific pieces of information needed
- **Format**: Natural language, comma-separated list of requirements
- **Example**: "Database context needed: schema structure, current indexes, slow queries, table sizes, replication status, and performance targets"

---

## Progress Tracking Protocol

### Purpose
Agents use progress tracking JSON to report their current status, metrics, and accomplishments back to the main system and user. This provides real-time visibility into agent work.

### Standard Structure

```json
{
  // FIELD: agent
  // TYPE: string
  // PURPOSE: Identifies which agent is reporting progress
  // USAGE: Matches the requesting_agent field from context requests
  // EXAMPLE VALUES: "code-reviewer", "database-optimizer", "blockchain-developer"
  // NOTE: Must be exact same name as agent identifier
  "agent": "blockchain-developer",

  // FIELD: status
  // TYPE: string (enum)
  // PURPOSE: Indicates current state of agent's work
  // ALLOWED VALUES:
  //   - "initializing": Agent is starting up and gathering context
  //   - "analyzing": Agent is examining code, data, or requirements
  //   - "developing": Agent is actively writing code or making changes
  //   - "reviewing": Agent is checking work quality
  //   - "optimizing": Agent is improving performance or efficiency
  //   - "testing": Agent is running tests or validations
  //   - "deploying": Agent is executing deployment steps
  //   - "completed": Agent has finished all assigned tasks
  //   - "blocked": Agent encountered an issue and cannot proceed
  //   - "error": Agent experienced an unrecoverable error
  "status": "developing",

  // FIELD: progress
  // TYPE: object
  // PURPOSE: Contains quantitative metrics about work completed
  // USAGE: Provides specific, measurable progress indicators
  // NOTE: Fields vary by agent type, but should always be quantitative
  "progress": {

    // PROGRESS METRICS: Agent-Specific
    // These fields vary based on the agent's domain and tasks
    // All metrics should be concrete, measurable values

    // EXAMPLE FOR BLOCKCHAIN-DEVELOPER:
    // FIELD: contracts_written
    // TYPE: number
    // PURPOSE: Count of smart contracts created
    // EXAMPLE: 12 (means 12 contracts have been written)
    "contracts_written": 12,

    // FIELD: test_coverage
    // TYPE: string (percentage)
    // PURPOSE: Shows percentage of code covered by tests
    // FORMAT: Number with % symbol
    // EXAMPLE: "100%" means full test coverage achieved
    "test_coverage": "100%",

    // FIELD: gas_saved
    // TYPE: string (percentage)
    // PURPOSE: Shows optimization improvement in gas efficiency
    // FORMAT: Number with % symbol
    // EXAMPLE: "34%" means gas costs reduced by 34%
    "gas_saved": "34%",

    // FIELD: audit_issues
    // TYPE: number
    // PURPOSE: Count of security issues found in audit
    // EXAMPLE: 0 means no issues found (ideal state)
    "audit_issues": 0
  }
}
```

### Common Progress Metrics by Agent Type

#### Code-Reviewer Agent
```json
{
  "agent": "code-reviewer",
  "status": "reviewing",
  "progress": {
    // Number of source files analyzed
    "files_reviewed": 47,

    // Total issues identified across all categories
    "issues_found": 23,

    // High-severity issues requiring immediate attention
    "critical_issues": 2,

    // Number of improvement recommendations provided
    "suggestions": 41
  }
}
```

#### Database-Optimizer Agent
```json
{
  "agent": "database-optimizer",
  "status": "optimizing",
  "progress": {
    // Number of SQL queries optimized
    "queries_optimized": 127,

    // Average performance improvement percentage
    "avg_improvement": "87%",

    // 95th percentile latency in milliseconds
    // (95% of queries complete faster than this)
    "p95_latency": "47ms",

    // Percentage of queries served from cache vs. database
    "cache_hit_rate": "94%"
  }
}
```

#### Performance-Engineer Agent
```json
{
  "agent": "performance-engineer",
  "status": "optimizing",
  "progress": {
    // Number of performance bottlenecks identified
    "bottlenecks_found": 15,

    // Number of bottlenecks successfully resolved
    "bottlenecks_fixed": 12,

    // Overall system performance improvement
    "throughput_increase": "340%",

    // Reduction in response time
    "latency_reduction": "68%"
  }
}
```

#### Test-Automator Agent
```json
{
  "agent": "test-automator",
  "status": "testing",
  "progress": {
    // Total number of test cases created
    "tests_created": 156,

    // Number of tests currently passing
    "tests_passing": 154,

    // Number of tests currently failing
    "tests_failing": 2,

    // Percentage of codebase covered by tests
    "code_coverage": "87%"
  }
}
```

#### Deployment-Engineer Agent
```json
{
  "agent": "deployment-engineer",
  "status": "deploying",
  "progress": {
    // Number of services deployed
    "services_deployed": 8,

    // Number of environments (dev, staging, prod)
    "environments": 3,

    // Deployment success rate
    "success_rate": "100%",

    // Average time to deploy in seconds
    "avg_deploy_time": "45s"
  }
}
```

---

## Field-by-Field Reference

### Top-Level Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `requesting_agent` | string | Yes (context requests) | Identifies the agent making request |
| `agent` | string | Yes (progress updates) | Identifies the agent reporting progress |
| `request_type` | string | Yes (context requests) | Categorizes type of context needed |
| `status` | string | Yes (progress updates) | Current state of agent's work |
| `payload` | object | Yes (context requests) | Contains request parameters |
| `progress` | object | Yes (progress updates) | Contains quantitative metrics |

### Status Values

| Status | Meaning | When Used |
|--------|---------|-----------|
| `initializing` | Starting up, loading context | At the very beginning of agent execution |
| `analyzing` | Examining existing code/data | When reviewing code, profiling, or gathering information |
| `developing` | Actively writing code | When creating new code or modifying existing code |
| `reviewing` | Checking quality/correctness | When validating work or reviewing changes |
| `optimizing` | Improving performance/efficiency | When tuning performance or reducing resource usage |
| `testing` | Running tests/validations | When executing test suites or validation checks |
| `deploying` | Executing deployment | When pushing to environments or releasing |
| `completed` | All tasks finished | When agent has successfully completed all work |
| `blocked` | Waiting for external input | When agent cannot proceed without user action |
| `error` | Unrecoverable failure | When agent encountered a fatal error |

### Payload Sub-Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `query` | string | Main request description | "Database context needed: schema, indexes, performance" |
| `scope` | string | Limits context scope | "mobile app only", "backend services" |
| `filters` | array | Refines information | ["security-critical", "performance-sensitive"] |
| `priority` | string | Urgency indicator | "high", "medium", "low" |

---

## Agent-Specific Examples

### Blockchain Developer Context Request

```json
{
  // This agent handles smart contract development
  "requesting_agent": "blockchain-developer",

  // Requesting blockchain-specific context
  "request_type": "get_blockchain_context",

  "payload": {
    // Comprehensive list of all blockchain context needed:
    // - project type: DeFi, NFT, governance, etc.
    // - target chains: Ethereum, Polygon, Hyperledger Fabric, etc.
    // - security requirements: audit needs, vulnerability constraints
    // - gas budget: maximum acceptable gas costs
    // - upgrade needs: whether contracts need to be upgradeable
    // - compliance requirements: regulatory constraints (KYC, AML, etc.)
    "query": "Blockchain context needed: project type, target chains, security requirements, gas budget, upgrade needs, and compliance requirements."
  }
}
```

### Code Reviewer Context Request

```json
{
  // This agent performs code quality reviews
  "requesting_agent": "code-reviewer",

  // Requesting code review standards and scope
  "request_type": "get_review_context",

  "payload": {
    // Comprehensive list of code review context needed:
    // - language: Programming language(s) being reviewed
    // - coding standards: Style guides, linting rules
    // - security requirements: Security scanning depth, vulnerability thresholds
    // - performance criteria: Performance budgets, optimization targets
    // - team conventions: Project-specific patterns and practices
    // - review scope: Files/modules to review, depth of analysis
    "query": "Code review context needed: language, coding standards, security requirements, performance criteria, team conventions, and review scope."
  }
}
```

### Database Optimizer Context Request

```json
{
  // This agent optimizes database performance
  "requesting_agent": "database-optimizer",

  // Requesting database optimization context
  "request_type": "get_optimization_context",

  "payload": {
    // Comprehensive list of database optimization context needed:
    // - database systems: PostgreSQL, MySQL, MongoDB, etc.
    // - performance issues: Slow queries, high CPU, memory issues
    // - query patterns: Common query types and access patterns
    // - data volumes: Table sizes, row counts, growth rates
    // - SLAs: Service level agreements, performance targets
    // - hardware specifications: CPU, RAM, disk type, network
    "query": "Optimization context needed: database systems, performance issues, query patterns, data volumes, SLAs, and hardware specifications."
  }
}
```

---

## Communication Flow

### Complete Request-Response Cycle

```
1. AGENT INITIALIZATION
   ↓
2. CONTEXT REQUEST (Agent → System)
   {
     "requesting_agent": "example-agent",
     "request_type": "get_context",
     "payload": { "query": "..." }
   }
   ↓
3. CONTEXT RESPONSE (System → Agent)
   [System provides relevant context data]
   ↓
4. AGENT PROCESSING
   [Agent performs its specialized work]
   ↓
5. PROGRESS UPDATES (Agent → System, multiple times)
   {
     "agent": "example-agent",
     "status": "developing",
     "progress": { ... }
   }
   ↓
6. COMPLETION (Agent → System)
   {
     "agent": "example-agent",
     "status": "completed",
     "progress": { ... final metrics ... }
   }
```

### Example: Blockchain Developer Full Cycle

```
1. User requests: "Develop a token staking smart contract"
   ↓
2. blockchain-developer agent initialized
   ↓
3. Context Request:
   {
     "requesting_agent": "blockchain-developer",
     "request_type": "get_blockchain_context",
     "payload": {
       "query": "Blockchain context needed: project type, target chains, security requirements, gas budget, upgrade needs, and compliance requirements."
     }
   }
   ↓
4. System Response:
   - Project: DeFi staking protocol
   - Chain: Ethereum mainnet
   - Security: High (requires audit)
   - Gas budget: Optimized for mainnet
   - Upgrades: Use proxy pattern
   - Compliance: No KYC required
   ↓
5. Agent Progress Update #1:
   {
     "agent": "blockchain-developer",
     "status": "analyzing",
     "progress": {
       "contracts_designed": 3,
       "test_coverage": "0%",
       "gas_saved": "0%",
       "audit_issues": 0
     }
   }
   ↓
6. Agent Progress Update #2:
   {
     "agent": "blockchain-developer",
     "status": "developing",
     "progress": {
       "contracts_written": 3,
       "test_coverage": "65%",
       "gas_saved": "0%",
       "audit_issues": 0
     }
   }
   ↓
7. Agent Progress Update #3:
   {
     "agent": "blockchain-developer",
     "status": "optimizing",
     "progress": {
       "contracts_written": 3,
       "test_coverage": "100%",
       "gas_saved": "28%",
       "audit_issues": 0
     }
   }
   ↓
8. Final Completion:
   {
     "agent": "blockchain-developer",
     "status": "completed",
     "progress": {
       "contracts_written": 3,
       "test_coverage": "100%",
       "gas_saved": "34%",
       "audit_issues": 0
     }
   }
```

---

## Best Practices

### For Context Requests

1. **Be Specific**: List exactly what information you need
   - ❌ Bad: "Need context"
   - ✅ Good: "Need database schema, indexes, and performance targets"

2. **Use Consistent Naming**: Follow the pattern "get_[domain]_context"
   - ✅ get_blockchain_context
   - ✅ get_security_context
   - ✅ get_optimization_context

3. **Include All Requirements**: Don't make multiple requests
   - ❌ Bad: Request context, then request more context
   - ✅ Good: Request all needed context in one comprehensive query

### For Progress Updates

1. **Update Regularly**: Report progress at key milestones
   - After completing each major phase
   - When metrics change significantly
   - When status changes

2. **Use Quantitative Metrics**: Provide measurable data
   - ❌ Bad: "progress": { "status": "going well" }
   - ✅ Good: "progress": { "files_reviewed": 47, "issues_found": 23 }

3. **Keep Metrics Relevant**: Only include metrics meaningful to the task
   - Blockchain agent: contracts, gas, test coverage
   - Database agent: queries, latency, cache hit rate
   - Code reviewer: files, issues, suggestions

4. **Use Consistent Units**: Be clear about measurement units
   - Time: "ms", "s", "min"
   - Percentage: "85%"
   - Count: Just the number (47, not "47 files")

---

## Error Handling

### When Context Cannot Be Retrieved

```json
{
  "requesting_agent": "example-agent",
  "request_type": "get_context",
  "payload": {
    "query": "Context needed...",
    // Optional error handling field
    "fallback": "Use default settings if context unavailable"
  }
}
```

### When Agent Encounters Error

```json
{
  "agent": "example-agent",
  // Use "error" or "blocked" status
  "status": "error",
  "progress": {
    // Include error information in progress
    "error_type": "dependency_missing",
    "error_message": "Required package 'example-lib' not found",
    "requires_user_action": true
  }
}
```

---

## Integration with CLAUDE.md

This JSON protocol integrates with the mandatory agent usage patterns defined in CLAUDE.md:

1. **Automatic Invocation**: When agents are invoked automatically, they immediately send context requests
2. **Parallel Execution**: Multiple agents can request context simultaneously
3. **Progress Tracking**: All agents report progress using this protocol
4. **Code Review Validation**: code-reviewer agent validates comment completeness

---

## Related Documentation

- `CLAUDE.md`: Mandatory agent usage patterns
- `.claude/agents.md`: Complete list of available agents
- `.claude/code-style-guide.md`: Coding standards
- `.claude/settings.local.json.ANNOTATED.md`: Permission configuration

---

**Last Updated**: 2025-10-14
**Applies To**: All 62 specialized agents
**File Location**: `.claude/agents/AGENT_JSON_PROTOCOL_GUIDE.md`
