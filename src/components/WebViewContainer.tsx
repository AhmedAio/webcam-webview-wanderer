
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Camera, Shield } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { toast } from 'sonner';

const WebViewContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { hasPermission, requestPermissions, isSupported } = useCamera();

  const ERP_URL = 'http://erp.beryl-solutions.com';

  useEffect(() => {
    // Setup message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the ERP domain
      if (event.origin !== new URL(ERP_URL).origin) return;
      
      if (event.data.type === 'CAMERA_REQUEST') {
        handleCameraRequest();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
    
    // Notify the iframe that camera is available
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CAMERA_AVAILABLE'
      }, ERP_URL);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    // Inject camera availability script
    if (iframeRef.current?.contentWindow) {
      const script = `
        window.addEventListener('load', function() {
          if (window.parent !== window) {
            window.parent.postMessage({type: 'CAMERA_REQUEST'}, '*');
          }
        });
      `;
      
      try {
        iframeRef.current.contentWindow.eval(script);
      } catch (error) {
        console.log('Could not inject script - cross-origin restrictions');
      }
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    toast.error('Failed to load ERP system');
  };

  const refreshPage = () => {
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      iframeRef.current.src = ERP_URL;
    }
  };

  const initializeCameraPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      toast.success('Camera permissions granted');
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
        </div>
      </div>

      {/* Permission Notice */}
      {isSupported && hasPermission === false && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Shield className="w-4 h-4" />
            <span className="text-sm">
              Camera permissions are required for full ERP functionality
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
              Unable to load the ERP system. Please check your connection and try again.
            </p>
            <Button onClick={refreshPage}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading ERP System...</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={ERP_URL}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
              allow="camera; microphone; geolocation"
              title="ERP System"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WebViewContainer;
