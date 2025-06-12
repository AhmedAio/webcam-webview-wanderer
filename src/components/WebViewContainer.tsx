
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Camera, ExternalLink, Globe } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';

const WebViewContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const { hasPermission, requestPermissions, isSupported } = useCamera();

  const ERP_URL = 'http://erp.beryl-solutions.com';
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // Setup message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(ERP_URL).origin) return;
      
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
      
      // Force reload with cache bypass for ERP systems
      iframe.onload = () => {
        console.log('ERP iframe loaded, injecting navigation fixes');
        
        // Inject JavaScript to handle ERP navigation
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const script = iframeDoc.createElement('script');
            script.textContent = `
              // Override form submissions to stay in iframe
              document.addEventListener('DOMContentLoaded', function() {
                const forms = document.querySelectorAll('form');
                forms.forEach(form => {
                  if (!form.target) {
                    form.target = '_self';
                  }
                });
                
                // Override link navigation
                const links = document.querySelectorAll('a');
                links.forEach(link => {
                  if (!link.target && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
                    link.target = '_self';
                  }
                });
              });
            `;
            iframeDoc.head.appendChild(script);
          }
        } catch (e) {
          console.log('Cross-origin restrictions prevent script injection, relying on sandbox settings');
        }
        
        handleLoad();
      };
    }
  }, [isNative]);

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
      }, ERP_URL);
    }
  };

  const handleLoad = () => {
    console.log('ERP site loaded successfully');
    setIsLoading(false);
    setHasError(false);
    setConnectionAttempts(0);
    
    if (iframeRef.current?.contentWindow) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'CAMERA_AVAILABLE',
          hasPermission: hasPermission
        }, ERP_URL);
      }, 1000);
    }
  };

  const handleError = () => {
    console.error('Failed to load ERP site');
    setIsLoading(false);
    setHasError(true);
    setConnectionAttempts(prev => prev + 1);
    toast.error('Failed to load ERP system');
  };

  const refreshPage = () => {
    console.log('Refreshing ERP site with cache bypass');
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      // Force complete reload with cache bypass
      const timestamp = Date.now();
      iframeRef.current.src = `${ERP_URL}?t=${timestamp}&cache=false`;
    }
  };

  const openInNewTab = () => {
    if (isNative) {
      window.open(ERP_URL, '_system');
    } else {
      window.open(ERP_URL, '_blank', 'noopener,noreferrer');
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
        }, ERP_URL);
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
            <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-destructive' : isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span className="text-sm font-medium">
              {hasError ? 'Error' : isLoading ? 'Loading' : 'Connected'}
            </span>
          </div>
          {isNative && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Native App
            </span>
          )}
          {connectionAttempts > 0 && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              Attempt {connectionAttempts}
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
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load the ERP system. This might be due to server issues or network connectivity.
            </p>
            <div className="space-y-2">
              <Button onClick={refreshPage} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
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
                  <p className="text-xs text-muted-foreground mt-1">Configuring for optimal navigation</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={`${ERP_URL}?mobile=1&t=${Date.now()}`}
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
