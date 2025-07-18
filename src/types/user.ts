/**
 * @description: 登入狀態
 * @interface TokenState
 * @property {string | null} token - 登入狀態
 * @property {(token: string) => void} setToken - 設定登入狀態
 */
export interface TokenState {
  token: string | null;
  setToken: (token: string) => void;
} 