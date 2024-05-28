import dbus
import json
import os
from enum import Enum

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

CONFIG_DIR = "/path/to/config/files"  # Update this path to where your JSON files are located

class Positions(Enum):
    TOP_BAR = 0
    TOP_LEFT = 1
    TOP_CENTER = 2
    TOP_RIGHT = 3
    UPPER_THIRD = 4
    MIDDLE_CENTER = 5
    LOWER_THIRD = 6
    BOTTOM_LEFT = 7
    BOTTOM_CENTER = 8
    BOTTOM_RIGHT = 9
    BOTTOM_BAR = 10
    FULLSCREEN_ABOVE = 11
    FULLSCREEN_BELOW = 12

positions = [
    "top_bar", "top_left", "top_center", "top_right", "upper_third", "middle_center",
    "lower_third", "bottom_left", "bottom_center", "bottom_right", "bottom_bar",
    "fullscreen_above", "fullscreen_below"
]

class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.add_characteristic(ProfileIndexCharacteristic(self))
        self.add_characteristic(LanguageCharacteristic(self))
        self.add_characteristic(UnitsCharacteristic(self))
        self.add_characteristic(ClockPositionCharacteristic(self))
        print("UserProfileService initialized")

    def get_config_path(self, profile_index):
        return os.path.join(CONFIG_DIR, f"file{profile_index}.json")

    def read_config(self, profile_index):
        path = self.get_config_path(profile_index)
        with open(path, 'r') as file:
            return json.load(file)

    def write_config(self, profile_index, config):
        path = self.get_config_path(profile_index)
        with open(path, 'w') as file:
            json.dump(config, file, indent=2)

class ProfileIndexCharacteristic(Characteristic):
    PROFILE_INDEX_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.PROFILE_INDEX_UUID,
            ["read", "write"], service)
        self.add_descriptor(ProfileIndexDescriptor(self))
        self.profile_index = 0
        print("ProfileIndexCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.profile_index)]
        print("Profile index read:", self.profile_index)
        return value

    def WriteValue(self, value, options):
        self.profile_index = int(value[0])
        print("Profile index written:", self.profile_index)

class LanguageCharacteristic(Characteristic):
    LANGUAGE_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.LANGUAGE_UUID,
            ["read", "write"], service)
        self.add_descriptor(LanguageDescriptor(self))
        self.language = 0  # Default to 0 (can map to a language string later)
        print("LanguageCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.language)]
        print("Language read:", self.language)
        return value

    def WriteValue(self, value, options):
        self.language = int(value[0])
        print("Language written:", self.language)

class UnitsCharacteristic(Characteristic):
    UNITS_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_UUID,
            ["read", "write"], service)
        self.add_descriptor(UnitsDescriptor(self))
        self.units = 0  # Default to 0 (can map to units like 'metric' or 'imperial')
        print("UnitsCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.units)]
        print("Units read:", self.units)
        return value

    def WriteValue(self, value, options):
        self.units = int(value[0])
        print("Units written:", self.units)

class ClockPositionCharacteristic(Characteristic):
    CLOCK_POSITION_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ClockPositionDescriptor(self))
        self.clock_position = 0  # Default to 0 (Positions.TOP_BAR)
        print("ClockPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.clock_position)]
        print("Clock position read:", self.clock_position)
        return value

    def WriteValue(self, value, options):
        self.clock_position = int(value[0])
        print("Clock position written:", Positions(self.clock_position).name)

class ProfileIndexDescriptor(Descriptor):
    PROFILE_INDEX_DESCRIPTOR_UUID = "2901"
    PROFILE_INDEX_DESCRIPTOR_VALUE = "Profile Index"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.PROFILE_INDEX_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.PROFILE_INDEX_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class LanguageDescriptor(Descriptor):
    LANGUAGE_DESCRIPTOR_UUID = "2902"
    LANGUAGE_DESCRIPTOR_VALUE = "Language"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.LANGUAGE_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.LANGUAGE_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class UnitsDescriptor(Descriptor):
    UNITS_DESCRIPTOR_UUID = "2903"
    UNITS_DESCRIPTOR_VALUE = "Units"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.UNITS_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UNITS_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class ClockPositionDescriptor(Descriptor):
    CLOCK_POSITION_DESCRIPTOR_UUID = "2904"
    CLOCK_POSITION_DESCRIPTOR_VALUE = "Clock Position"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.CLOCK_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CLOCK_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

app = Application()
app.add_service(UserProfileService(0))
app.register()

adv = Advertisement(0, "peripheral")
adv.add_local_name("UserProfilePeripheral")
adv.include_tx_power = True
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()
