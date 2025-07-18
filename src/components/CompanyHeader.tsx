/*
 * CompanyHeader 组件
 * 用于展示公司名称、代码等头部信息
 * 依赖 MUI 组件库
 */
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CompanyHeaderProps {
  name: string;
  code: string;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ name, code }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 0, textAlign: 'left' }}>
      {name || '-'} ({code || '-'})
    </Typography>
  </Box>
);

export default CompanyHeader; 