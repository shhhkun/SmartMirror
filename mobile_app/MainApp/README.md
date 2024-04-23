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
- try running the function that gets info about a connected peripheral, including the characteristics it is advertising
- set up the context API to manage bluetooth state. like to hold the UUID of the current device and info about its characteristic we'll want to write to
- try reading the value out of a specific characteristic
- implement some UI functionality (maybe another page) that shows details of the device. and maybe a text box form. maybe store the data from the prior page with some context api thing?

- !!!!! blocked from here on, until we have the peripheral set up on the pi !!!!!

- implement command to write data to a characteristic on the peripheral
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
