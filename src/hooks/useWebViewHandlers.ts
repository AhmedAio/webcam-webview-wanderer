
import { useRef } from 'react';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { getErpUrl } from '@/utils/erpUrls';

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
        }, 'http://erp.beryl-solutions.com');
      }, 1000);
    }
  };

  const handleError = () => {
    console.error('Failed to load ERP site, attempt:', connectionAttempts + 1);
    setIsLoading(false);
    setHasError(true);
    
    if (connectionAttempts >= 2) {
      setRedirectError(true);
      toast.error('Redirect loop detected - trying alternative URL');
    } else {
      toast.error('Failed to load ERP system');
    }
    
    setConnectionAttempts(prev => prev + 1);
  };

  const refreshPage = () => {
    console.log('Refreshing ERP site with redirect prevention, attempt:', connectionAttempts);
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
    console.log('Trying direct database access');
    setIsLoading(true);
    setHasError(false);
    setRedirectError(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = `http://erp.beryl-solutions.com/web?db=Nanco&t=${Date.now()}`;
    }
  };

  return {
    iframeRef,
    isNative,
    handleLoad,
    handleError,
    refreshPage,
    openInNewTab,
    tryDirectDatabase
  };
};
