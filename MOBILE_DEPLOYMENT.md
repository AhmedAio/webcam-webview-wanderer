
# Mobile App Deployment Instructions

This project is configured as a Capacitor mobile app that can be deployed to iOS and Android devices.

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

## Features in Mobile App

- **HTTP Content Support**: The mobile app allows loading HTTP content (erp.beryl-solutions.com) without mixed content errors
- **Enhanced Navigation**: Full iframe permissions allow proper page navigation within the ERP system
- **Camera Integration**: Native camera access with proper permission handling
- **External URL Navigation**: Configured to allow navigation to the ERP domain
- **Offline Capability**: The app can work offline and cache content
- **Native Navigation**: Better user experience with native navigation

## Troubleshooting Navigation Issues

If pages are still getting stuck after deployment:

1. **Check Network Connection**: Ensure stable internet connection
2. **Clear App Cache**: Uninstall and reinstall the app to clear any cached issues
3. **Check ERP Server**: The ERP server at erp.beryl-solutions.com might be experiencing issues
4. **Use System Browser**: Try opening the ERP URL directly in the device's browser to verify server availability

## Development Workflow

When making changes to the code:

1. Make your changes in the web version
2. Run `npm run build`
3. Run `npx cap sync` to update the native app
4. Test on device/emulator

## Configuration Details

The app is configured in `capacitor.config.ts` with:
- HTTP content allowed with cleartext traffic
- Camera permissions enabled
- External navigation allowed for ERP domain
- Enhanced iframe sandbox permissions
- Debugging enabled for development

## Android Specific Settings

- Mixed content allowed
- Web contents debugging enabled
- External URL navigation configured

## iOS Specific Settings

- Content inset automatic
- Link preview disabled
- External URL navigation configured
