# TastyTrade 👋

This is a food-sharing app to reduce food waste!

## Requirements
Install NPM (Installation: [Link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

## Installation

1. Switch to ../frontend/tasty-trade folder (Using cd command) after cloning Repository

2. Install eas client and expo globally
```bash
      npm install --global eas-cli
      npm install --global expo
   ```

3. Install dependencies using NPM:
```bash
   npm install
   ```

## Starting the application
Using android emulator or physical device (AVD [Installable through Android Studio]):
```bash
   eas build --profile development --platform android
   npx expo start
   press a
   ```

EAS will build an android apk on the cloud, which you can then download to your mobile device through the QR code.
Connect your mobile device with a wire, and the app should connect to the expo server.

Otherwise, if your emulator is open, it should also connect to the expo server.