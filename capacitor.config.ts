// capacitor.config.ts
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
    }
    // Allow navigation to external URLs
  };

export default capacitorConfig;
