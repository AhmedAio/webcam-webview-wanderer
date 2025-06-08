
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.b020ad859be4451c9db6c43df2a44a67',
  appName: 'ERP Mobile App',
  webDir: 'dist',
  server: {
    url: 'https://b020ad85-9be4-451c-9db6-c43df2a44a67.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    },
    // Allow HTTP traffic in mobile app
    CapacitorHttp: {
      enabled: true
    }
  },
  // Enable cleartext traffic for HTTP content
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false
  }
};

export default config;
