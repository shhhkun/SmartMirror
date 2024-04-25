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
