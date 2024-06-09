Mobile app to configure the smart mirror via BLE.
Uses react-native-ble-manager for BLE functionality.

Docs for this bluetooth manager library:
http://innoveit.github.io/react-native-ble-manager/methods/#startoptions

# ----------

Todos

Broken and need to fix:
- "do full connection" usually doens't work. but the underlying steps in it (get bonded, connect to bonded, get connected, get services) all work individually.
   - for demo, just going to start with the phone already connected. or do the 4 separate connection buttons sequentially.
   - tried having this function call the exact 4 separate buttons that do work. even put delays between and await-ing. didn't fix.
   - actual library "get connected devices" array is coming back empty, even if there's a long delay after connection.
   - likely some state issue on/after connecting, or I'm doing something weird with my "gey system connected devices" function.
- writing to the "weather enable" characteristic always fails.
   - just going to not write to weather for the demo.
   - I checked that the hard-coded characteristic for this matches what's in Serjo's peripheral. seems ok.
   - might want to make sure in lightblue that this chracgeristic is indeed writable. reads are successul on it.
- read full config from mirror has some state issue. sometimes works for some modules.
   - not a very necessary feature for operation, so just going to hide this functionality for the demo.
   - this functionality isn't that necessary, since the mirror should have no way of getting into a state that wasn't set by the phone. this is really just for testing and if the user lost their phone and needed to pull the settings onto their phone.

High priority refactors / features:
- add in page for confguring language and units. I don't think people have actually verified this works on the mirror side yet.
- don't just hard-code the characteristics for each module. this requires a big refactor or new feature on the mirror side.
   - ideally want each characteristic's description to be something like "clock enable". and then uppon getting services, we populate the characteristics map in BLE context to hold that mapping.
- probably should get rid of all places where I'm using "module internal name". and all the jank mapping back and forth.
   - can reimplement if we end up getting internal names from the mirror somehow.

Low prioirty refactors / features:
- add an event handeler for the actual events in the ble manager library. just to make connection state stuff more stable.
- add some top right status icon for connection status.
   - no real visual indicator for this except for the error popups if you try to write/read while disconnected or without device info.
- if dropped connections are still a problem, could have something that polls the mirror (maybe the current user char) every 5-10 seconds.
   - not battery efficient and kinda jank, but I'm curious if this would make connections persist better.
- support for multiple user's configs in the module context.
   - this is started with the FullSingleUserConfiguration and AllUsersFullConfigurations interfaces right now - would just need to finish.
   - probably add some UI dropdown for changing the user. coudld make a new field for "current user" in module context, and have that listen to the read current user thing.
- persist the last configuration a user specified "to disk". so would persist across app closes and get loaded into the module context upon app open.

# ----------

To change over from lightblue testing to raspi testing:

In bluetooth utils:
   - change which service ID I'm using from the saved struct
   - change savedDeviceNames to comment out all but this device
   - change moduleCharacteristicsHardCoded to the correct one

# ----------

To run in Android Studio emulator on Erik's machine:

run
```
source ~/.zshrc
```

start android studio and have emulator device running

from MainApp directory, run
```
npm start
```

# ----------

To run on Erik's physical android device:

check that connected device is recognized. run
```
adb devices
```

run
```
npm start
```

or if that doesn't work (gets stuck installing APK), run
```
DEBUG=react-native* npx react-native start
```

or if neither of those work, try deleting the app and flashing again

# ----------

Future enhancements not implemented in protoype, but for the final sellable product:
- Add another black characterstic that allows write on the mirror side. For the purpose of if there's ever functionality to add a new module to the mirror, not just unhide existing ones.
- Have the user be able to drag and drop rectangles on the screen, instead of the form submit.
- This app only works if there is one BLE device connected. Things will probably break if the user also has a pair of headphones connected. This is because I'm just taking the first item from the connectedPeripheralsArray that gets returned. In the future, we could have it only detect connected devices that match a certain ID signature for our smart mirrors.
- Support for more module configuration other than position and enable. Something like weather location.
- A way for the user to authenticate for their apps. Like have this app make a call to a web server of ours, that server goes and gets a token for some site, gives us the token, and we pass that token along with BLE to the Raspi.
- Make sure we're actually using encrypted BLE. I think it might be doing that under the hood right now, but not sure.
- iOS compatability. Permission stuff doesn't work at the moment. Theoretically, most of it should work, since for anything that's android or ios only, I wrapped that with a conditional for ios/android.
- Better support for multiple users, maybe with a login function in the app. Perhaps a web server and database to store data.