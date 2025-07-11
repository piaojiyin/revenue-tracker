import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface TableData {
  month: string;
  revenue: number;
  growth: number;
}

interface RevenueTableProps {
  data: TableData[];
}

const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => (
  <TableContainer component={Paper} sx={{ mt: 3 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>年度月份</TableCell>
          <TableCell>每月營收</TableCell>
          <TableCell>單月營收年增率 (%)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.month}>
            <TableCell>{row.month}</TableCell>
            <TableCell>{row.revenue.toLocaleString()}</TableCell>
            <TableCell>{row.growth}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default RevenueTable; 