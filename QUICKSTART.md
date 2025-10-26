# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies (First Time Only)

```bash
npm install
```

### 2. Run the Application

```bash
npm run dev
```

The application will open automatically!

## Your First Subagent

### Step 1: Fill the Template (2 minutes)

1. Click on **"Template"** in the sidebar
2. Expand **"Core Functions"** accordion
3. Fill in a few fields (you don't need to fill all 12!):
   - Core Function 1: "Validate API responses"
   - Core Function 2: "Check response status codes"
   - Core Function 3: "Verify response data structure"

4. Expand **"Domain Expertise"** accordion
5. Fill in:
   - Domain Expertise 1: "REST API validation"
   - Domain Expertise 2: "JSON schema validation"

### Step 2: Upload Documents (Optional, 1 minute)

1. Click on **"Documents"** in the sidebar
2. Drag and drop a PDF file (if you have one)
3. Or skip this step!

### Step 3: Generate Your Agent (1 minute)

1. Click on **"Preview"** in the sidebar
2. Enter agent details:
   - **Agent Name**: "API Response Validator"
   - **Agent Type**: "validation-specialist"
3. Click **"Generate Preview (with AI Architecture)"**
4. Wait a few seconds while the Head Architect:
   - Analyzes your inputs
   - Consults with existing agents
   - Generates a comprehensive spec

### Step 4: Save Your Agent (30 seconds)

1. Review the generated agent specification
2. Click **"Save Agent"**
3. Done! Your agent is now in `.claude/generated-agents/`

## What Just Happened?

The **Head Architect Agent** just:
1. ✅ Analyzed your template inputs
2. ✅ Consulted with the `code-reviewer` agent for best practices
3. ✅ Determined complexity level
4. ✅ Generated a comprehensive specification
5. ✅ Saved it to `.claude/generated-agents/api-response-validator.md`

## Next Steps

### Explore More Features

- **Try all 8 categories** in the template for more detailed agents
- **Upload PDF documentation** for context-aware generation
- **Switch themes** using the sun/moon icon in the top right
- **Generate multiple agents** for different purposes

### Tips for Better Agents

1. **Be Specific**: The more details you provide, the better
2. **Use Documents**: PDFs help provide real-world context
3. **Name Wisely**: Use descriptive names like "api-response-validator"
4. **Type Consistently**: Use kebab-case like "validation-specialist"

### Common Use Cases

#### Create a Database Handler
- **Core Functions**: Query database, Handle connections, Manage transactions
- **Domain Expertise**: PostgreSQL, MongoDB, SQL optimization
- **Agent Type**: database-handler

#### Create a UI Component Generator
- **Core Functions**: Generate React components, Apply styling, Handle props
- **Domain Expertise**: React, Material-UI, Component patterns
- **Agent Type**: component-generator

#### Create a Test Automation Agent
- **Core Functions**: Write unit tests, Generate test data, Mock dependencies
- **Domain Expertise**: Jest, Pytest, Test-driven development
- **Agent Type**: test-automator

## Troubleshooting

### Application Won't Start?
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npm run dev
```

### PDF Upload Not Working?
- Make sure the PDF is not password-protected
- Try a smaller PDF first (< 10MB)
- Check that it's a valid PDF file

### Agent Not Saving?
- Check that `.claude/generated-agents/` directory exists
- Verify you have write permissions
- Try a different agent name

## Development Mode vs Production

### Development Mode (npm run dev)
- ✅ Hot reload for quick iteration
- ✅ React DevTools enabled
- ✅ Console logging visible
- ⚠️ Slower startup

### Production Build (npm run dist)
- ✅ Optimized and fast
- ✅ Standalone executable
- ✅ No Node.js required to run
- ⚠️ Takes longer to build

## Keyboard Shortcuts

- **Ctrl/Cmd + R**: Reload the application
- **Ctrl/Cmd + Shift + I**: Open DevTools (development only)
- **Ctrl/Cmd + Q**: Quit the application

## Need Help?

1. Check the [README.md](README.md) for detailed documentation
2. Review the [ROADMAP.md](ROADMAP.md) for planned features
3. Look at existing agents in `.claude/agents/` for examples
4. Create an issue on GitHub

---

**Happy Agent Building!** 🚀

Remember: Start simple, iterate, and let the Head Architect help you create amazing subagents!
