/*
 * GlobalToast 组件
 * 用于全局消息提示（如操作成功、失败等）
 * 依赖 MUI Snackbar
 */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

type ToastContextType = {
  showToast: (msg: string, severity?: 'error' | 'success' | 'info' | 'warning') => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export const GlobalToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('info');

  const showToast = (message: string, sev: typeof severity = 'info') => {
    setMsg(message);
    setSeverity(sev);
    setOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <MuiAlert elevation={6} variant="filled" severity={severity} onClose={() => setOpen(false)}>
          {msg}
        </MuiAlert>
      </Snackbar>
    </ToastContext.Provider>
  );
}; 