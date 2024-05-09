Mobile app to send a config JSON file to the smart mirror via bluetooth.
Uses react-native-ble-manager for BLE functionality.

Docs for this bluetooth manager library:
http://innoveit.github.io/react-native-ble-manager/methods/#startoptions

Example project to refer to for getting bonded devices:
https://blog.logrocket.com/using-react-native-ble-manager-mobile-app/

# ----------

Description of functionality:

Pressing "enable bluetooth" from home screen will initialize the bluetooth manager. This might trigger some system popup for bluetooth permission.

Next screen has a button that checks for currently connected devices. It is assumed that the user will have paired to a device in their device settings, then will come back here.

MTU between the two devices can be negotiated up. But should be ok just to write data as multiple packets.

Upon a smart mirror device being found (as determined by UUID somehow?), or any device for now, the user can send it data via a form.

# ----------

Next steps:

- turns out that I need to be specifically establishing a connection with the device in my app! needs its own specific GATT session. refactor app to do this.
   - want to have it first check for system connected devices
   - then initialize a conneciion for the first one and retrieve services on it.
   - might repurpose the peripheral basic info thing to hold info about system devices, and have the extended info be for when an app-specific GATT is connected. or just keep as-is and use the deviceIsConnected attribute to be if the device is app connected.
- get retrieveServices working. call to provider for it is now no longer erroring. but keeps returning null.
   - I'm trying to add a delay on either side of the retrieveServices call, since I saw this in an example project. But my delays don't actually seem to be working.
   - Maybe there's an issue that I'm not creating a bond in my app specifically, and that could be a requirement for GATT stuff. I don't think so, though.
   - If all else fails, I can call the native code, instead of the library function. But I really don't want to do that.
- read the value out of a specific characteristic
- figure out how to encode/decode data being sent and read
- make sure there are no null types in the defice info structs. should only be using "default x info" in here, so that I don't have to deal will this null safety pain. maybe upon services descovery, if they come back as blank, set it to default. or maybe not worry about this for now.
- write data to a specific characteristic
- make the connecting happen in the app. so I don't have to use nrf connect to go from bonded -> connected.

- !!!!! blocked from here on, until we have the peripheral set up on the pi !!!!!

- decide on exact data format we'll be sending. for multiple characteristics probably.
- implement data sending protocol
- implement UI to send data to the device via a form submission
- hook up text box form to populate some JSON object, then send it off to to the peripheral
- smart navigation in the app, based on bluetooth state. when permissions are enabled, no need to show the screen for permissions. when a device is connected, can take them directly to the send data screen.

# ----------

Notes

What I learned about packet sizes:

The default data payload size for BLE is 20 bytes. The requestMTU function in the library initiates a negotiation process where both devices try to increase this packet size, all the way up to 512 bytes. Based on some forums reading, it sounds like rasbian and the raspi3 can do more than 20 byles MTU, but this probably requires some configuration. Packet size is a little bit irrelevant, according to prof.

A charactersitic can technically be larger than the MTU. And this could be one solution. Under the hood, libraries generally seem to handle this reassebling automatically - if one charactersitic write operation needs to get send over 3 packets.

Max characteristic size is still kinda unknown. But prof advised that we do one characteristic per module.


# ----------

To run in Android Studio emulator on Erik's machine:

run
   source ~/.zshrc

start android studio and have emulator device running

from MainApp directory, run
   npm start

# ----------

To run on Erik's physical android device:

check that connected evice is recognized. run
   adb devices

run
   npm start

or if that doesn't work (gets stuck installing APK), run
   DEBUG=react-native* npx react-native start

# ----------

Future enhancements not implemented in protoype, but for the final sellable product:
- Have the user be able to drag and drop rectangles on the screen, instead of just sending coordinates as text.
- This only works if there is one BLE device connected. Things will probably break if the user also has a pair of headphones connected. This is because I'm just taking the first item from the connectedPeripheralsArray that gets returned. In the future, we could have it only detect connected devices that match a certain ID signature for our smart mirrors.
- A way for the user to authenticate for their apps. Like have this app make a call to a web server of ours, that server goes and gets a token for some site, gives us the token, and we pass that token along with BLE to the Raspi.