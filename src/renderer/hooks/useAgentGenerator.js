import { useState, useCallback } from 'react';

export function useAgentGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAgent, setGeneratedAgent] = useState(null);
  const [templateData, setTemplateData] = useState({
    coreFunctions: Array(12).fill(''),
    domainExpertise: Array(12).fill(''),
    inputTypes: Array(12).fill(''),
    validationRules: Array(12).fill(''),
    outputFormat: Array(12).fill(''),
    performanceConstraints: Array(12).fill(''),
    styleGuide: Array(12).fill(''),
    integrationTargets: Array(12).fill(''),
  });
  const [documents, setDocuments] = useState([]);

  const updateTemplateField = useCallback((category, index, value) => {
    setTemplateData((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) => (i === index ? value : item)),
    }));
  }, []);

  const addDocument = useCallback(
    async (file) => {
      if (documents.length >= 12) {
        setError('Maximum 12 documents allowed');
        return;
      }

      try {
        setLoading(true);
        const result = await window.electronAPI.processPDF(file.path);

        if (result.success) {
          setDocuments((prev) => [
            ...prev,
            {
              name: file.name,
              path: file.path,
              text: result.text,
              pages: result.pages,
            },
          ]);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [documents.length]
  );

  const removeDocument = useCallback((index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const generateAgent = useCallback(
    async (agentName, agentType) => {
      setLoading(true);
      setError(null);

      try {
        // This will be implemented with the actual agent generation service
        // For now, we'll create a placeholder
        const agentData = {
          name: agentName,
          type: agentType,
          templateData,
          documents,
          timestamp: new Date().toISOString(),
        };

        setGeneratedAgent(agentData);
        return agentData;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [templateData, documents]
  );

  const saveAgent = useCallback(async (agentContent, metadata) => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.saveAgent({
        name: metadata.name,
        content: agentContent,
        metadata,
      });

      if (result.success) {
        return result;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setTemplateData({
      coreFunctions: Array(12).fill(''),
      domainExpertise: Array(12).fill(''),
      inputTypes: Array(12).fill(''),
      validationRules: Array(12).fill(''),
      outputFormat: Array(12).fill(''),
      performanceConstraints: Array(12).fill(''),
      styleGuide: Array(12).fill(''),
      integrationTargets: Array(12).fill(''),
    });
    setDocuments([]);
    setGeneratedAgent(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    generatedAgent,
    templateData,
    documents,
    updateTemplateField,
    addDocument,
    removeDocument,
    generateAgent,
    saveAgent,
    resetForm,
  };
}
