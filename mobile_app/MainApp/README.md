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

I think the issue I'm seeing of disconnecting after about a minute can be attributed to the Lightblue app. Will wait to worry more about this until I see it happen on the pi.

Next steps:
- make some more of the connection process automatic. like getting system connected info. reduce the number of buttons and steps needed.
   - the bonded > connected flow still works if you system connect in Lightblue.
   - connecting while already connected seems to be fine. so doesn't matter if this gets called again
   - can maybe do some refactoring with all this stuff when I add in the event handlers for the ble manager events.

- add event handeler for disconnect events in the ble manager.
- figure out how to encode/decode more complex data
- should be using a reducer thing in provider states to make that less ugly. this itself is also complex, though.

- make UI for sending data to config a module for one characteristic. should have radial buttons for "top left", "top right", etc for positions. (not x/y coordinates)

- add ability and UI for communicating with more than 1 characteristic. might reconfiguretarget stuff with this. maybe make the target characteristic an array, and just for-each this for writing.
- make UI for sending data to multiple characteristics

maybe:
- smart navigation in the app, based on bluetooth state. when permissions are enabled, no need to show the screen for permissions. when a device is connected, can take them directly to the send data screen.
- persist info about devices and/or user states. store stuff to "disk". might not be super necessary though, if I'm using the bonded devices array.

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
- iOS compatability. Permission stuff doesn't work at the moment. Theoretically, most of it should work. Except for the getBondedPeripherals() method in the library. But I doubt the flow of bonded > system connected > connected that kind of happens in this app right now would be the same on iOS. And the connect() function in the library doesn't time out on iOS, so would need a timer here.