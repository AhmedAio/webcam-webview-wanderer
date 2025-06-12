
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
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: '#ffffff',
    // Specific settings for Odoo/ERP navigation
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    appendUserAgent: null,
    // Enhanced WebView settings for ERP systems
    webViewSettings: {
      javaScriptEnabled: true,
      domStorageEnabled: true,
      allowFileAccess: true,
      allowContentAccess: true,
      allowFileAccessFromFileURLs: true,
      allowUniversalAccessFromFileURLs: true,
      mediaPlaybackRequiresUserGesture: false,
      mixedContentMode: 0, // MIXED_CONTENT_ALWAYS_ALLOW
      cacheMode: -1 // LOAD_DEFAULT
    },
    allowNavigation: [
      'erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com',
      'https://erp.beryl-solutions.com',
      '*'
    ]
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    // Enhanced settings for ERP navigation
    preferredContentMode: 'mobile',
    allowNavigation: [
      'erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com', 
      'https://erp.beryl-solutions.com',
      '*'
    ]
  }
};

export default config;
