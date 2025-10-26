import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const categories = [
  {
    id: 'coreFunctions',
    label: 'Core Functions',
    description: 'Define the primary functions and capabilities of the subagent',
    color: '#1976d2',
  },
  {
    id: 'domainExpertise',
    label: 'Domain Expertise',
    description: 'Specify the domain knowledge and expertise areas',
    color: '#dc004e',
  },
  {
    id: 'inputTypes',
    label: 'Input Types',
    description: 'Define expected input types and formats',
    color: '#2e7d32',
  },
  {
    id: 'validationRules',
    label: 'Validation Rules',
    description: 'Specify validation rules and constraints',
    color: '#ed6c02',
  },
  {
    id: 'outputFormat',
    label: 'Output Format',
    description: 'Define the output format and structure',
    color: '#9c27b0',
  },
  {
    id: 'performanceConstraints',
    label: 'Performance Constraints',
    description: 'Specify performance requirements and constraints',
    color: '#0288d1',
  },
  {
    id: 'styleGuide',
    label: 'Style Guide',
    description: 'Define coding style and conventions',
    color: '#d32f2f',
  },
  {
    id: 'integrationTargets',
    label: 'Integration Targets',
    description: 'Specify integration points and targets',
    color: '#7b1fa2',
  },
];

function TemplateForm({ agentGenerator }) {
  const [expanded, setExpanded] = useState('coreFunctions');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getFilledCount = (category) => {
    return agentGenerator.templateData[category].filter((item) => item.trim() !== '').length;
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'transparent' }}>
        <Typography variant="h4" gutterBottom>
          Subagent Template Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the fields below to define your custom subagent. Each category has 12 fields to
          provide comprehensive specifications. You don't need to fill all fields - only what's
          relevant for your subagent.
        </Typography>
      </Paper>

      {categories.map((category) => {
        const filledCount = getFilledCount(category.id);
        const totalFields = 12;

        return (
          <Accordion
            key={category.id}
            expanded={expanded === category.id}
            onChange={handleAccordionChange(category.id)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                borderLeft: `4px solid ${category.color}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {category.label}
                </Typography>
                <Chip
                  label={`${filledCount}/${totalFields}`}
                  size="small"
                  color={filledCount > 0 ? 'primary' : 'default'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {category.description}
              </Typography>
              <Grid container spacing={2}>
                {Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <TextField
                        fullWidth
                        label={`${category.label} ${index + 1}`}
                        variant="outlined"
                        size="small"
                        multiline
                        rows={2}
                        value={agentGenerator.templateData[category.id][index]}
                        onChange={(e) =>
                          agentGenerator.updateTemplateField(category.id, index, e.target.value)
                        }
                        placeholder={`Enter ${category.label.toLowerCase()} detail ${index + 1}...`}
                      />
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Paper elevation={1} sx={{ p: 2, mt: 3, background: 'rgba(25, 118, 210, 0.1)' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> The more details you provide, the better the generated subagent will
          be. You can also upload PDF documents in the Documents section to provide additional
          context.
        </Typography>
      </Paper>
    </Box>
  );
}

export default TemplateForm;
