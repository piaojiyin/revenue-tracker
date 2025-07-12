import React, { useEffect, useState, useRef } from 'react';
import { StockMonthRevenueEntity } from '../types/stock';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import dayjs from 'dayjs'

interface RevenueTableProps {
  data: StockMonthRevenueEntity[];
}
const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 月份为行，数据类型为列
  const columns = [
    { key: 'revenue', label: '每月營收' },
    { key: 'growthLabel', label: '單月營收年增率 (%)' },
  ];

  const [rows, setRows] = useState<any[]>([]);
  const numberFormatter = new Intl.NumberFormat('zh-TW'); // 或 'zh-TW'、'zh-CN' 等

  useEffect(() => {
    if (!data.length) return
    setRows(data.map((item) => ({
      month: dayjs(`${item.revenue_year}-${item.revenue_month}`).format('YYYY/MM'),
      revenue: item.revenue / 1000,
      growthLabel: item.growthLabel,
    })));
  }, [data])

  useEffect(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
      });
    }
  }, [data]);

  useEffect(() => {
    console.log('rows', rows)
  }, [rows])

  return (
    <>
      {/* 详细数据tab */}
      <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, mb: 2 }} disableElevation>
        詳細數據
      </Button>
      <TableContainer component={Paper} ref={containerRef} sx={{ mt: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{
              backgroundColor: '#f6f8fa',
              '& td, & th': { border: '1px solid #e0e0e0' }
            }}>
              <TableCell sx={{ minWidth: 160, py: 1.5, position: 'sticky', left: 0, background: '#f6f8fa', zIndex: 3 }}>年度月份</TableCell>
              {rows.map((row) => (
                <TableCell key={row.month}>{row.month}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((col, colI) => (
              <TableRow key={col.key}
                sx={{
                  backgroundColor: (colI % 2) === 1 ? '#f6f8fa' : '#fff',
                  '& td, & th': { border: '1px solid #e0e0e0' }
                }}
              >
                <TableCell sx={{ py: 1.5, position: 'sticky', left: 0, background: (colI % 2) === 1 ? '#f6f8fa' : '#fff', zIndex: 3 }}>{col.label}</TableCell>
                {rows.map((row) => (
                  <TableCell key={row.month} sx={{ py: 1.5 }}>
                    {
                      { revenue: numberFormatter.format(row.revenue), growthLabel: row.growthLabel }[col.key]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>

  );
};

export default RevenueTable; 