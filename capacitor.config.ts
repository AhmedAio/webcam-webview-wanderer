// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';





const capacitorConfig: CapacitorConfig = {
  appId: 'app.lovable.b020ad859be4451c9db6c43df2a44a67',
  appName: 'ERP Mobile App',
  webDir: 'dist',
=======
  // Remove server config for local mobile development - use built files instead
>>>>>>> 482a4e671b83d30192575f8e49263a7c9e28c37f
  plugins: {
    Camera: {
      permissions: ['camera']
    },
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
    // Updated user agent to prevent redirect loops
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    appendUserAgent: null,
    // Enhanced WebView settings for ERP systems with redirect handling
    webViewSettings: {
      javaScriptEnabled: true,
      domStorageEnabled: true,
      allowFileAccess: true,
      allowContentAccess: true,
      allowFileAccessFromFileURLs: true,
      allowUniversalAccessFromFileURLs: true,
      mediaPlaybackRequiresUserGesture: false,
      mixedContentMode: 0, // MIXED_CONTENT_ALWAYS_ALLOW
      cacheMode: 2, // LOAD_NO_CACHE to prevent redirect loops
      databaseEnabled: true,
      setSupportZoom: false,
      setBuiltInZoomControls: false,
      setDisplayZoomControls: false
    },
    allowNavigation: [
      'erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com',
      'https://erp.beryl-solutions.com',
      '*.beryl-solutions.com',
      '*'
    ]
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    // Enhanced settings for ERP navigation with redirect handling
    preferredContentMode: 'mobile',
    allowNavigation: [
      'erp.beryl-solutions.com',
      'http://erp.beryl-solutions.com', 
      'https://erp.beryl-solutions.com',
      '*.beryl-solutions.com',
      '*'
    ],
    webContentsDebuggingEnabled: true
  }
};
    }
    // Allow navigation to external URLs
  };

export default capacitorConfig;
