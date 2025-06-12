
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Camera, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

const WebViewContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [redirectError, setRedirectError] = useState(false);
  const { hasPermission, requestPermissions, isSupported } = useCamera();

  // Try different URL patterns to avoid redirect loops
  const getErpUrl = (attempt: number = 0) => {
    const baseUrl = 'http://erp.beryl-solutions.com';
    const patterns = [
      `${baseUrl}/web/login?redirect=false`,
      `${baseUrl}/web?redirect=false`,
      `${baseUrl}?mobile=1&no_redirect=1`,
      `${baseUrl}/web/database/selector`,
      baseUrl
    ];
    return patterns[attempt % patterns.length];
  };

  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // Setup message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL('http://erp.beryl-solutions.com').origin) return;
      
      if (event.data.type === 'CAMERA_REQUEST') {
        handleCameraRequest();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Enhanced iframe settings for ERP systems
  useEffect(() => {
    if (iframeRef.current && isNative) {
      const iframe = iframeRef.current;
      
      // Handle load events
      iframe.onload = () => {
        console.log('ERP iframe loaded, checking for redirect loops');
        
        try {
          const currentUrl = iframe.contentWindow?.location?.href;
          if (currentUrl && currentUrl.includes('web/database/selector')) {
            console.log('Detected database selector page');
            // Try to navigate to web interface directly
            setTimeout(() => {
              if (iframe.contentWindow) {
                iframe.contentWindow.location.href = 'http://erp.beryl-solutions.com/web?db=Nanco';
              }
            }, 2000);
          }
        } catch (e) {
          console.log('Cross-origin restrictions prevent URL inspection');
        }
        
        handleLoad();
      };

      // Handle errors including redirect loops
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
      iframeRef.current.contentWindow.postMessage({
        type: 'CAMERA_AVAILABLE'
      }, 'http://erp.beryl-solutions.com');
    }
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
        }, 'http://erp.beryl-solutions.com');
      }, 1000);
    }
  };

  const handleError = () => {
    console.error('Failed to load ERP site, attempt:', connectionAttempts + 1);
    setIsLoading(false);
    setHasError(true);
    
    // Check if this might be a redirect error
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
      // Use different URL pattern based on attempt count
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
      // Try direct database URL
      iframeRef.current.src = `http://erp.beryl-solutions.com/web?db=Nanco&t=${Date.now()}`;
    }
  };

  const initializeCameraPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      toast.success('Camera permissions granted');
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'CAMERA_AVAILABLE',
          hasPermission: true
        }, 'http://erp.beryl-solutions.com');
      }
    } else {
      toast.error('Camera permissions are required for full functionality');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              hasError ? 'bg-destructive' : 
              isLoading ? 'bg-yellow-500' : 
              'bg-green-500'
            }`} />
            <span className="text-sm font-medium">
              {hasError ? (redirectError ? 'Redirect Error' : 'Error') : 
               isLoading ? 'Loading' : 'Connected'}
            </span>
          </div>
          {isNative && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Native App
            </span>
          )}
          {connectionAttempts > 0 && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              Attempt {connectionAttempts + 1}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={initializeCameraPermissions}
              disabled={hasPermission === true}
            >
              <Camera className="w-4 h-4 mr-1" />
              {hasPermission ? 'Camera Ready' : 'Enable Camera'}
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={refreshPage}>
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Permission Notice */}
      {isSupported && hasPermission === false && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Camera className="w-4 h-4" />
            <span className="text-sm">
              Camera permissions are required for full ERP functionality
            </span>
          </div>
        </div>
      )}

      {/* Redirect Error Notice */}
      {redirectError && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">
              Redirect loop detected. The ERP server may be misconfigured for mobile access.
            </span>
          </div>
        </div>
      )}

      {/* Native App Notice */}
      {isNative && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Globe className="w-4 h-4" />
            <span className="text-sm">
              Running in native app mode - Enhanced ERP navigation enabled
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative">
        {hasError ? (
          <Card className="m-4 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">
              {redirectError ? 'Redirect Loop Error' : 'Connection Error'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {redirectError 
                ? 'The ERP system is redirecting too many times. This usually happens when the server doesn\'t recognize mobile browsers properly.'
                : 'Unable to load the ERP system. This might be due to server issues or network connectivity.'
              }
            </p>
            <div className="space-y-2">
              <Button onClick={refreshPage} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Different URL (Attempt {connectionAttempts + 1})
              </Button>
              {redirectError && (
                <Button onClick={tryDirectDatabase} variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Try Direct Database Access
                </Button>
              )}
              <Button onClick={openInNewTab} variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in {isNative ? 'System Browser' : 'New Tab'}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading ERP System...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {connectionAttempts > 0 ? `Trying alternative URL (${connectionAttempts + 1})` : 'Configuring for optimal navigation'}
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
