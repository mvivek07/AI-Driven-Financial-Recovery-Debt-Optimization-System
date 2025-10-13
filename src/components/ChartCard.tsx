import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export const ChartCard = ({ title, children, delay = 0 }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          height: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
            {title}
          </Typography>
          <Box mt={2}>{children}</Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
