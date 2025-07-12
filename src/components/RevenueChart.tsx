import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StockMonthRevenueEntity } from '../types/stock';
import dayjs from 'dayjs'

interface RevenueChartProps {
  data: StockMonthRevenueEntity[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [chartData, setchartData] = useState<any[]>([]);

  useEffect(() => {
    setchartData(
      data.map((item) => ({
        month: dayjs(`${item.revenue_year}-${item.revenue_month}`).format('YYYY/MM'),
        revenue: item.revenue / 1000,
        growth: item.growthLabel,
      }))
    );
  }, [data]);

  return (
    <>
      <Box mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mr: 1 }}>千元</Typography>
          <Box flex={1} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>%</Typography>
        </Box>
        <Box p={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
          <Typography variant="subtitle1" mb={2}>每月營收</Typography>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
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
  )
};

export default RevenueChart; 