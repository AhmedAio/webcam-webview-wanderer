
import { RefreshCw, Camera, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
  hasError: boolean;
  isLoading: boolean;
  isNative: boolean;
  connectionAttempts: number;
  redirectError: boolean;
  isSupported: boolean;
  hasPermission: boolean | null;
  onRefresh: () => void;
  onOpenExternal: () => void;
  onInitializeCamera: () => void;
}

const StatusBar = ({
  hasError,
  isLoading,
  isNative,
  connectionAttempts,
  redirectError,
  isSupported,
  hasPermission,
  onRefresh,
  onOpenExternal,
  onInitializeCamera
}: StatusBarProps) => {
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
            onClick={onInitializeCamera}
            disabled={hasPermission === true}
          >
            <Camera className="w-4 h-4 mr-1" />
            {hasPermission ? 'Camera Ready' : 'Enable Camera'}
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
