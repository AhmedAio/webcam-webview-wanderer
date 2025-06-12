
// import { CapacitorConfig } from '@capacitor/core';
import { CapacitorConfig } from '@capacitor/cli';




const capacitorConfig: CapacitorConfig = {
  appId: 'app.lovable.b020ad859be4451c9db6c43df2a44a67',
  appName: 'ERP Mobile App',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com/web?db=Nanco',
      'https://erp.beryl-solutions.com'
    ]
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
    webContentsDebuggingEnabled: true,
    // Add more permissive settings for webview
    appendUserAgent: 'CapacitorWebView',
    backgroundColor: '#ffffff',
    }
    // Allow navigation to external URLs
  };

export default capacitorConfig;
