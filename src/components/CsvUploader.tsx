import { useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Alert } from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { parseCSV, validateCSVColumns } from '../services/csvParser';
import Papa from 'papaparse';

interface CsvUploaderProps {
  onUploadComplete: (data: any) => void;
}

export const CsvUploader = ({ onUploadComplete }: CsvUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(20);

    try {
      const text = await file.text();
      setProgress(30);

      // First validate columns
      Papa.parse(text, {
        header: true,
        preview: 1,
        complete: async (result) => {
          const headers = result.meta.fields || [];
          const validation = validateCSVColumns(headers);
          
          if (!validation.valid) {
            setError(
              `Invalid CSV format. Missing required columns: ${validation.missing.join(', ')}. ` +
              `Please upload a CSV file with at least these columns: Date, Gross_Sales, Net_Sales`
            );
            setUploading(false);
            setProgress(0);
            return;
          }

          setProgress(50);
          
          try {
            const records = await parseCSV(text);
            setProgress(80);
            
            setPreview(records.slice(0, 10));
            setProgress(100);
            
            setTimeout(() => {
              onUploadComplete(records);
            }, 500);
          } catch (err) {
            setError('Error parsing CSV file. Please check the data format and values.');
            setUploading(false);
            setProgress(0);
          }
        },
        error: () => {
          setError('Error reading CSV file. Please check the file format.');
          setUploading(false);
          setProgress(0);
        }
      });
    } catch (err) {
      setError('Error reading file. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 6,
            textAlign: 'center',
            border: `2px dashed ${isDragging ? '#6366f1' : '#e0e0e0'}`,
            backgroundColor: isDragging ? '#f0f4ff' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {uploading ? 'Processing...' : 'Drop your CSV file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            or click to select a file
          </Typography>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              disabled={uploading}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
              }}
            >
              Select File
            </Button>
          </label>
        </Paper>
      </motion.div>

      {uploading && (
        <Box mt={3}>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
            {progress}% Complete
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {preview.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box mt={3}>
            <Alert 
              severity="success" 
              icon={<CheckCircle />}
              sx={{ mb: 2 }}
            >
              File uploaded successfully! Showing first 10 rows preview.
            </Alert>
            <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                {JSON.stringify(preview, null, 2)}
              </Typography>
            </Paper>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};
