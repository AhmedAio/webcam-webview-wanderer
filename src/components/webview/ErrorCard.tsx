
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Globe, ExternalLink, Settings } from 'lucide-react';
import type { ErpConfig } from '@/utils/erpUrls';

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
  return (
    <Card className="m-4 p-8 text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
      <h3 className="text-lg font-semibold mb-2">
        {redirectError ? 'Configuration Error' : 'Connection Error'}
      </h3>
      <p className="text-muted-foreground mb-2">
        {redirectError 
          ? `Unable to connect to ${currentConfig.name}. All URL patterns failed.`
          : `Cannot load ${currentConfig.name}. This might be due to server issues or network connectivity.`
        }
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Current server: {currentConfig.baseUrl}
      </p>
      <div className="space-y-2">
        <Button onClick={onRefresh} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Pattern {connectionAttempts + 1}
        </Button>
        {redirectError && (
          <>
            <Button onClick={onTryDirectDatabase} variant="outline" className="w-full">
              <Globe className="w-4 h-4 mr-2" />
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
    </Card>
  );
};

export default ErrorCard;
