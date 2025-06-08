
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

## Features in Mobile App

- **HTTP Content Support**: The mobile app allows loading HTTP content (erp.beryl-solutions.com) without mixed content errors
- **Camera Integration**: Native camera access with proper permission handling
- **Offline Capability**: The app can work offline and cache content
- **Native Navigation**: Better user experience with native navigation

## Development Workflow

When making changes to the code:

1. Make your changes in the web version
2. Run `npm run build`
3. Run `npx cap sync` to update the native app
4. Test on device/emulator

## Troubleshooting

- If you encounter build errors, make sure all dependencies are installed
- For Android, ensure Android Studio and SDK are properly configured
- For iOS, ensure Xcode command line tools are installed
- Camera permissions are automatically requested when the app starts

## Configuration

The app is configured in `capacitor.config.ts` with:
- HTTP content allowed
- Camera permissions enabled
- Debugging enabled for development
