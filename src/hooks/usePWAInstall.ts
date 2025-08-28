import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __lph_deferredPrompt?: any;
  }
}

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState<boolean>(typeof window !== 'undefined' && !!window.__lph_deferredPrompt);

  useEffect(() => {
    const onCanInstall = () => setCanInstall(true);
    const onInstalled = () => setCanInstall(false);
    window.addEventListener('lph:can-install', onCanInstall);
    window.addEventListener('appinstalled', onInstalled as EventListener);
    return () => {
      window.removeEventListener('lph:can-install', onCanInstall);
      window.removeEventListener('appinstalled', onInstalled as EventListener);
    };
  }, []);

  const promptInstall = async () => {
    const dp = window.__lph_deferredPrompt;
    if (!dp) return false;
    dp.prompt();
    const choice = await dp.userChoice;
    window.__lph_deferredPrompt = undefined;
    setCanInstall(false);
    return choice?.outcome === 'accepted';
  };

  return { canInstall, promptInstall } as const;
}

