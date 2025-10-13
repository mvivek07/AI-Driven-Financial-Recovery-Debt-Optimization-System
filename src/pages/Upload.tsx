import { Container, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { CsvUploader } from '../components/CsvUploader';
import { useNavigate } from 'react-router-dom';
import { ShowChart } from '@mui/icons-material';
import { saveFinancialRecords } from '../services/financialRecordsService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';

const Upload = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUploadComplete = async (records: any) => {
    if (!user) {
      toast.error('You must be logged in to upload data');
      navigate('/login');
      return;
    }

    try {
      await saveFinancialRecords(records, user.id);
      toast.success('CSV data saved successfully!');
      navigate('/model');
    } catch (error) {
      console.error('Error saving records:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  if (loading) {
    return null;
  }


  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 3.5rem)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <ShowChart sx={{ fontSize: 64, color: 'white', mb: 2 }} />
            <Typography variant="h2" color="white" fontWeight={700} gutterBottom>
              Financial Dashboard
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.9)">
              Upload your CSV file to visualize and analyze your financial data
            </Typography>
            {user && (
              <Typography variant="body2" color="rgba(255,255,255,0.7)" mt={1}>
                Logged in as: {user.email}
              </Typography>
            )}
          </Box>
        </motion.div>

        <CsvUploader onUploadComplete={handleUploadComplete} />
      </Container>
    </Box>
  );
};

export default Upload;
