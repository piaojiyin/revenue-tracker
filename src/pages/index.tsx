import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import CompanyHeader from '../components/CompanyHeader';
import RevenueChart from '../components/RevenueChart';
import RevenueTable from '../components/RevenueTable';
import Button from '@mui/material/Button';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { StockEntity } from '../types/stock';
import { useStockRevenue } from '../hooks/useStockRevenue';

const IndexPage: React.FC = () => {
  // 筛选时间范围
  const [filterTimeRange, setFilterTimeRange] = useState<string[]>([]);
  // 当前选中股票
  const [currentStock, setCurrentStock] = useState<StockEntity | null>(null);
  // 获取月盈利数据
  const { data: stockMonthRevenueData, loading, error } = useStockRevenue(currentStock?.stock_id, filterTimeRange);

  // 处理搜索栏选择
  const handleStockChange = (stock: StockEntity) => {
    setCurrentStock(stock);
  };

  return (
    <Box>
      {/* 顶部搜索栏居中且宽度适中 */}
      <Box sx={{ width: '100%', bgcolor: '#fff', py: 1.5, px: 2, boxShadow: 1, position: 'fixed', top: 0, left: 0, zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 480 }}>
          <SearchBar setCurrentStock={setCurrentStock} onSearch={handleStockChange} />
        </Box>
      </Box>
      {/* 主内容区 */}
      <Container maxWidth="md" sx={{ pt: 10, pb: 6 }}>
        {/* 公司名称单独卡片横向占满主内容区 */}
        <Box mb={3}>
          <Paper elevation={1} sx={{ px: 4, py: 2, borderRadius: 2, width: '100%', textAlign: 'center' }}>
            <CompanyHeader name={currentStock?.stock_name || ''} code={currentStock?.stock_id || ''} />
          </Paper>
        </Box>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mb: 3, borderRadius: 3, boxShadow: 3 }}>
          {/* 蓝色tab按钮区 */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }} disableElevation>
              每月營收
            </Button>
            <Box flex={1} />
            <TimeRangeSelector filterTimeRange={filterTimeRange} setFilterTimeRange={setFilterTimeRange} />
          </Box>
          {/* 图表区 */}
          <RevenueChart data={stockMonthRevenueData} loading={loading} error={error} />
        </Paper>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
          {/* 表格区 */}
          <RevenueTable data={stockMonthRevenueData} />
        </Paper>
        {/* 页脚说明 */}
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" align="right" display="block">
            圖表單位：千元，數據來自公開資訊觀測站<br />
            網頁圖表歡迎轉貼引用，請註明出處為財報狗
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default IndexPage;
