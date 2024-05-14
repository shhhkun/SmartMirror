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

- make bonded -> connected work, without initiating the system connection in nrf connect.
- add event handeler for disconnect events in the ble manager.
- get write action to work. seems to not be completing successfully right now. but I'm not certain that is my on my end, rather than on the end of nrf connect, since that app is super jank. might want to just go striaght to the pi, if that's up and running.
- figure out how to encode/decode data being sent and read.
- general UI cleanup and refactor.

- !!!!! blocked from here on, until we have the peripheral set up on the pi !!!!!

- decide on exact data format we'll be sending. probably per-module info.
- implement data sending protocol, probably across multiple characteristics.
- implement UI to send data to the device via a form submission.
- implement a nice UI page where you can drag and resize rectangles.
- smart navigation in the app, based on bluetooth state. when permissions are enabled, no need to show the screen for permissions. when a device is connected, can take them directly to the send data screen.
- persist info about devices and/or user states. store stuff to "disk".

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

or if neither of those work, try deleting the app and flashing again

# ----------

Future enhancements not implemented in protoype, but for the final sellable product:
- Have the user be able to drag and drop rectangles on the screen, instead of just sending coordinates as text.
- This only works if there is one BLE device connected. Things will probably break if the user also has a pair of headphones connected. This is because I'm just taking the first item from the connectedPeripheralsArray that gets returned. In the future, we could have it only detect connected devices that match a certain ID signature for our smart mirrors. Overall I bet things will break if multiple devices are connected.
- A way for the user to authenticate for their apps. Like have this app make a call to a web server of ours, that server goes and gets a token for some site, gives us the token, and we pass that token along with BLE to the Raspi.
- iOS compatability. Haven't tested any of this on iOS. Theoretically, most of it should work. Except for the getBondedPeripherals() method in the library. But I doubt the flow of bonded > system connected > connected that kind of happens in this app right now would be the same on iOS. And the connect() function in the library doesn't time out on iOS, so would need a timer here.