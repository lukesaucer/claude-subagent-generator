import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import { Description, CloudUpload, Visibility, History } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme/materialTheme';
import { useTheme } from './hooks/useTheme';
import { useAgentGenerator } from './hooks/useAgentGenerator';
import ThemeToggle from './components/ThemeToggle';
import TemplateForm from './components/TemplateForm';
import DocumentUpload from './components/DocumentUpload';
import AgentPreview from './components/AgentPreview';
import GenerateButton from './components/GenerateButton';

const drawerWidth = 240;

const navigationItems = [
  { label: 'Template', icon: <Description />, id: 'template' },
  { label: 'Documents', icon: <CloudUpload />, id: 'documents' },
  { label: 'Preview', icon: <Visibility />, id: 'preview' },
  { label: 'History', icon: <History />, id: 'history' },
];

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const agentGenerator = useAgentGenerator();
  const [activeView, setActiveView] = useState('template');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const renderView = () => {
    switch (activeView) {
      case 'template':
        return <TemplateForm agentGenerator={agentGenerator} />;
      case 'documents':
        return <DocumentUpload agentGenerator={agentGenerator} />;
      case 'preview':
        return <AgentPreview agentGenerator={agentGenerator} />;
      case 'history':
        return (
          <Box p={3}>
            <Typography variant="h5">Agent History</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              View previously generated agents here. (Coming soon)
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
            background: isDarkMode
              ? 'linear-gradient(90deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Claude Subagent Generator
            </Typography>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </Toolbar>
        </AppBar>

        {/* Side Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: isDarkMode ? '#1e1e1e' : '#fff',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {navigationItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            background: isDarkMode ? '#121212' : '#fafafa',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl">
            {renderView()}

            {/* Generate Button - Show on template and documents views */}
            {(activeView === 'template' || activeView === 'documents') && (
              <GenerateButton
                agentGenerator={agentGenerator}
                onGenerate={() => setActiveView('preview')}
              />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
