import { useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Delete, PictureAsPdf } from '@mui/icons-material';

function DocumentUpload({ agentGenerator }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    for (const file of files) {
      if (file.type === 'application/pdf') {
        await agentGenerator.addDocument({
          name: file.name,
          path: file.path,
        });
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const maxDocuments = 12;
  const remainingSlots = maxDocuments - agentGenerator.documents.length;

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'transparent' }}>
        <Typography variant="h4" gutterBottom>
          Document Upload
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload up to 12 PDF documents to provide additional context for your subagent. The content
          of these documents will be analyzed and incorporated into the generation process.
        </Typography>
      </Paper>

      {agentGenerator.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => agentGenerator.setError(null)}>
          {agentGenerator.error}
        </Alert>
      )}

      {agentGenerator.loading && <LinearProgress sx={{ mb: 3 }} />}

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onClick={handleUploadClick}
        >
          <CloudUpload sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drop PDF files here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Maximum {maxDocuments} PDF documents
          </Typography>
          <Chip
            label={`${remainingSlots} slots remaining`}
            color={remainingSlots > 0 ? 'success' : 'error'}
            size="small"
            sx={{ mt: 2 }}
          />
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Paper>

      {agentGenerator.documents.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Documents ({agentGenerator.documents.length})
          </Typography>
          <List>
            {agentGenerator.documents.map((doc, index) => (
              <ListItem
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <PictureAsPdf sx={{ mr: 2, color: 'error.main' }} />
                <ListItemText
                  primary={doc.name}
                  secondary={`${doc.pages} pages • ${doc.text?.length || 0} characters`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => agentGenerator.removeDocument(index)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 2, mt: 3, background: 'rgba(46, 125, 50, 0.1)' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>How it works:</strong> Uploaded PDFs are analyzed for technical requirements,
          domain knowledge, and best practices. This information helps the Head Architect create a
          more contextually relevant and specialized subagent.
        </Typography>
      </Paper>
    </Box>
  );
}

export default DocumentUpload;
