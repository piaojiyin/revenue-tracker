import { useState, useEffect } from 'react';
import { getStockInfoApi } from '../api/request';
import { StockEntity } from '../types/stock';

export function useStockInfo(token: string | undefined) {
  const [data, setData] = useState<StockEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    getStockInfoApi()
      .then(res => setData(res.data || []))
      .catch(err => {
        setError(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { data, loading, error };
} 