
import { Camera, Globe, AlertTriangle } from 'lucide-react';

interface NotificationBannersProps {
  isSupported: boolean;
  hasPermission: boolean | null;
  redirectError: boolean;
  isNative: boolean;
}

const NotificationBanners = ({
  isSupported,
  hasPermission,
  redirectError,
  isNative
}: NotificationBannersProps) => {
  return (
    <>
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
    </>
  );
};

export default NotificationBanners;
