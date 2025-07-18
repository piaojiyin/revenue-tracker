import type { NextApiRequest, NextApiResponse } from "next";
import { apiFetch } from "../../api/http";

/**
 * 登录接口
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 账号密码仅在服务器端可见
  const user_id = process.env.FINMIND_USER_ID;
  const password = process.env.FINMIND_PASSWORD;
  const data = { user_id, password };
  const response = await apiFetch(`${process.env.NEXT_PUBLIC_FINMIND_API_URL}/login`, {
    method: "POST",
    data,
    contentType: "form",
  });
  res.status(200).json(response);
}
