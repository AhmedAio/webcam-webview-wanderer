
# Mobile App Deployment Instructions

This project is configured as a Capacitor mobile app that can be deployed to iOS and Android devices with enhanced ERP/Odoo navigation support.

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

## ERP/Odoo Navigation Fixes

The app now includes specific fixes for ERP/Odoo navigation issues:

- **Enhanced WebView Settings**: Configured for optimal ERP system compatibility
- **Custom User Agent**: Set to mobile browser for better compatibility
- **Navigation Overrides**: JavaScript injection to handle form submissions and links
- **Cache Management**: Force reload with cache bypass for ERP updates
- **Mixed Content Support**: Full HTTP content support in native app

## Features in Mobile App

- **HTTP Content Support**: Full support for HTTP ERP systems without mixed content errors
- **Enhanced Navigation**: Optimized iframe settings for ERP/Odoo page navigation
- **Camera Integration**: Native camera access with proper permission handling
- **External URL Navigation**: Configured to allow navigation to the ERP domain
- **Offline Capability**: The app can work offline and cache content
- **Native Navigation**: Better user experience with native navigation
- **Form Handling**: Proper form submission handling for ERP workflows

## Troubleshooting ERP Navigation Issues

If you're still experiencing navigation issues:

1. **Clear App Data**: Uninstall and reinstall the app to clear all cached data
2. **Check ERP Server**: Verify the ERP server at erp.beryl-solutions.com is accessible
3. **Network Issues**: Ensure stable internet connection
4. **Server Configuration**: The ERP server might need to allow iframe embedding
5. **Browser Test**: Try opening the ERP URL directly in the device's browser

## Android Specific Settings

- Mixed content allowed with `mixedContentMode: 0`
- Enhanced WebView settings for JavaScript and DOM storage
- Custom user agent for better ERP compatibility
- File access permissions for full functionality

## iOS Specific Settings

- Content mode set to mobile for better ERP rendering
- Link preview disabled for smoother navigation
- External URL navigation configured

## Development Workflow

When making changes to the code:

1. Make your changes in the web version
2. Run `npm run build`
3. Run `npx cap sync` to update the native app
4. Test on device/emulator

## Configuration Details

The app is specifically configured for ERP/Odoo systems:
- HTTP content allowed with cleartext traffic
- Enhanced iframe sandbox permissions for ERP functionality
- JavaScript injection for navigation fixes
- Cache bypass for real-time ERP updates
- Mobile-optimized user agent string

## Important Notes

- The app includes specific fixes for Odoo/ERP navigation based on Stack Overflow solutions
- WebView settings are optimized for ERP system compatibility
- Mixed content is fully supported in the native app environment
- Navigation issues common with ERP systems are addressed through enhanced iframe configuration
