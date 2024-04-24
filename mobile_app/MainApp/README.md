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

Upon a smart mirror device being found (as determined by UUID somehow?), or any device for now, the user can click it and get taken to a page for that device.

On that next page, they can read from a characteristic and send data to it with a text box.

# ----------

Todo / notes

Permisisons on home screen are working. Navigation from home screen to scan screen works.

Get connected devices is working. Seems quite brittle though. Could be due to the nrf peripheral on my iPhone being jank. But it does print out info about the connected device.

Next steps:
- build bluetooth context and context provider
- set up sexisting code to use the context provider instead of directly calling bluetooth service


- refactor stuff to use the context API for bluetooth state management. to hold on to the UUID of our current device
- call the method that gets info about a connected peripheral - its characteristics and services it is advertising
- try reading the value out of a specific characteristic
- implement command to write data to a characteristic on the peripheral
- implement some UI functionality (maybe another page) that shows details of the device. and maybe a text box form. maybe store the data from the prior page with some context api thing?
- smart navigation in the app, based on bluetooth state. when permissions are enabled, no need to show the screen for permissions. when a device is connected, can take them directly to the send data screen.

- !!!!! blocked from here on, until we have the peripheral set up on the pi !!!!!

- come up with a data format to send to the peripheral (whatever the JSON config thing should look like)
- hook up text box form to the ability to send this JSON config to the peripheral
- maybe maybe the show connected devices function only show devices with our kind of specific service UUIDs

# ----------

To run in emulator on Erik's machine:

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
   DEBUG=react-native* npx react-native start

or if that doesn't work, can also just try running
   npm start

# ----------

Future enhancements that I'm not going to implement, but would be nice for the final sellable product: (none actually issues yet, but will be issues after this prototype is done)
- This only works if there is one BLE device connected. Things will break if the user also has a pair of headphones connected. This is because I'm just taking the first item from the connectedPeripheralsArray that gets returned, and I don't want to deal with the complexity of managing multiple bluetooth devices being connected and selecting the right one.
- Have the user be able to drag and drop rectangles on the screen, instead of just sending coordinates as text.
- A way for the user to authenticate for their apps. Like have this app make a call to a web server of ours, that server goes and gets a token for some site, gives us the token, and we pass that token along with BLE to the Raspi.