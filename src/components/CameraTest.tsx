
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Image, AlertCircle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { toast } from 'sonner';

const CameraTest = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { hasPermission, takePicture, requestPermissions, isSupported } = useCamera();

  const handleTakePicture = async () => {
    try {
      const image = await takePicture();
      if (image?.webPath) {
        setCapturedImage(image.webPath);
        toast.success('Photo captured successfully!');
      }
    } catch (error) {
      toast.error('Failed to capture photo');
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    if (granted) {
      toast.success('Camera permission granted');
    } else {
      toast.error('Camera permission denied');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Camera Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Camera functionality is only available on mobile devices.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Camera Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            Camera Permission: {hasPermission ? 'Granted' : 'Not Granted'}
          </span>
        </div>

        {!hasPermission && (
          <Button onClick={handleRequestPermission} className="w-full">
            Request Camera Permission
          </Button>
        )}

        {hasPermission && (
          <Button onClick={handleTakePicture} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        )}

        {capturedImage && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">Captured Photo:</span>
            </div>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraTest;
