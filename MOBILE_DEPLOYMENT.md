# Mobile App Deployment Instructions

This project is configured as a Capacitor mobile app that can be deployed to iOS and Android devices with enhanced ERP/Odoo navigation support and redirect loop prevention.

## Prerequisites

- Node.js and npm installed
- Android Studio (for Android deployment)
- Xcode (for iOS deployment, Mac only)

## Setup Instructions

1. **Export and Clone the Project**
   - Click "Export to Github" button in Lovable
   - Clone your repository locally:
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Mobile Platforms**
   ```bash
   # Add Android platform
   npx cap add android
   
   # Add iOS platform (Mac only)
   npx cap add ios
   ```

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Sync with Native Platforms**
   ```bash
   npx cap sync
   ```

6. **Run on Device/Emulator**
   ```bash
   # For Android
   npx cap run android
   
   # For iOS (Mac only)
   npx cap run ios
   ```

## Important: After Code Changes

Whenever you make changes to the configuration or pull updates from GitHub:

1. **Build the project**: `npm run build`
2. **Sync changes**: `npx cap sync`
3. **Run the app**: `npx cap run android` or `npx cap run ios`

## Development vs Production Configuration

### For Local Development (Mobile Testing)
The current configuration is set up for local mobile development where the app runs from built files. This avoids the `ERR_NAME_NOT_RESOLVED` error you might see when trying to connect to Lovable's development server from a mobile device.

### For Live Development (Web Testing)
If you want to test with live reload from Lovable during development, you can temporarily add this to `capacitor.config.ts`:

```typescript
server: {
  url: 'https://b020ad85-9be4-451c-9db6-c43df2a44a67.lovableproject.com?forceHideBadge=true',
  cleartext: true
}
```

**Note**: Remove the server configuration before building for production deployment.

## ERP/Odoo Navigation Fixes

The app now includes specific fixes for ERP/Odoo navigation issues and redirect loop prevention:

- **Redirect Loop Prevention**: Multiple URL patterns to avoid infinite redirects
- **Enhanced WebView Settings**: Configured for optimal ERP system compatibility
- **Custom User Agent**: Set to mobile browser for better compatibility
- **Cache Management**: No-cache mode to prevent redirect loops
- **Database Direct Access**: Fallback option for direct database connection
- **Mixed Content Support**: Full HTTP content support in native app

## Features in Mobile App

- **HTTP Content Support**: Full support for HTTP ERP systems without mixed content errors
- **Redirect Loop Handling**: Automatic detection and prevention of redirect loops
- **Multiple URL Patterns**: Tries different URL formats if redirects occur
- **Enhanced Navigation**: Optimized iframe settings for ERP/Odoo page navigation
- **Camera Integration**: Native camera access with proper permission handling
- **External URL Navigation**: Configured to allow navigation to the ERP domain
- **Offline Capability**: The app can work offline and cache content
- **Native Navigation**: Better user experience with native navigation
- **Form Handling**: Proper form submission handling for ERP workflows

## Troubleshooting ERP Navigation Issues

### Redirect Loop Errors (ERR_TOO_MANY_REDIRECTS)

If you see "ERR_TOO_MANY_REDIRECTS":

1. **Try Alternative URLs**: The app automatically tries different URL patterns
2. **Use Direct Database Access**: Click "Try Direct Database Access" button
3. **Clear App Data**: Uninstall and reinstall the app to clear all cached data
4. **Check ERP Server Configuration**: The server might need mobile browser detection fixes
5. **Test in System Browser**: Use "Open in System Browser" to test if the issue is ERP-specific

### General Navigation Issues

1. **Check ERP Server**: Verify the ERP server at erp.beryl-solutions.com is accessible
2. **Network Issues**: Ensure stable internet connection
3. **Server Configuration**: The ERP server might need to allow iframe embedding
4. **Browser Test**: Try opening the ERP URL directly in the device's browser

## Android Specific Settings

- Mixed content allowed with `mixedContentMode: 0`
- Cache disabled with `cacheMode: 2` to prevent redirect loops
- Enhanced WebView settings for JavaScript and DOM storage
- Custom user agent for better ERP compatibility
- File access permissions for full functionality

## iOS Specific Settings

- Content mode set to mobile for better ERP rendering
- Link preview disabled for smoother navigation
- External URL navigation configured
- WebView debugging enabled for troubleshooting

## Development Workflow

When making changes to the code:

1. Make your changes in the web version
2. Run `npm run build`
3. Run `npx cap sync` to update the native app
4. Test on device/emulator

## Configuration Details

The app is specifically configured for ERP/Odoo systems with redirect prevention:
- HTTP content allowed with cleartext traffic
- Enhanced iframe sandbox permissions for ERP functionality
- Multiple URL pattern fallbacks for redirect loop prevention
- Cache bypass for real-time ERP updates
- Mobile-optimized user agent string
- Database selector page detection and handling

## URL Patterns Used

The app tries these URL patterns in order to avoid redirects:
1. `http://erp.beryl-solutions.com/web/login?redirect=false`
2. `http://erp.beryl-solutions.com/web?redirect=false`
3. `http://erp.beryl-solutions.com?mobile=1&no_redirect=1`
4. `http://erp.beryl-solutions.com/web/database/selector`
5. `http://erp.beryl-solutions.com` (fallback)

## Important Notes

- The app includes specific fixes for Odoo/ERP redirect loops based on Stack Overflow solutions
- WebView settings are optimized for ERP system compatibility
- Redirect loop detection automatically tries alternative URLs
- Navigation issues common with ERP systems are addressed through enhanced iframe configuration
- The app can detect database selector pages and attempt direct navigation
