import { Button, Paper, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

function GenerateButton({ agentGenerator, onGenerate }) {
  const getTotalFilledFields = () => {
    let total = 0;
    Object.values(agentGenerator.templateData).forEach((category) => {
      total += category.filter((field) => field.trim() !== '').length;
    });
    return total;
  };

  const filledFields = getTotalFilledFields();
  const hasDocuments = agentGenerator.documents.length > 0;
  const canGenerate = filledFields > 0 || hasDocuments;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        p: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        minWidth: 300,
      }}
    >
      <Typography variant="body2" gutterBottom>
        Progress: {filledFields}/96 fields filled
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        {hasDocuments
          ? `${agentGenerator.documents.length} document(s) uploaded`
          : 'No documents uploaded'}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        startIcon={<AutoAwesome />}
        onClick={onGenerate}
        disabled={!canGenerate}
        sx={{
          mt: 1,
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        Continue to Preview
      </Button>
    </Paper>
  );
}

export default GenerateButton;
