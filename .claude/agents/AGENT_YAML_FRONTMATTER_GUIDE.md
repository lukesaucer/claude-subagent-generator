# Agent YAML Front Matter - Comprehensive Guide

## Overview

Every agent definition file (`.md` file) in the `.claude/agents/` directory begins with YAML front matter enclosed in `---` delimiters. This metadata defines the agent's identity, capabilities, and available tools.

---

## Table of Contents

1. [YAML Front Matter Structure](#yaml-front-matter-structure)
2. [Field-by-Field Reference](#field-by-field-reference)
3. [Tool Reference](#tool-reference)
4. [Examples by Agent Type](#examples-by-agent-type)
5. [Creating New Agents](#creating-new-agents)

---

## YAML Front Matter Structure

### Standard Format

```yaml
---
# FIELD: name
# TYPE: string
# REQUIRED: Yes
# PURPOSE: Unique identifier for the agent
# FORMAT: lowercase-with-hyphens
# USAGE: Used to invoke agent via Task tool
# EXAMPLE: blockchain-developer, code-reviewer, postgres-pro
# RULES:
#   - Must be unique across all agents
#   - Should be descriptive and concise
#   - Use hyphens to separate words (kebab-case)
#   - Match the filename (e.g., blockchain-developer.md)
name: blockchain-developer

# FIELD: description
# TYPE: string (multi-line allowed)
# REQUIRED: Yes
# PURPOSE: Explains what the agent does and its expertise
# FORMAT: One or two sentences describing capabilities
# USAGE: Displayed when selecting agents, helps determine which agent to use
# BEST PRACTICES:
#   - Start with "Expert [role] specializing in..."
#   - List 2-3 core competencies
#   - Mention key technologies or frameworks
#   - End with focus area or goal
# EXAMPLE: "Expert blockchain developer specializing in smart contract
#          development, DApp architecture, and DeFi protocols. Masters
#          Solidity, Web3 integration, and blockchain security with focus
#          on building secure, gas-efficient, and innovative decentralized
#          applications."
description: Expert blockchain developer specializing in smart contract development, DApp architecture, and DeFi protocols. Masters Solidity, Web3 integration, and blockchain security with focus on building secure, gas-efficient, and innovative decentralized applications.

# FIELD: tools
# TYPE: string (comma-separated list)
# REQUIRED: Yes (can be empty for some agents)
# PURPOSE: Lists MCP tools and command-line tools available to this agent
# FORMAT: Comma-separated, no spaces after commas
# USAGE: System grants agent access only to these specific tools
# CATEGORIES:
#   - MCP Tools: Custom tools provided by Claude Code (Read, Write, Bash, etc.)
#   - CLI Tools: Command-line programs (npm, git, docker, kubectl, etc.)
#   - Analysis Tools: Code analysis tools (eslint, sonarqube, semgrep, etc.)
#   - Database Tools: Database clients (psql, mysql, redis-cli, etc.)
#   - Testing Tools: Test frameworks (jest, pytest, junit, etc.)
#   - Build Tools: Build systems (maven, gradle, npm, cargo, etc.)
# EXAMPLES:
#   - blockchain-developer: truffle, hardhat, web3, ethers, solidity, foundry
#   - code-reviewer: Read, Grep, Glob, git, eslint, sonarqube, semgrep
#   - postgres-pro: psql, pg_dump, pgbench, pg_stat_statements, pgbadger
#   - backend-developer: Read, Write, MultiEdit, Bash, Docker, database, redis, postgresql
tools: truffle, hardhat, web3, ethers, solidity, foundry
---
```

---

## Field-by-Field Reference

### name Field

**Purpose**: Unique identifier for the agent

**Rules**:
- Must match the filename (without `.md` extension)
- Use kebab-case (lowercase with hyphens)
- Should be descriptive but concise
- Must be unique across all 62 agents

**Examples**:
```yaml
name: blockchain-developer     # ✅ Good: Clear, concise, descriptive
name: code-reviewer            # ✅ Good: Matches common terminology
name: postgres-pro             # ✅ Good: Abbreviation is widely recognized
name: multi-agent-coordinator  # ✅ Good: Descriptive compound name

name: BlockchainDeveloper      # ❌ Bad: Wrong case (should be kebab-case)
name: blockchain_developer     # ❌ Bad: Wrong separator (should use hyphens)
name: bd                       # ❌ Bad: Too abbreviated, not descriptive
```

**Usage in Code**:
```javascript
// Invoking an agent by name
await Task({
  subagent_type: "blockchain-developer",  // Uses the 'name' field
  prompt: "Develop a token staking contract",
  description: "Create staking contract"
});
```

---

### description Field

**Purpose**: Explains the agent's role, expertise, and focus areas

**Structure**: Usually 1-3 sentences following this pattern:
1. **Sentence 1**: "Expert [role] specializing in [core competencies]"
2. **Sentence 2**: "Masters [technologies/tools] [additional skills]"
3. **Sentence 3** (optional): "Focus on [outcomes/goals]"

**Best Practices**:
- Be specific about expertise areas
- Mention key technologies and frameworks
- Highlight what makes this agent unique
- End with the agent's primary goal or focus

**Examples by Pattern**:

**Pattern 1: Technical Specialist**
```yaml
description: Expert blockchain developer specializing in smart contract development, DApp architecture, and DeFi protocols. Masters Solidity, Web3 integration, and blockchain security with focus on building secure, gas-efficient, and innovative decentralized applications.
```
Breaking this down:
- "Expert blockchain developer" - Role
- "specializing in smart contract development, DApp architecture, and DeFi protocols" - Core competencies
- "Masters Solidity, Web3 integration, and blockchain security" - Key technologies
- "with focus on building secure, gas-efficient, and innovative decentralized applications" - Goals

**Pattern 2: Process Specialist**
```yaml
description: Expert code reviewer specializing in code quality, security vulnerabilities, and best practices across multiple languages. Masters static analysis, design patterns, and performance optimization with focus on maintainability and technical debt reduction.
```

**Pattern 3: Infrastructure Specialist**
```yaml
description: Expert database optimizer specializing in query optimization, performance tuning, and scalability across multiple database systems. Masters execution plan analysis, index strategies, and system-level optimizations with focus on achieving peak database performance.
```

**What to Include**:
- Primary role (e.g., developer, reviewer, optimizer, architect)
- Core competencies (2-4 main skills)
- Key technologies or methodologies
- Primary focus or goal

**What to Avoid**:
- Generic descriptions that could apply to any agent
- Marketing language or hype
- Overly long descriptions (keep under 3 sentences)
- Listing every possible skill (focus on core expertise)

---

### tools Field

**Purpose**: Defines which tools the agent can use

**Format**: Comma-separated list, no spaces after commas

**Tool Categories**:

#### 1. MCP (Model Context Protocol) Tools
These are Claude Code's built-in tools for file and system operations:

```yaml
# File Operations
Read        # Read file contents
Write       # Create or overwrite files
Edit        # Make targeted edits to files
MultiEdit   # Edit multiple files at once
Glob        # Search for files by pattern
Grep        # Search file contents with regex

# System Operations
Bash        # Execute shell commands

# Advanced Tools
TodoWrite   # Manage task lists
Task        # Launch sub-agents
```

**Examples**:
```yaml
tools: Read, Write, MultiEdit, Bash, Glob, Grep
```

#### 2. Version Control Tools
```yaml
# Git operations
git         # Git version control
github-cli  # GitHub CLI (gh command)
gitlab      # GitLab CLI
```

#### 3. Package Managers
```yaml
# JavaScript/TypeScript
npm         # Node package manager
yarn        # Yarn package manager

# Python
pip         # Python package installer
poetry      # Python dependency management

# Java
maven       # Maven build tool
gradle      # Gradle build tool

# Rust
cargo       # Rust package manager

# Ruby
bundler     # Ruby gem bundler

# PHP
composer    # PHP dependency manager
```

#### 4. Database Tools
```yaml
# PostgreSQL
psql                    # PostgreSQL client
pg_dump                 # PostgreSQL backup
pgbench                 # PostgreSQL benchmarking
pg_stat_statements      # PostgreSQL query statistics
pgbadger                # PostgreSQL log analyzer

# MySQL
mysql                   # MySQL client
mysqldump               # MySQL backup
mysqltuner              # MySQL configuration tuner

# MongoDB
mongosh                 # MongoDB shell
mongodump               # MongoDB backup

# Redis
redis-cli               # Redis command-line interface

# Generic Database
database                # Generic database operations
sql                     # SQL operations
```

#### 5. Testing Tools
```yaml
# JavaScript/TypeScript
jest        # JavaScript testing framework
mocha       # JavaScript test framework
cypress     # End-to-end testing
playwright  # Browser automation
vitest      # Vite-native test framework

# Python
pytest      # Python testing framework
unittest    # Python unit test framework

# Java
junit       # Java unit testing
junit5      # JUnit 5 framework
testng      # TestNG framework

# Go
gotest      # Go testing tool

# Load Testing
jmeter      # Apache JMeter load testing
gatling     # Gatling load testing
k6          # Modern load testing tool
```

#### 6. Code Quality Tools
```yaml
# Linting
eslint      # JavaScript/TypeScript linter
pylint      # Python linter
rubocop     # Ruby linter
golint      # Go linter
checkstyle  # Java style checker

# Static Analysis
sonarqube   # Code quality platform
semgrep     # Pattern-based static analysis
ast-grep    # AST-based code search

# Formatting
prettier    # Code formatter (JS/TS)
black       # Python code formatter
gofmt       # Go code formatter
```

#### 7. Build Tools
```yaml
# JavaScript/TypeScript
webpack     # Module bundler
vite        # Frontend build tool
rollup      # JavaScript bundler
esbuild     # Fast JavaScript bundler
turbo       # High-performance build system

# Java
mvn         # Maven
gradlew     # Gradle wrapper

# Go
go          # Go toolchain

# Rust
cargo       # Cargo build system

# C/C++
make        # Make build tool
cmake       # CMake build system
gcc         # GNU Compiler Collection
```

#### 8. Container & Orchestration
```yaml
# Containers
docker      # Docker containerization
podman      # Podman container tool

# Orchestration
kubectl     # Kubernetes CLI
helm        # Kubernetes package manager
k9s         # Kubernetes TUI
kustomize   # Kubernetes configuration
```

#### 9. Infrastructure as Code
```yaml
terraform   # Infrastructure provisioning
ansible     # Configuration management
pulumi      # Infrastructure as code
```

#### 10. Cloud Platforms
```yaml
aws-cli     # AWS command-line interface
azure-cli   # Azure command-line interface
gcloud      # Google Cloud SDK
```

#### 11. Blockchain Tools
```yaml
# Ethereum Development
truffle     # Ethereum development framework
hardhat     # Ethereum development environment
foundry     # Fast Ethereum toolkit
ganache     # Local Ethereum blockchain

# Web3 Libraries
web3        # Web3.js library
ethers      # Ethers.js library

# Compilers
solidity    # Solidity compiler
vyper       # Vyper compiler
```

#### 12. Monitoring & Observability
```yaml
prometheus  # Metrics collection
grafana     # Metrics visualization
datadog     # Application monitoring
elk         # Elasticsearch, Logstash, Kibana
```

#### 13. Security Tools
```yaml
# Vulnerability Scanning
nmap        # Network scanner
nikto       # Web server scanner
trivy       # Container vulnerability scanner

# Penetration Testing
metasploit  # Penetration testing framework
burpsuite   # Web security testing

# Secret Management
vault       # HashiCorp Vault
sops        # Secrets management
```

---

## Examples by Agent Type

### Development Agents

#### Blockchain Developer
```yaml
---
name: blockchain-developer
description: Expert blockchain developer specializing in smart contract development, DApp architecture, and DeFi protocols. Masters Solidity, Web3 integration, and blockchain security with focus on building secure, gas-efficient, and innovative decentralized applications.
tools: truffle, hardhat, web3, ethers, solidity, foundry
---
```
**Tools Explained**:
- `truffle`: Ethereum development framework for smart contracts
- `hardhat`: Modern Ethereum development environment with testing
- `web3`: Web3.js library for blockchain interaction
- `ethers`: Ethers.js library (alternative to web3.js)
- `solidity`: Solidity compiler for smart contracts
- `foundry`: Fast, modern Ethereum development toolkit

#### Backend Developer
```yaml
---
name: backend-developer
description: Senior backend engineer specializing in scalable API development and microservices architecture. Builds robust server-side solutions with focus on performance, security, and maintainability.
tools: Read, Write, MultiEdit, Bash, Docker, database, redis, postgresql
---
```
**Tools Explained**:
- `Read, Write, MultiEdit`: File operations for coding
- `Bash`: Execute server commands
- `Docker`: Container management
- `database`: Generic database operations
- `redis`: Redis in-memory database
- `postgresql`: PostgreSQL relational database

#### React Specialist
```yaml
---
name: react-specialist
description: Expert React specialist mastering React 18+ with modern patterns and ecosystem. Specializes in performance optimization, advanced hooks, server components, and production-ready architectures.
tools: vite, webpack, jest, cypress, storybook, react-devtools, npm, typescript
---
```
**Tools Explained**:
- `vite, webpack`: Build tools
- `jest`: Unit testing
- `cypress`: End-to-end testing
- `storybook`: Component development environment
- `react-devtools`: React debugging tools
- `npm`: Package management
- `typescript`: TypeScript compiler

### Infrastructure Agents

#### Kubernetes Specialist
```yaml
---
name: kubernetes-specialist
description: Expert Kubernetes specialist mastering container orchestration, cluster management, and cloud-native architectures. Specializes in production-grade deployments, security hardening, and performance optimization.
tools: Read, Write, MultiEdit, Bash, kubectl, helm, kustomize, kubeadm, k9s, stern, kubectx
---
```
**Tools Explained**:
- `kubectl`: Kubernetes command-line tool
- `helm`: Kubernetes package manager
- `kustomize`: Kubernetes configuration customization
- `kubeadm`: Kubernetes cluster bootstrapping
- `k9s`: Kubernetes terminal UI
- `stern`: Multi-pod log tailing
- `kubectx`: Kubernetes context switching

#### Terraform Engineer
```yaml
---
name: terraform-engineer
description: Expert Terraform engineer specializing in infrastructure as code, multi-cloud provisioning, and modular architecture. Masters Terraform best practices, state management, and enterprise patterns.
tools: Read, Write, MultiEdit, Bash, terraform, terragrunt, tflint, terraform-docs, checkov, infracost
---
```
**Tools Explained**:
- `terraform`: Infrastructure provisioning
- `terragrunt`: Terraform wrapper for DRY code
- `tflint`: Terraform linter
- `terraform-docs`: Documentation generator
- `checkov`: Security and compliance scanning
- `infracost`: Cost estimation

### Quality Agents

#### Code Reviewer
```yaml
---
name: code-reviewer
description: Expert code reviewer specializing in code quality, security vulnerabilities, and best practices across multiple languages. Masters static analysis, design patterns, and performance optimization.
tools: Read, Grep, Glob, git, eslint, sonarqube, semgrep
---
```
**Tools Explained**:
- `Read, Grep, Glob`: File reading and searching
- `git`: Version control inspection
- `eslint`: JavaScript/TypeScript linting
- `sonarqube`: Comprehensive code quality analysis
- `semgrep`: Pattern-based security analysis

#### Test Automator
```yaml
---
name: test-automator
description: Expert test automation engineer specializing in building robust test frameworks, CI/CD integration, and comprehensive test coverage.
tools: Read, Write, selenium, cypress, playwright, pytest, jest, appium, k6, jenkins
---
```
**Tools Explained**:
- `selenium, cypress, playwright`: Browser automation
- `pytest, jest`: Testing frameworks
- `appium`: Mobile app testing
- `k6`: Load testing
- `jenkins`: CI/CD integration

### Database Agents

#### Postgres Pro
```yaml
---
name: postgres-pro
description: Expert PostgreSQL specialist mastering database administration, performance optimization, and high availability. Deep expertise in PostgreSQL internals, advanced features, and enterprise deployment.
tools: psql, pg_dump, pgbench, pg_stat_statements, pgbadger
---
```
**Tools Explained**:
- `psql`: PostgreSQL interactive terminal
- `pg_dump`: Database backup utility
- `pgbench`: Performance benchmarking
- `pg_stat_statements`: Query performance tracking
- `pgbadger`: Advanced log analyzer

#### Database Optimizer
```yaml
---
name: database-optimizer
description: Expert database optimizer specializing in query optimization, performance tuning, and scalability across multiple database systems.
tools: explain, analyze, pgbench, mysqltuner, redis-cli
---
```
**Tools Explained**:
- `explain, analyze`: Query plan analysis
- `pgbench`: PostgreSQL benchmarking
- `mysqltuner`: MySQL optimization recommendations
- `redis-cli`: Redis performance analysis

---

## Creating New Agents

### Step-by-Step Guide

1. **Choose a Unique Name**
   ```yaml
   name: my-new-specialist  # kebab-case, descriptive
   ```

2. **Write a Clear Description**
   ```yaml
   description: Expert [role] specializing in [skills]. Masters [technologies] with focus on [goals].
   ```

3. **Select Appropriate Tools**
   ```yaml
   tools: Read, Write, Bash, [specific-tools-for-this-agent]
   ```

4. **Create the File**
   - Filename: `.claude/agents/my-new-specialist.md`
   - Start with YAML front matter
   - Add agent instructions below the closing `---`

### Template for New Agents

```yaml
---
name: [agent-name]
description: Expert [role] specializing in [core-competencies]. Masters [technologies] with focus on [goals].
tools: [comma-separated-tool-list]
---

You are a senior [role] with expertise in [domain]. Your focus spans [areas] with emphasis on [outcomes].

When invoked:
1. Query context manager for [relevant context]
2. Review [what to review]
3. Analyze [what to analyze]
4. [Action to take]

[Agent-specific checklist]
[Agent-specific sections]
```

---

## Tool Selection Guidelines

### Choosing the Right Tools

**Questions to Ask**:
1. **What files does this agent need to access?**
   - Need to read code? → Add `Read, Grep, Glob`
   - Need to modify code? → Add `Write, Edit, MultiEdit`

2. **What commands does this agent need to run?**
   - Need shell access? → Add `Bash`
   - Need specific CLI tools? → Add those tools

3. **What domain-specific tools are required?**
   - Database work? → Add `psql, mysql, redis-cli`
   - Cloud infrastructure? → Add `kubectl, terraform, aws-cli`
   - Testing? → Add `jest, pytest, cypress`

4. **What analysis tools enhance this agent?**
   - Code quality? → Add `eslint, sonarqube, semgrep`
   - Performance? → Add `pgbench, jmeter, k6`

### Minimal vs. Comprehensive Tool Sets

**Minimal (Basic Agent)**:
```yaml
tools: Read, Write, Bash
```
- Can read and write files
- Can execute commands
- Suitable for simple tasks

**Moderate (Specialized Agent)**:
```yaml
tools: Read, Write, MultiEdit, Bash, git, npm, jest, eslint
```
- File operations
- Command execution
- Version control
- Package management
- Testing
- Linting

**Comprehensive (Full-Featured Agent)**:
```yaml
tools: Read, Write, MultiEdit, Bash, Glob, Grep, git, docker, kubectl, terraform, prometheus, grafana, jenkins
```
- All file operations
- Containers
- Orchestration
- Infrastructure as Code
- Monitoring
- CI/CD

---

## Validation

### YAML Syntax Validation

**Valid**:
```yaml
---
name: example-agent
description: Single line description.
tools: tool1, tool2, tool3
---
```

**Also Valid (Multi-line Description)**:
```yaml
---
name: example-agent
description: Multi-line description with
  proper indentation continuing
  on multiple lines.
tools: tool1, tool2, tool3
---
```

**Invalid (Syntax Errors)**:
```yaml
---
name: example-agent
description: Missing closing delimiter
tools: tool1, tool2, tool3
# ❌ Missing closing --- delimiter

---
name: example-agent
description Missing colon after field name
tools: tool1, tool2, tool3
---
# ❌ Missing colon after 'description'
```

---

## Best Practices

1. **Name Consistency**: Ensure `name` field matches filename
2. **Clear Descriptions**: Be specific about what the agent does
3. **Minimal Tool Sets**: Only include tools the agent actually needs
4. **Alphabetical Order**: Keep tools in alphabetical order for readability
5. **Documentation**: Update this guide when adding new tool categories

---

## Related Documentation

- `AGENT_JSON_PROTOCOL_GUIDE.md`: JSON communication protocol
- `.claude/agents.md`: Complete agent registry
- `CLAUDE.md`: Project configuration and agent usage rules
- `.claude/code-style-guide.md`: Coding standards

---

**Last Updated**: 2025-10-14
**Applies To**: All 62 agent definition files in `.claude/agents/`
**File Location**: `.claude/agents/AGENT_YAML_FRONTMATTER_GUIDE.md`
