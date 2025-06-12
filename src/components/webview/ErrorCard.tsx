
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Globe, ExternalLink } from 'lucide-react';

interface ErrorCardProps {
  redirectError: boolean;
  connectionAttempts: number;
  isNative: boolean;
  onRefresh: () => void;
  onTryDirectDatabase: () => void;
  onOpenExternal: () => void;
}

const ErrorCard = ({
  redirectError,
  connectionAttempts,
  isNative,
  onRefresh,
  onTryDirectDatabase,
  onOpenExternal
}: ErrorCardProps) => {
  return (
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
        <Button onClick={onRefresh} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Different URL (Attempt {connectionAttempts + 1})
        </Button>
        {redirectError && (
          <Button onClick={onTryDirectDatabase} variant="outline" className="w-full">
            <Globe className="w-4 h-4 mr-2" />
            Try Direct Database Access
          </Button>
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
