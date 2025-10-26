# Claude Subagent Generator

A powerful desktop application for generating specialized Claude Code subagents with AI-powered architecture consultation.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Electron](https://img.shields.io/badge/electron-29.1.6-47848F.svg)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB.svg)

## Overview

The Claude Subagent Generator is a cross-platform desktop application built with Electron, React, and Material-UI. It streamlines the process of creating specialized subagents for Claude Code by providing:

- **Intelligent Template System**: 8 categories with 12 fields each (96 total fields) for comprehensive subagent specification
- **Head Architect AI**: Analyzes your inputs and consults with existing subagents to generate optimal specifications
- **Document Analysis**: Upload up to 12 PDF documents for contextual understanding
- **Agent Consultation**: Automatically consults with existing agents in `.claude/agents` for best practices
- **Beautiful UI**: Modern Material-UI interface with light/dark theme support

## Features

### Core Functionality

- **96-Field Template System**
  - Core Functions (12 fields)
  - Domain Expertise (12 fields)
  - Input Types (12 fields)
  - Validation Rules (12 fields)
  - Output Format (12 fields)
  - Performance Constraints (12 fields)
  - Style Guide (12 fields)
  - Integration Targets (12 fields)

- **PDF Document Upload**
  - Support for up to 12 PDF documents
  - Automatic text extraction and analysis
  - Context-aware agent generation

- **Head Architect Agent**
  - Analyzes template data and documents
  - Consults with existing subagents
  - Generates comprehensive specifications
  - Provides complexity assessment

- **Theme System**
  - Light and dark modes
  - Persistent theme preference
  - Smooth transitions

### Generated Agent Storage

All generated agents are saved to:
```
.claude/generated-agents/
```

This keeps your custom-generated agents separate from the existing software engineering agents in `.claude/agents/`.

## Technology Stack

- **Frontend**: React 18.2.0
- **UI Framework**: Material-UI 5.15
- **Desktop Framework**: Electron 29.1.6
- **Build Tool**: Vite 5.2.6
- **PDF Processing**: pdf-parse 1.1.1
- **State Management**: React Hooks + Context API

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Setup

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd claude-subagent-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ensure directories exist**
   The following directories should be present:
   - `.claude/agents/` - Contains existing software engineering subagents
   - `.claude/generated-agents/` - Will store your generated agents
   - `SUBAGENT_PROMPT_TEMPLATE.md` - Template file in root directory

## Usage

### Development Mode

Run the application in development mode:

```bash
npm run dev
```

This will:
- Start the Vite development server on `http://localhost:5173`
- Launch the Electron application
- Enable hot module replacement

### Building for Production

Build the application for your platform:

```bash
# Build for all platforms
npm run dist

# Build for macOS only
npm run dist:mac

# Build for Windows only
npm run dist:win

# Build for Linux only
npm run dist:linux
```

The built application will be in the `dist/` directory.

## Application Workflow

1. **Template Configuration**
   - Navigate to the "Template" section
   - Fill in relevant fields across 8 categories
   - Not all fields are required - only provide what's relevant

2. **Document Upload** (Optional)
   - Navigate to the "Documents" section
   - Upload up to 12 PDF documents
   - PDFs are automatically analyzed for context

3. **Preview & Generate**
   - Navigate to the "Preview" section
   - Enter agent name and type
   - Click "Generate Preview (with AI Architecture)"
   - The Head Architect will:
     - Analyze your inputs
     - Consult with existing agents
     - Generate a comprehensive specification

4. **Save Agent**
   - Review the generated agent
   - Click "Save Agent"
   - Agent is saved to `.claude/generated-agents/`

## Project Structure

```
claude-subagent-generator/
├── .claude/
│   ├── agents/                 # Existing software engineering agents
│   └── generated-agents/       # Your generated agents (NEW!)
├── src/
│   ├── main/                   # Electron main process
│   │   ├── index.js           # Main entry point
│   │   ├── preload.js         # Context bridge
│   │   ├── ipcHandlers.js     # IPC communication
│   │   └── fileManager.js     # File system operations
│   └── renderer/               # React frontend
│       ├── components/         # UI components
│       │   ├── TemplateForm.jsx
│       │   ├── DocumentUpload.jsx
│       │   ├── AgentPreview.jsx
│       │   ├── ThemeToggle.jsx
│       │   └── GenerateButton.jsx
│       ├── hooks/              # React hooks
│       │   ├── useTheme.js
│       │   └── useAgentGenerator.js
│       ├── services/           # Business logic
│       │   ├── agentGenerator.js      # Head Architect
│       │   ├── templateProcessor.js
│       │   └── pdfParser.js
│       ├── theme/              # Material-UI themes
│       │   └── materialTheme.js
│       ├── App.jsx             # Root component
│       ├── main.jsx            # React entry point
│       └── index.html          # HTML template
├── package.json
├── vite.config.js
├── ROADMAP.md
├── SUBAGENT_PROMPT_TEMPLATE.md
└── README.md
```

## Head Architect System

The Head Architect is the intelligence behind the generation process:

### Analysis Phase
1. Analyzes template data completeness
2. Counts filled fields per category
3. Determines complexity level (simple/moderate/complex)
4. Suggests which existing agents to consult

### Consultation Phase
1. Always consults with `code-reviewer` for best practices
2. Consults with domain-specific agents based on keywords:
   - API/backend → `backend-developer`
   - UI/frontend → `frontend-developer`
   - Security → `security-engineer`
   - Database → `database-optimizer`
   - And more...

### Generation Phase
1. Combines template data, document analysis, and consultations
2. Creates comprehensive specification
3. Formats output with proper markdown structure
4. Includes metadata about consultations and complexity

## Configuration

### Theme Preference

Theme preference is automatically saved using `electron-store` and persists across sessions.

### Settings Location

Settings are stored in:
- **macOS**: `~/Library/Application Support/claude-subagent-generator/`
- **Windows**: `%APPDATA%/claude-subagent-generator/`
- **Linux**: `~/.config/claude-subagent-generator/`

## Development Commands

```bash
# Development
npm run dev                # Start development server

# Building
npm run build             # Build for production
npm run preview           # Preview production build

# Distribution
npm run dist              # Package for all platforms
npm run dist:mac         # Package for macOS
npm run dist:win         # Package for Windows
npm run dist:linux       # Package for Linux

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier
```

## Troubleshooting

### PDF Processing Issues

If PDF processing fails:
1. Ensure the PDF is not encrypted
2. Check that the file is a valid PDF
3. Try with a smaller PDF first

### Build Issues

If the build fails:
1. Clear the cache: `rm -rf node_modules dist`
2. Reinstall dependencies: `npm install`
3. Try building again: `npm run dist`

### Agent Consultation Issues

If agent consultation doesn't work:
1. Ensure `.claude/agents/` directory exists
2. Check that agent files are valid markdown
3. Verify file permissions

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

**Developer**: Safe Harbor Development
**Technology**: Electron + React + Material-UI
**AI Partner**: Claude Code by Anthropic

## Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed development plans and future enhancements.

### Version 1.1 (Planned)
- Agent versioning and rollback
- Template library/marketplace
- Batch agent generation
- Export/import templates

### Version 1.2 (Planned)
- Agent dependency management
- Built-in testing framework
- Performance benchmarking
- Collaboration features

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues

---

**Generated with Claude Code** 🤖

*Making AI agent development accessible to everyone*
