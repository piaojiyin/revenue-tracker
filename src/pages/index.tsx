import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { revenueData } from '../mock/revenueData';
import SearchBar from '../components/SearchBar';
import CompanyHeader from '../components/CompanyHeader';
import RevenueChart from '../components/RevenueChart';
import RevenueTable from '../components/RevenueTable';
import { getStockMonthRevenueApi } from '../api/request';
import { StockEntity, StockMonthRevenueEntity } from '../types/stock';
import { finMindApiRequestParams } from '../types/api';
import dayjs from "dayjs";
const IndexPage: React.FC = () => {
  const [data] = useState(revenueData);
  // 当前选中股票
  const [currentStock, setCurrentStock] = useState<StockEntity | null>(null);
  // 股票月营收
  const [stockMonthRevenueData, setStockMonthRevenueData] = useState<StockMonthRevenueEntity[]>([]);

  useEffect(() => {
    if (!currentStock || !currentStock.stock_id) return;
    // 发起获取月营收API请求
    const params: finMindApiRequestParams = {
      data_id: currentStock.stock_id,
      start_date: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
    };
    getStockMonthRevenueApi(params)
      .then((res) => {
        setStockMonthRevenueData(res?.data || []);
      })
      .catch((err) => {
        // 可以 setError 或提示
        console.error('获取月营收失败', err);
      });
  }, [currentStock]);

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
            <CompanyHeader name={currentStock?.stock_name || data.company.name} code={currentStock?.stock_id || data.company.code} />
          </Paper>
        </Box>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
          {/* 图表区 */}
          <RevenueChart data={data.chart} />
          {/* 表格区 */}
          <RevenueTable data={stockMonthRevenueData} />
          {/* 页脚说明 */}
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary" align="right" display="block">
              圖表單位：千元，數據來自公開資訊觀測站<br />
              網頁圖表歡迎轉貼引用，請註明出處為財報狗
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default IndexPage;
