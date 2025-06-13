
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Globe, ExternalLink, Settings, Database } from 'lucide-react';
import type { ErpConfig } from '@/utils/erpUrls';
import { isUsingFallbackPatterns, getNetworkErrorSolution } from '@/utils/erpUrls';

interface ErrorCardProps {
  redirectError: boolean;
  connectionAttempts: number;
  isNative: boolean;
  currentConfig: ErpConfig;
  onRefresh: () => void;
  onTryDirectDatabase: () => void;
  onOpenExternal: () => void;
  onSwitchConfig: () => void;
}

const ErrorCard = ({
  redirectError,
  connectionAttempts,
  isNative,
  currentConfig,
  onRefresh,
  onTryDirectDatabase,
  onOpenExternal,
  onSwitchConfig
}: ErrorCardProps) => {
  const usingFallback = isUsingFallbackPatterns();
  
  return (
    <Card className="m-4 p-8 text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
      <h3 className="text-lg font-semibold mb-2">
        {redirectError ? 'Configuration Error' : 'Connection Error'}
      </h3>
      <p className="text-muted-foreground mb-2">
        {redirectError 
          ? `Unable to connect to ${currentConfig.name}. All URL patterns failed.`
          : `Cannot load ${currentConfig.name}. This might be due to server blocking mobile access or redirect loops.`
        }
      </p>
      <p className="text-xs text-muted-foreground mb-2">
        Current server: {currentConfig.baseUrl}
      </p>
      {usingFallback && (
        <p className="text-xs text-orange-600 mb-2">
          Using fallback patterns for network error resolution
        </p>
      )}
      <div className="space-y-2">
        <Button onClick={onRefresh} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try {usingFallback ? 'Fallback ' : ''}Pattern {connectionAttempts + 1}
        </Button>
        {redirectError && (
          <>
            <Button onClick={onTryDirectDatabase} variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Try Direct Database Access
            </Button>
            <Button onClick={onSwitchConfig} variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Switch Server Configuration
            </Button>
          </>
        )}
        <Button onClick={onOpenExternal} variant="outline" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in {isNative ? 'System Browser' : 'New Tab'}
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-lg text-left">
        <h4 className="text-sm font-medium mb-2">Common ERP Connection Issues:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• ERR_BLOCKED_BY_RESPONSE: Server blocking mobile access</li>
          <li>• ERR_TOO_MANY_REDIRECTS: Redirect loop in ERP system</li>
          <li>• Network connectivity or server configuration issues</li>
        </ul>
      </div>
    </Card>
  );
};

export default ErrorCard;
