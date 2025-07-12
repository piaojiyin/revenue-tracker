import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenState } from '../types/user';

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'token-storage', // localStorage key
      partialize: (state) => ({ token: state.token }), // 只持久化 token 字段
    }
  )
); 