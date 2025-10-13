import { Box, FormControl, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';
import { Download, FilterList, PictureAsPdf } from '@mui/icons-material';

interface FiltersPanelProps {
  aggregation: 'daily' | 'weekly' | 'monthly';
  onAggregationChange: (value: 'daily' | 'weekly' | 'monthly') => void;
  onExport: () => void;
  onExportReport?: () => void;
}

export const FiltersPanel = ({ aggregation, onAggregationChange, onExport, onExportReport }: FiltersPanelProps) => {
  return (
    <Box 
      sx={{ 
        mb: 3, 
        p: 2, 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList color="primary" />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={aggregation}
              label="Time Period"
              onChange={(e) => onAggregationChange(e.target.value as any)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box flexGrow={1} />
        
        {onExportReport && (
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={onExportReport}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
              mr: 1,
            }}
          >
            Export Report
          </Button>
        )}
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={onExport}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          }}
        >
          Export CSV
        </Button>
      </Stack>
    </Box>
  );
};
