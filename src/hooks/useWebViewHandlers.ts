
import { useRef } from 'react';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { 
  getErpUrl, 
  getCurrentConfig, 
  getNextConfig,
  switchToFallbackPatterns,
  isUsingFallbackPatterns,
  getCurrentPatternCount,
  getNetworkErrorSolution
} from '@/utils/erpUrls';

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

  const detectNetworkError = (url: string) => {
    // Check for common ERP network errors in the URL or iframe state
    if (url.includes('ERR_BLOCKED_BY_RESPONSE')) return 'ERR_BLOCKED_BY_RESPONSE';
    if (url.includes('ERR_TOO_MANY_REDIRECTS')) return 'ERR_TOO_MANY_REDIRECTS';
    if (url.includes('ERR_NAME_NOT_RESOLVED')) return 'ERR_NAME_NOT_RESOLVED';
    return 'UNKNOWN_ERROR';
  };

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
    const maxPatterns = getCurrentPatternCount();
    
    console.error('Failed to load ERP site, attempt:', connectionAttempts + 1, 'Config:', currentConfig.name);
    setIsLoading(false);
    setHasError(true);
    
    // Try to detect the specific network error
    const currentUrl = iframeRef.current?.src || '';
    const errorType = detectNetworkError(currentUrl);
    const errorSolution = getNetworkErrorSolution(errorType);
    
    console.log('Network error detected:', errorType, 'Solution:', errorSolution);
    
    // If we've tried all regular patterns, try fallback patterns
    if (connectionAttempts >= maxPatterns - 1) {
      if (!isUsingFallbackPatterns() && switchToFallbackPatterns()) {
        toast.error(`${errorSolution} - trying fallback patterns`);
        setConnectionAttempts(0);
        return;
      }
      
      // If we've tried all patterns (including fallbacks), switch to next config
      setRedirectError(true);
      const nextConfig = getNextConfig();
      toast.error(`Switching to ${nextConfig.name} - ${currentConfig.name} failed`);
      setConnectionAttempts(0);
    } else {
      toast.error(`${errorSolution} - trying pattern ${connectionAttempts + 2}`);
      setConnectionAttempts(prev => prev + 1);
    }
  };

  const refreshPage = () => {
    const currentConfig = getCurrentConfig();
    console.log('Refreshing ERP site, attempt:', connectionAttempts, 'Config:', currentConfig.name);
    console.log('Using fallback patterns:', isUsingFallbackPatterns());
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
      // Try multiple database access patterns
      const dbPatterns = [
        `${currentConfig.baseUrl}/web?db=demo&redirect=false&mobile=1`,
        `${currentConfig.baseUrl}/web?db=demo&mobile=1`,
        `${currentConfig.baseUrl}/login?db=demo`,
        `${currentConfig.baseUrl}/web/database/manager`
      ];
      
      const urlToTry = dbPatterns[connectionAttempts % dbPatterns.length];
      console.log('Trying direct database URL:', urlToTry);
      iframeRef.current.src = `${urlToTry}&t=${Date.now()}`;
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
