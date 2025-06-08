
import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkCameraSupport();
    checkPermissions();
  }, []);

  const checkCameraSupport = () => {
    // Camera is supported on native platforms and modern web browsers
    setIsSupported(Capacitor.isNativePlatform() || !!navigator.mediaDevices?.getUserMedia);
  };

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      // For web, check if getUserMedia is available
      setHasPermission(!!navigator.mediaDevices?.getUserMedia);
      return;
    }

    try {
      const permissions = await Camera.checkPermissions();
      setHasPermission(permissions.camera === 'granted');
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setHasPermission(false);
    }
  };

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        return true;
      } catch (error) {
        console.error('Web camera permission denied:', error);
        setHasPermission(false);
        return false;
      }
    }

    try {
      const permissions = await Camera.requestPermissions();
      const granted = permissions.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      setHasPermission(false);
      return false;
    }
  };

  const takePicture = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      
      return image;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };

  return {
    hasPermission,
    isSupported,
    requestPermissions,
    takePicture,
    checkPermissions
  };
};
