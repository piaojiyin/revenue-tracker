import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CompanyHeaderProps {
  name: string;
  code: string;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ name, code }) => (
  <Box mb={2}>
    <Typography variant="h6">
      {name} ({code})
    </Typography>
  </Box>
);

export default CompanyHeader; 