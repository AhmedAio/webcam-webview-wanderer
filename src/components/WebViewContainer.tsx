
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useWebViewHandlers } from '@/hooks/useWebViewHandlers';
import { getErpUrl, getCurrentConfig } from '@/utils/erpUrls';
import { toast } from 'sonner';
import StatusBar from '@/components/webview/StatusBar';
import NotificationBanners from '@/components/webview/NotificationBanners';
import ErrorCard from '@/components/webview/ErrorCard';
import ConfigSelector from '@/components/webview/ConfigSelector';

const WebViewContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [redirectError, setRedirectError] = useState(false);
  const [showConfigSelector, setShowConfigSelector] = useState(false);
  const { hasPermission, requestPermissions, isSupported } = useCamera();

  const {
    iframeRef,
    isNative,
    handleLoad,
    handleError,
    refreshPage,
    openInNewTab,
    tryDirectDatabase,
    switchToConfig
  } = useWebViewHandlers(
    setIsLoading,
    setHasError,
    setRedirectError,
    setConnectionAttempts,
    connectionAttempts,
    hasPermission
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const currentConfig = getCurrentConfig();
      if (event.origin !== new URL(currentConfig.baseUrl).origin) return;
      
      if (event.data.type === 'CAMERA_REQUEST') {
        handleCameraRequest();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current && isNative) {
      const iframe = iframeRef.current;
      
      iframe.onload = () => {
        console.log('ERP iframe loaded, checking for redirect loops');
        
        try {
          const currentUrl = iframe.contentWindow?.location?.href;
          if (currentUrl && currentUrl.includes('web/database/selector')) {
            console.log('Detected database selector page');
            setTimeout(() => {
              if (iframe.contentWindow) {
                const currentConfig = getCurrentConfig();
                iframe.contentWindow.location.href = `${currentConfig.baseUrl}/web?db=demo`;
              }
            }, 2000);
          }
        } catch (e) {
          console.log('Cross-origin restrictions prevent URL inspection');
        }
        
        handleLoad();
      };

      iframe.onerror = () => {
        console.error('Iframe error detected');
        handleError();
      };
    }
  }, [isNative, connectionAttempts]);

  const handleCameraRequest = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (granted) {
        toast.success('Camera permission granted');
      } else {
        toast.error('Camera permission denied');
        return;
      }
    }
    
    if (iframeRef.current?.contentWindow) {
      const currentConfig = getCurrentConfig();
      iframeRef.current.contentWindow.postMessage({
        type: 'CAMERA_AVAILABLE'
      }, currentConfig.baseUrl);
    }
  };

  const initializeCameraPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      toast.success('Camera permissions granted');
      if (iframeRef.current?.contentWindow) {
        const currentConfig = getCurrentConfig();
        iframeRef.current.contentWindow.postMessage({
          type: 'CAMERA_AVAILABLE',
          hasPermission: true
        }, currentConfig.baseUrl);
      }
    } else {
      toast.error('Camera permissions are required for full functionality');
    }
  };

  const handleConfigChange = (configIndex: number) => {
    switchToConfig(configIndex);
    setShowConfigSelector(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <StatusBar
        hasError={hasError}
        isLoading={isLoading}
        isNative={isNative}
        connectionAttempts={connectionAttempts}
        redirectError={redirectError}
        isSupported={isSupported}
        hasPermission={hasPermission}
        onRefresh={refreshPage}
        onOpenExternal={openInNewTab}
        onInitializeCamera={initializeCameraPermissions}
        onShowConfigSelector={() => setShowConfigSelector(!showConfigSelector)}
        currentConfig={getCurrentConfig()}
      />

      <NotificationBanners
        isSupported={isSupported}
        hasPermission={hasPermission}
        redirectError={redirectError}
        isNative={isNative}
      />

      {showConfigSelector && (
        <ConfigSelector
          onConfigChange={handleConfigChange}
          onRefresh={refreshPage}
        />
      )}

      <div className="flex-1 relative">
        {hasError ? (
          <ErrorCard
            redirectError={redirectError}
            connectionAttempts={connectionAttempts}
            isNative={isNative}
            currentConfig={getCurrentConfig()}
            onRefresh={refreshPage}
            onTryDirectDatabase={tryDirectDatabase}
            onOpenExternal={openInNewTab}
            onSwitchConfig={() => setShowConfigSelector(true)}
          />
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading ERP System...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {connectionAttempts > 0 
                      ? `Trying ${getCurrentConfig().name} pattern ${connectionAttempts + 1}`
                      : `Connecting to ${getCurrentConfig().name}`
                    }
                  </p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={getErpUrl(connectionAttempts)}
              className="w-full h-full border-0"
              onLoad={!isNative ? handleLoad : undefined}
              onError={handleError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-modals allow-orientation-lock allow-pointer-lock"
              allow="camera *; microphone *; geolocation *; fullscreen *; autoplay *; encrypted-media *; accelerometer *; gyroscope *; magnetometer *; payment *; usb *; web-share *; clipboard-read *; clipboard-write *"
              title="ERP System"
              loading="eager"
              referrerPolicy="unsafe-url"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WebViewContainer;
