
// import { CapacitorConfig } from '@capacitor/core';
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b020ad859be4451c9db6c43df2a44a67',
  appName: 'ERP Mobile App',
  webDir: 'dist',
  server: {
    url: 'http://erp.beryl-solutions.com', // use your actual Odoo URL
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
