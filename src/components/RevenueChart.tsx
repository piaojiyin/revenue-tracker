import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StockMonthRevenueEntity } from '../types/stock';
import dayjs from 'dayjs'
import { TooltipProps } from 'recharts';

interface RevenueChartProps {
  data: StockMonthRevenueEntity[];
}

// 自定义 Tooltip 组件
const CustomTooltip = (props: TooltipProps<any, any>) => {
  const { active, payload, label } = props as any;
  if (!active || !payload || !payload.length) return null;
  return (
    <Box
      sx={{
        background: 'rgba(0,0,0,0.85)',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        color: '#fff',
        minWidth: 200,
        boxShadow: 3,
      }}
    >
      <Typography sx={{ fontWeight: 700, color: '#fff', mb: 1, fontSize: 16 }}>
        {label}
      </Typography>
      {payload.map((item: any) => (
        <Box key={item.dataKey} display="flex" alignItems="center" mb={0.5}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: item.color,
              display: 'inline-block',
              mr: 1,
            }}
          />
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>
            {item.name}
          </Typography>
          <Box flex={1} />
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: 15, ml: 2 }}>
            {typeof item.value === 'number'
              ? new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 2 }).format(item.value)
              : item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [chartData, setchartData] = useState<any[]>([]);
  const numberFormatter = new Intl.NumberFormat('zh-TW'); // 或 'zh-TW'、'zh-CN' 等


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
      <Box bgcolor="#fff">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 40, bottom: 0 }} barCategoryGap="20%">
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              ticks={chartData
                .map((item, index) => ({ value: item.month, index }))
                .filter(({ value }) => value.split('/')[1] === '12')
                .map(({ value }) => value)}
              tickFormatter={(value) => {
                const year = value.split('/')[0];
                return String(Number(year) + 1);
              }}
            />
            <YAxis tickFormatter={v => numberFormatter.format(v)} label={{ value: '千元', position: 'top', offset: 10, style: { textAnchor: 'middle', fontSize: 14, fill: '#000' } }} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '%', position: 'top', offset: 10, style: { textAnchor: 'middle', fontSize: 14, fill: '#000'} }} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <CartesianGrid
              stroke="#e0e0e0"
              horizontal={true}
              vertical={true}
              strokeWidth={1}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" name="每月營收" fill="#f6df99" stroke="#e8af00" />
            <Line yAxisId="right" type="monotone" dataKey="growth" name="單月營收年增率 (%)" stroke="#B71C1C" dot={false} strokeWidth={2} />
            {/* Legend强制第1展示每月營收 */}
            <Legend
              verticalAlign="top"
              align="left"
              wrapperStyle={{ paddingLeft: 60, paddingTop: 10 }}
              content={({ payload }) => (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px' }}>
                  {payload && payload.length > 0 && (
                    <>
                      <li style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#FFD600', marginRight: '8px' }}></span>
                        <span style={{ fontSize: '14px' }}>每月營收</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#B71C1C', marginRight: '8px' }}></span>
                        <span style={{ fontSize: '14px' }}>單月營收年增率 (%)</span>
                      </li>
                    </>
                  )}
                </ul>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
};

export default RevenueChart; 