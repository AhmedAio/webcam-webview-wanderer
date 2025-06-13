
import { useRef } from 'react';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { getErpUrl, getCurrentConfig, getNextConfig } from '@/utils/erpUrls';

export const useWebViewHandlers = (
  setIsLoading: (loading: boolean) => void,
  setHasError: (error: boolean) => void,
  setRedirectError: (error: boolean) => void,
  setConnectionAttempts: (attempts: number | ((prev: number) => number)) => void,
  connectionAttempts: number,
  hasPermission: boolean | null
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isNative = Capacitor.isNativePlatform();

  const handleLoad = () => {
    console.log('ERP site loaded successfully');
    setIsLoading(false);
    setHasError(false);
    setRedirectError(false);
    
    if (iframeRef.current?.contentWindow) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'CAMERA_AVAILABLE',
          hasPermission: hasPermission
        }, getCurrentConfig().baseUrl);
      }, 1000);
    }
  };

  const handleError = () => {
    const currentConfig = getCurrentConfig();
    console.error('Failed to load ERP site, attempt:', connectionAttempts + 1, 'Config:', currentConfig.name);
    setIsLoading(false);
    setHasError(true);
    
    if (connectionAttempts >= currentConfig.patterns.length - 1) {
      setRedirectError(true);
      const nextConfig = getNextConfig();
      toast.error(`Switching to ${nextConfig.name} - ${currentConfig.name} failed`);
      setConnectionAttempts(0);
    } else {
      toast.error(`Failed to load ERP system - trying pattern ${connectionAttempts + 2}`);
      setConnectionAttempts(prev => prev + 1);
    }
  };

  const refreshPage = () => {
    const currentConfig = getCurrentConfig();
    console.log('Refreshing ERP site, attempt:', connectionAttempts, 'Config:', currentConfig.name);
    setIsLoading(true);
    setHasError(false);
    setRedirectError(false);
    
    if (iframeRef.current) {
      const urlToTry = getErpUrl(connectionAttempts);
      console.log('Trying URL:', urlToTry);
      iframeRef.current.src = `${urlToTry}&t=${Date.now()}`;
    }
  };

  const openInNewTab = () => {
    const urlToOpen = getErpUrl(0);
    if (isNative) {
      window.open(urlToOpen, '_system');
    } else {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
  };

  const tryDirectDatabase = () => {
    const currentConfig = getCurrentConfig();
    console.log('Trying direct database access for:', currentConfig.name);
    setIsLoading(true);
    setHasError(false);
    setRedirectError(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = `${currentConfig.baseUrl}/web?db=demo&t=${Date.now()}`;
    }
  };

  const switchToConfig = (configIndex: number) => {
    console.log('Switching to config index:', configIndex);
    setConnectionAttempts(0);
    setIsLoading(true);
    setHasError(false);
    setRedirectError(false);
    
    if (iframeRef.current) {
      const urlToTry = getErpUrl(0, configIndex);
      console.log('Loading new config URL:', urlToTry);
      iframeRef.current.src = `${urlToTry}&t=${Date.now()}`;
    }
  };

  return {
    iframeRef,
    isNative,
    handleLoad,
    handleError,
    refreshPage,
    openInNewTab,
    tryDirectDatabase,
    switchToConfig
  };
};
