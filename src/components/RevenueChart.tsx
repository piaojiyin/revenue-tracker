/*
 * RevenueChart 组件
 * 展示公司每月营收及年增率的可视化图表，支持 loading、error 状态
 * 使用 recharts 进行数据可视化
 */
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StockMonthRevenueEntity } from '../types/stock';
import dayjs from 'dayjs'
import { TooltipProps } from 'recharts';

interface RevenueChartProps {
  data: StockMonthRevenueEntity[];
  loading?: boolean;
  error?: Error | null;
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

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading, error }) => {
  const [chartData, setchartData] = useState<any[]>([]);
  const numberFormatter = new Intl.NumberFormat('zh-TW'); // 或 'zh-TW'、'zh-CN' 等

  // 加入旋转动画样式
  // 注意：style标签只能用于组件内JSX，服务端渲染时需注意安全
  const spinnerStyle = (
    <style>{`
      @keyframes spin {
        100% { transform: rotate(360deg); }
      }
      .loading-spinner-circle {
        transform-origin: 110px 110px;
        animation: spin 1s linear infinite;
      }
    `}</style>
  );

  useEffect(() => {
    setchartData(
      data.map((item) => ({
        month: dayjs(`${item.revenue_year}-${item.revenue_month}`).format('YYYY/MM'),
        revenue: item.revenue / 1000,
        growth: item.growth,
      }))
    );
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        {spinnerStyle}
        <Box position="relative" display="flex" justifyContent="center" alignItems="center" width={220} height={220}>
          <svg width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r="105"
              stroke="#d1d5db"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="110"
              cy="110"
              r="105"
              stroke="#222"
              strokeWidth="4"
              fill="none"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * 0.75}
              className="loading-spinner-circle"
              style={{
                transition: 'stroke-dashoffset 0.5s',
              }}
            />
          </svg>
          <Typography
            variant="h5"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            載入數據中...
          </Typography>
        </Box>
      </Box>
    );
  }
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>数据加载失败：{error.message}</div>;
  }

  return (
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
          <YAxis yAxisId="right" orientation="right" label={{ value: '%', position: 'top', offset: 10, style: { textAnchor: 'middle', fontSize: 14, fill: '#000' } }} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
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
  )
};

export default RevenueChart; 