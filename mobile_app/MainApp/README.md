Mobile app to send a config JSON file to the smart mirror via bluetooth.
Uses react-native-ble-manager for BLE functionality.

Docs for this bluetooth manager library:
http://innoveit.github.io/react-native-ble-manager/methods/#startoptions

# ----------

Description of functionality:

Pressing "enable bluetooth" from home screen will initialize the bluetooth manager. This might trigger some system popup for bluetooth permission.

Next screen has a button that checks for currently connected devices. It is assumed that the user will have paired to a device in their device settings, then will come back here.

MTU between the two devices can be negotiated up. But should be ok just to write data as multiple packets.

Upon a smart mirror device being found (as determined by UUID somehow?), or any device for now, the user can send it data via a form.

# ----------

I think the issue I'm seeing of disconnecting after about a minute can be attributed to the Lightblue app. Will wait to worry more about this until I see it happen on the pi.

Next steps:
- get read module stuff to config working + form state updating correctly. sliders and dropdowns not updating correctly for now.
- [blocked] test reading and writing module info to the actual pi.
- clean up the connectiion process. make it one button, instead of several. bascially just fix the appConnectFromBonded function in ble provider.
- put in a UI page for messing with langauge and units.
- make the UI more pretty.
- make a draw.io block diagram of how this app works.
- record a video of correct app operation.

maybe:
- persist a user's config to disk
- add event handeler for disconnect events in the ble manager.
- maybe make a top right status menu/icon that shows connection status stuff. could also be a button that takes you to a dedicated status page.
- if dropped connections are still a problem, could have something that polls the mirror every x seconds. as a keep connection alive type thing.

# ----------

To go from lightblue testing to raspi testing:
- in bluetooth utils:
-     change savedDeviceNames to comment out all but this device
-     change moduleCharacteristicsHardCoded to the correct one

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
- Have the user be able to drag and drop rectangles on the screen, instead of the form submit.
- This app only works if there is one BLE device connected. Things will probably break if the user also has a pair of headphones connected. This is because I'm just taking the first item from the connectedPeripheralsArray that gets returned. In the future, we could have it only detect connected devices that match a certain ID signature for our smart mirrors. Overall I bet things will break if multiple devices are connected.
- Support for more modulec configuration other than position and enable. Something like weather location.
- A way for the user to authenticate for their apps. Like have this app make a call to a web server of ours, that server goes and gets a token for some site, gives us the token, and we pass that token along with BLE to the Raspi.
- iOS compatability. Permission stuff doesn't work at the moment. Theoretically, most of it should work. Except for the getBondedPeripherals() method in the library. But I doubt the flow of bonded > system connected > connected that kind of happens in this app right now would be the same on iOS. And the connect() function in the library doesn't time out on iOS, so would need a timer here.
- Discoverability of characteristics. Instead of having them hard coded. Maybe have one characteristic that is fixed or gets discovered via its position or description. And then that is read-only and cha display some kind of array/map of the other characteristics and their associated modules.
- Add support for multiple users, maybe with a login function in the app. And a web server to store data.