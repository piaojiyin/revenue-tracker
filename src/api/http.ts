import { useTokenStore } from "../store/tokenStore";

// 全局toast提示（非hook环境下的hack）
function showGlobalToast(
  msg: string,
  severity: "error" | "success" | "info" | "warning" = "error"
) {
  if (typeof window !== "undefined" && (window as any).showToast) {
    (window as any).showToast(msg, severity);
  }
}

// 登录API封装，前端只请求本地/api/login
export async function loginApi() {
  const res = await fetch("/api/login", { method: "POST" });
  return res.json();
}

// 通用fetch封装，自动带token（如有），统一异常处理，401自动刷新token重试
// 新增：支持 get/post 参数自动格式化，自动返回 res.json
// contentType: 'json' | 'form'，默认 'json'
export async function apiFetch(
  url: string,
  options: RequestInit & {
    params?: Record<string, any>;
    data?: any;
    contentType?: "json" | "form";
  } = {}
) {
  const token = useTokenStore.getState().token;
  let { params, data, contentType = "json", ...restOptions } = options as any;
  let finalUrl = url;
  const headers: Record<string, string> = {
    ...(restOptions.headers instanceof Headers
      ? Object.fromEntries(restOptions.headers.entries())
      : (restOptions.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // 处理 GET 请求参数
  if (params && restOptions.method?.toUpperCase() === "GET") {
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryString;
    }
  }
  // 处理 POST/PUT 请求体
  if (
    data &&
    ["POST", "PUT", "PATCH"].includes((restOptions.method || "").toUpperCase())
  ) {
    if (contentType === "form") {
      // FormData
      if (!(data instanceof FormData)) {
        const form = new URLSearchParams();
        Object.entries(data).forEach(([k, v]) => form.append(k, v as any));
        data = form;
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      restOptions.body = data.toString();
    } else {
      // 默认 JSON
      headers["Content-Type"] = "application/json";
      restOptions.body = JSON.stringify(data);
    }
  }
  try {
    let response = await fetch(finalUrl, { ...restOptions, headers });
    if (response.status === 401) {
      // 自动刷新token
      const loginData = await loginApi();
      if (loginData.status === 200 && loginData.token) {
        useTokenStore.getState().setToken(loginData.token);
        headers["Authorization"] = `Bearer ${loginData.token}`;
        response = await fetch(finalUrl, { ...restOptions, headers });
      }
    }
    // 自动返回 json
    const result = await response.json();
    if (!response.ok) {
      showGlobalToast(
        `API请求失败: ${response.status} ${response.statusText} - ${result?.msg || JSON.stringify(result)}`,
        "error"
      );
      throw new Error(
        `API请求失败: ${response.status} ${response.statusText} - ${result?.msg || JSON.stringify(result)}`
      );
    }
    if (result && result.status !== 200) {
      showGlobalToast(result.msg || "接口返回异常", "error");
      throw new Error(result.msg || "接口返回异常");
    }
    return result;
  } catch (error: any) {
    showGlobalToast(error?.message || "网络异常", "error");
    throw new Error(`网络异常: ${error?.message || error}`);
  }
}
