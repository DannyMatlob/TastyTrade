# TastyTrade 👋

This is a food-sharing app to reduce food waste!

## Features
#### &nbsp;&nbsp;&nbsp; • Location-based Food Posts!
#### &nbsp;&nbsp;&nbsp; • Google Authentication
#### &nbsp;&nbsp;&nbsp; • 1:1 Chats

## Requirements
- Install NPM (Installation: [Link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
  <br><br/>
- Make sure to put the .env file in frontend/tasty-trade after retrieving it from a safe location
(You'll need to make a firebase project off of this repo).
  <br><br/>
- EAS Account (You'll need to sign in inside a terminal).

## Installation

1. Switch to ../frontend (Using cd command) after cloning Repository.
   <br><br/>
2. Install the EAS client and Expo globally.
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

EAS will build an Android APK on the cloud, which you can then download to your mobile device through the QR code.
Connect your mobile device with a cable, and the app should connect to the expo server.

Otherwise, if your emulator is open, it should automatically connect to the app.