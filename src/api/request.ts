// src/api/request.ts
import { apiFetch } from "./http";
import dayjs from "dayjs";
import { finMindApiRequestParams } from "../types/api";
const FINMIND_API_BASE = process.env.NEXT_PUBLIC_FINMIND_API_BASE;

// 获取台股總覽
export async function getStockInfoApi() {
  return apiFetch(`${FINMIND_API_BASE}/data`, {
    method: "GET",
    params: {
      // 台股總覽
      dataset: "TaiwanStockInfo",
      // data_id: '',
      // start_date: '',
      // end_date: dayjs().format("YYYY-MM-DD"),
    },
  });
}

// 获取月營收表
export async function getStockMonthRevenueApi(data: finMindApiRequestParams) {
  return apiFetch(`${FINMIND_API_BASE}/data`, {
    method: "GET",
    params: {
      // 月營收表
      ...data,
      dataset: "TaiwanStockMonthRevenue",
    },
  });
}
