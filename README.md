# 🌎 TastyTrade 

Americans waste roughly $400 billion each year on food. <br>
Worldwide, food waste accounts for 11% of the world's greenhouse gas emissions! 

TastyTrade is a **react-native,** food-sharing app with a goal to help <br>
reduce the hundreds of billions of pounds of food waste occurring globally.


## Features
#### &nbsp;&nbsp;&nbsp; • Location-based Food Posts!
#### &nbsp;&nbsp;&nbsp; • Google Authentication
#### &nbsp;&nbsp;&nbsp; • 1:1 Chats

## Requirements
- Install [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
  <br><br>
- Make sure to put the .env file in the project directory after retrieving it from a safe location <br>
(You'll need to make a [firebase project](https://console.firebase.google.com/) off of this repo).
<br><br>
Sample .env file:
```
# No Quotes.
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_AUTH_DOMAIN=
EXPO_PUBLIC_PROJECT_ID=
EXPO_PUBLIC_STORAGE_BUCKET=
EXPO_PUBLIC_MESSAGING_SENDER_ID=
EXPO_PUBLIC_APP_ID=
EXPO_PUBLIC_MEASUREMENT_ID=
EXPO_PUBLIC_ANDROID_CLIENT_ID=
EXPO_PUBLIC_WEB_CLIENT_ID=
```
  
- EAS Account (You'll need to sign in inside a terminal).

## Installation

1. Install the EAS client and Expo globally.
```bash
      npm install --global eas-cli
      npm install --global expo
   ```

2. Install dependencies using NPM:
```bash
   npm install
   ```

## Starting the application
Using android emulator or physical device (AVD [Installable through Android Studio]):
```bash
   eas build --profile development --platform android
   npx expo start --android
   press
   ```

EAS will build an Android APK on the cloud, which you can then download to your mobile device through the QR code.
Connect your mobile device with a cable, and the app should connect to the expo server.

Otherwise, if your emulator is open, it should automatically connect to the app.