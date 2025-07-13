import { useState, useEffect } from 'react';
import { getStockMonthRevenueApi } from '../api/request';
import { StockMonthRevenueEntity } from '../types/stock';
import { finMindApiRequestParams } from '../types/api';
import dayjs from 'dayjs';

export function useStockRevenue(stockId: string | undefined, filterTimeRange: string[]) {
  const [data, setData] = useState<StockMonthRevenueEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stockId || !filterTimeRange[0] || !filterTimeRange[1]) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);

    const params: finMindApiRequestParams = {
      data_id: stockId,
      start_date: dayjs(filterTimeRange[0]).subtract(1, 'year').format('YYYY-MM-DD'),
      end_date: filterTimeRange[1],
    };

    getStockMonthRevenueApi(params)
      .then(res => {
        // 重组月盈利数组
        let StockMonthRevenueDataWidthGrowth: StockMonthRevenueEntity[] = (res?.data || []);
        const StockMonthRevenueDataMap: Record<string, StockMonthRevenueEntity> = {};
        StockMonthRevenueDataWidthGrowth.forEach(item => {
          StockMonthRevenueDataMap[dayjs(`${item.revenue_year}-${item.revenue_month}`).format('YYYY-MM')] = item;
        });
        StockMonthRevenueDataWidthGrowth = StockMonthRevenueDataWidthGrowth.map(item => {
          // 计算月盈利年增长率
          let growthNum = 0, growth = '';
          const monthRevenueLastYear = StockMonthRevenueDataMap[dayjs(`${item.revenue_year - 1}-${item.revenue_month}`).format('YYYY-MM')];
          if (monthRevenueLastYear) {
            growthNum = Math.round((item.revenue / monthRevenueLastYear.revenue - 1) * 10000);
          } else {
            growthNum = 0;
          }
          growth = (growthNum / 100).toFixed(2);
          return { ...item, growth };
        })
        .filter(item => {
          // 过滤额外的第1年数据（用于计算月盈利年增长率）
          return dayjs(`${item.revenue_year}-${item.revenue_month}`) >= dayjs(filterTimeRange[0]);
        });
        setData(StockMonthRevenueDataWidthGrowth);
      })
      .catch(err => {
        setError(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [stockId, filterTimeRange]);

  return { data, loading, error };
} 