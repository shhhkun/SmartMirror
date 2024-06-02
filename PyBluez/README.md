# installation/setup:

https://pybluez.readthedocs.io/en/latest/install.html

# running code:

run python script natively on pi

# connection process:

 - once PyBluez BLE peripheral is running its service will be advertised
 - use BLE central device (smartphone) w/ BLE scanner app to scan for nearby devices
      - raspberry pi should show on list (check protocol UUID)
      - make sure bluetooth is enabled:
	> sudo systemctl status bluetooth
      - to enable:
	> sudo systemctl start bluetooth
      - to restart:
	> sudo systemctl restart bluetooth

# config file (configurable items via UID):

**USER ID:**

    > desc: user profile index
    > UID: 00000002-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > changes opened config file: file0.js, file1.js, ...

**LANGUAGE:**

    > desc: language for UI
    > UID: 00000003-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > languages[integer] = "en", ...

**UNITS:**

    > desc: unit system used
    > UID: 00000004-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > unitsys[integer] = "metric", ...

**CLOCK (POSITION):**

    > desc: unit system used
    > UID: 00000005-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"

ADDING REST OF ADJUSTABLE items via UID and mapping soon:

**UPDATE NOTIFICATION (POSITION):**

**CALENDAR (POSITION):**

**COMPLIMENTS (POSITION):**

**WEATHER (POSITION):**

**NEWS (POSITION):**