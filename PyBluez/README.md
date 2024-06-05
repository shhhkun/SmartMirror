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

**PROFILE INDEX:**

    > desc: user profile index
    > UID: 00000002-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > changes opened config file: file0.js, file1.js, ...

**LANGUAGE:**

    > desc: language for UI
    > UID: 00000003-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > languages[integer] = "en", ...
    > DISABLE UID: 00000004-710e-4a5b-8d75-3e5b444bc3cf

**UNITS:**

    > desc: unit system used
    > UID: 00000004-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > unitsys[integer] = "metric", ...
    > DISABLE UID: 00000006-710e-4a5b-8d75-3e5b444bc3cf

**CLOCK (POSITION):**

    > desc: clock position on monitor
    > UID: 00000005-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 00000006-710e-4a5b-8d75-3e5b444bc3cf

**UPDATE NOTIFICATION (POSITION):**

    > desc: notifications position on monitor
    > UID: 00000007-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 00000008-710e-4a5b-8d75-3e5b444bc3cf

**CALENDAR (POSITION):**

    > desc: calendar position on monitor
    > UID: 00000009-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 0000000A-710e-4a5b-8d75-3e5b444bc3cf

**COMPLIMENTS (POSITION):**

    > desc: compliments position on monitor
    > UID: 0000000B-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 0000000C-710e-4a5b-8d75-3e5b444bc3cf

**WEATHER (POSITION):**

    > desc: weather position on monitor
    > UID: 0000000D-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 0000000E-710e-4a5b-8d75-3e5b444bc3cf

**NEWS (POSITION):**

    > desc: news position on monitor
    > UID: 0000000F-710e-4a5b-8d75-3e5b444bc3cf
    > accepts integer = 0, 1, 2, ...
    > position[integer] = "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center", 
                          "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
                          "fullscreen_above", "fullscreen_below"
    > DISABLE UID: 0000001F-710e-4a5b-8d75-3e5b444bc3cf