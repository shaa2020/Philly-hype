import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';
import { HelmetProvider } from 'react-helmet-async';
import { TenantProvider } from './context/TenantContext';

// Register the PWA service worker
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <TenantProvider>
        <App />
      </TenantProvider>
    </HelmetProvider>
  </StrictMode>,
);
