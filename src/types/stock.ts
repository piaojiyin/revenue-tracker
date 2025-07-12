// 台股總覽
export interface StockEntity {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string;
}

// 月營收表
export interface StockMonthRevenueEntity {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

export interface TableData {
  month: string;
  revenue: number;
  growth: number;
}

export interface ChartData {
  month: string;
  revenue: number;
  growth: number;
}
