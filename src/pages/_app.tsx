import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useTokenStore } from '../store/tokenStore';
import { loginApi } from '../api/http';
import { GlobalToastProvider } from '../components/GlobalToast';

function MyApp({ Component, pageProps }: AppProps) {
  const setToken = useTokenStore((state) => state.setToken);

  useEffect(() => {
    if (!useTokenStore.getState().token) {
      const login = async () => {
        const data = await loginApi();
        if (data.status === 200 && data.token) {
          setToken(data.token);
        }
      };
      login();
    }
  }, [setToken]);

  return (
    <GlobalToastProvider>
      <CssBaseline />
      <div style={{ minHeight: '100vh', background: '#ededed' }}>
        <Component {...pageProps} />
      </div>
    </GlobalToastProvider>
  );
}

export default MyApp; 