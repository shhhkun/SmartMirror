Mobile app to send a config JSON file to the smart mirror via bluetooth.
Uses react-native-ble-manager for BLE functionality and react navigator for pages.

Docs for this bluetooth manager library:
http://innoveit.github.io/react-native-ble-manager/methods/#startoptions

Good example project to refer to:
https://blog.logrocket.com/using-react-native-ble-manager-mobile-app/

# ----------

Description of functionality:

Pressing "start/go" from home screen will initialize the bluetooth manager. This might trigger some system dialogue box for bluetooth permission.

Next screen will be scan screen. Upon pressing button, should show a list of nearby devices. Clicking one should initiate pairing with that device. Bottom button should become clickable once a device is connected, and takes you to next page.

Final data-send page provides text boxes to put inputs into, and has a button to "send" data. Exact format, bluetooth characteristic, etc. tbd until we figure out the listener.

# ----------

Todo / notes

Permisisons on home screen are working. Navigation from home screen to scan screen works.

Scan action on scan screen seems to be working. I'm not entirely sure what this is doing, though.

Get connected peripherals in scan screen doesn't seem to be actually working. Tried on physical android with my heart rate sensor connected, and it didn't detect it. Could be some issue wiht the scan not stopping, or some state issue.

Next steps:
- get connected peripherals to actually show up with their UUIDs
- try running the function that gets info about a connected peripheral, including the characteristics it is advertising
- try reading the value out of a specific characteristic
- implement some UI functionality (maybe another page) that shows details of the device. and maybe a text box form

- !!!!! blocked from here on, until we have the peripheral set up on the pi !!!!!

- implement command to write to a characteristic on the peripheral
- come up with a data format to send to the peripheral (whatever the JSON config thing should look like)
- hook up text box form to the ability to send this JSON config to the peripheral

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

# ----------
