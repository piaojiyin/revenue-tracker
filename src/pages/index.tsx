import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { revenueData } from '../mock/revenueData';
import SearchBar from '../components/SearchBar';
import CompanyHeader from '../components/CompanyHeader';
import RevenueChart from '../components/RevenueChart';
import RevenueTable from '../components/RevenueTable';

const IndexPage: React.FC = () => {
  // 这里只用mock数据，实际可根据搜索切换
  const [data] = useState(revenueData);

  // 搜索交互预留
  const handleSearch = (keyword: string) => {
    // 实际可根据keyword切换数据
    alert(`查詢：${keyword}（目前僅展示mock數據）`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <SearchBar onSearch={handleSearch} />
        <Box mt={3}>
          <CompanyHeader name={data.company.name} code={data.company.code} />
          <RevenueChart data={data.chart} />
          <RevenueTable data={data.table} />
        </Box>
      </Paper>
    </Container>
  );
};

export default IndexPage;
