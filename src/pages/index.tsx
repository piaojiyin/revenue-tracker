import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import CompanyHeader from '../components/CompanyHeader';
import RevenueChart from '../components/RevenueChart';
import RevenueTable from '../components/RevenueTable';
import { getStockMonthRevenueApi } from '../api/request';
import { StockEntity, StockMonthRevenueEntity } from '../types/stock';
import { finMindApiRequestParams } from '../types/api';
import dayjs from "dayjs";
import Button from '@mui/material/Button';
import TimeRangeSelector from '../components/TimeRangeSelector';
const IndexPage: React.FC = () => {
  // 筛选时间范围
  const [filterTimeRange, setFilterTimeRange] = useState<string[]>([]);
  // 当前选中股票
  const [currentStock, setCurrentStock] = useState<StockEntity | null>(null);
  // 股票月营收
  const [stockMonthRevenueData, setStockMonthRevenueData] = useState<StockMonthRevenueEntity[]>([]);

  useEffect(() => {
    // 初始化筛选时间范围
    setFilterTimeRange([
      dayjs().subtract(5, 'year').startOf('year').format('YYYY-MM-DD'),
      dayjs().startOf('month').format('YYYY-MM-DD'),
    ]);
  }, [])

  useEffect(() => {
    // 发起获取月营收API请求
    const fetchMonthRevenue = async () => {
      if (!currentStock || !currentStock.stock_id) return;
      const params: finMindApiRequestParams = {
        data_id: currentStock.stock_id,
        // 计算月营收年增长率，查询比筛选条件往前1年
        start_date: dayjs(filterTimeRange[0]).subtract(1, 'year').format('YYYY-MM-DD'),
        end_date: filterTimeRange[1],
      };
      try {
        const res = await getStockMonthRevenueApi(params);
        // 包含月营收年增长率的数据
        let StockMonthRevenueDataWidthGrowth: StockMonthRevenueEntity[] = (res?.data || [])
        const StockMonthRevenueDataMap: any = {}
        StockMonthRevenueDataWidthGrowth.forEach(item => {
          StockMonthRevenueDataMap[dayjs(`${item.revenue_year}-${item.revenue_month}`).format('YYYY-MM')] = item
        });
        StockMonthRevenueDataWidthGrowth = StockMonthRevenueDataWidthGrowth.map(item => {
          let growth = 0, growthLabel = ''
          // 去年同月的營收
          const monthRevenueLastYear = StockMonthRevenueDataMap[dayjs(`${item.revenue_year - 1}-${item.revenue_month}`).format('YYYY-MM')]
          if (monthRevenueLastYear) {
            // 去年同月的營收存在
            growth = Math.round((item.revenue / monthRevenueLastYear.revenue - 1) * 10000)
          } else {
            growth = 0
          }
          growthLabel = (growth / 100).toFixed(2)
          return { ...item, growth, growthLabel };
        })
          // 过滤第1年数据（为月营收年增长率计算额外查询）
          .filter(item => {
            return dayjs(`${item.revenue_year}-${item.revenue_month}`) >= dayjs(filterTimeRange[0]);
          })
        setStockMonthRevenueData(StockMonthRevenueDataWidthGrowth);
      } catch (err) {
        // 可以 setError 或提示
        console.error('获取月营收失败', err);
      }
    };
    fetchMonthRevenue();
  }, [currentStock, filterTimeRange]);

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
          <RevenueChart data={stockMonthRevenueData} />
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
