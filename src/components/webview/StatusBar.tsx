import { RefreshCw, Camera, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ErpConfig } from '@/utils/erpUrls';

interface StatusBarProps {
  hasError: boolean;
  isLoading: boolean;
  isNative: boolean;
  connectionAttempts: number;
  redirectError: boolean;
  isSupported: boolean;
  hasPermission: boolean | null;
  currentConfig: ErpConfig;
  onRefresh: () => void;
  onOpenExternal: () => void;
  onInitializeCamera: () => void;
  onShowConfigSelector: () => void;
}

const StatusBar = ({
  hasError,
  isLoading,
  isNative,
  connectionAttempts,
  redirectError,
  isSupported,
  hasPermission,
  currentConfig,
  onRefresh,
  onOpenExternal,
  onInitializeCamera,
  onShowConfigSelector
}: StatusBarProps) => {
  const usingFallback = isUsingFallbackPatterns();
  
  return (
    <div className="flex items-center justify-between p-4 bg-card border-b">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            hasError ? 'bg-destructive' : 
            isLoading ? 'bg-yellow-500' : 
            'bg-green-500'
          }`} />
          <span className="text-sm font-medium">
            {hasError ? (redirectError ? 'Config Error' : 'Error') : 
             isLoading ? 'Loading' : 'Connected'}
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {currentConfig.name}
        </span>
        {isNative && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Native
          </span>
        )}
        {connectionAttempts > 0 && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
            {usingFallback ? 'Fallback ' : ''}Pattern {connectionAttempts + 1}
          </span>
        )}
        {usingFallback && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            Alt Patterns
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowConfigSelector}
        >
          <Settings className="w-4 h-4" />
        </Button>

        {isSupported && (
          <Button
            variant="outline"
            size="sm"
            onClick={onInitializeCamera}
            disabled={hasPermission === true}
          >
            <Camera className="w-4 h-4 mr-1" />
            {hasPermission ? 'Ready' : 'Camera'}
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onOpenExternal}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
