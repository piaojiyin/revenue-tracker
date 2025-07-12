import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartData } from '../types/stock';
import Button from '@mui/material/Button';

interface RevenueChartProps {
  data: ChartData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => (
  <>

    {/* 蓝色tab按钮区 */}
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }} disableElevation>
        每月營收
      </Button>
      <Box flex={1} />
      <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }} disableElevation>
        近 5 年
      </Button>
    </Box>
    <Box mb={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mr: 1 }}>千元</Typography>
        <Box flex={1} />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>%</Typography>
      </Box>
      <Box p={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
        <Typography variant="subtitle1" mb={2}>每月營收</Typography>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tickFormatter={v => v.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => v + '%'} />
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="每月營收" fill="#FFD600" />
            <Line yAxisId="right" type="monotone" dataKey="growth" name="單月營收年增率 (%)" stroke="#B71C1C" dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  </>

);

export default RevenueChart; 