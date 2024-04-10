Mobile app to send a config JSON file to the smart mirror via bluetooth.
Uses react-native-ble-manager for BLE functionality and react navigator for pages.

Docs for this bluetooth manager library:
http://innoveit.github.io/react-native-ble-manager/methods/#startoptions

# ----------

Todo / notes

Plan is to have a separate page for each step of the process.
Home screen (or permissions screen?) initializes the bluetooth library/driver.
Scan screen shows a list of devices and gives the option to connect.
Finally, data send screen gives the user the option to send text-box entries to the device.

Functionality for these operations will be contained in BluetoothService.tx, as a wrapper for the library. Then call these functions from the respective pages.

# ----------

To run on Erik's machine:

run
   source ~/.zshrc

start android studio and have emulator device running

run
   npm start
from MainApp directory

# ----------
