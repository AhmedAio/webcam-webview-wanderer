
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
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      // Set up load handler
      iframe.onload = () => {
        console.log('Iframe loaded successfully');
        handleLoad();
      };

      // Set up error handler
      iframe.onerror = () => {
        console.error('Iframe failed to load');
        handleError();
      };

      // Add timeout to detect if iframe doesn't load
      const loadTimeout = setTimeout(() => {
        if (isLoading) {
          console.error('Iframe load timeout');
          handleError();
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(loadTimeout);
    }
  }, [connectionAttempts, isLoading]);

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
                  <p className="text-sm text-muted-foreground">Loading Website...</p>
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
              title="Website Viewer"
              loading="eager"
              // Minimal sandbox for better compatibility
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
              // Essential permissions only
              allow="camera; microphone; geolocation; fullscreen"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WebViewContainer;
