import dbus
import json
import os
from enum import Enum

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

CONFIG_DIR = os.getcwd()  # Use the current directory for JSON files

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
        if not os.path.exists(path):
            return {"modules": []}  # Return a default structure if the file doesn't exist
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
        print("LanguageCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        language = config.get('language', 'en')
        value = [dbus.Byte(ord(c)) for c in language]
        print("Language read:", language)
        return value

    def WriteValue(self, value, options):
        language = ''.join(chr(b) for b in value)
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        config['language'] = language
        self.service.write_config(profile_index, config)
        print("Language written:", language)

class UnitsCharacteristic(Characteristic):
    UNITS_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_UUID,
            ["read", "write"], service)
        self.add_descriptor(UnitsDescriptor(self))
        print("UnitsCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        units = config.get('units', 'metric')
        value = [dbus.Byte(ord(u)) for u in units]
        print("Units read:", units)
        return value

    def WriteValue(self, value, options):
        units = ''.join(chr(b) for b in value)
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        config['units'] = units
        self.service.write_config(profile_index, config)
        print("Units written:", units)

class ClockPositionCharacteristic(Characteristic):
    CLOCK_POSITION_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ClockPositionDescriptor(self))
        print("ClockPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        module = next((m for m in config['modules'] if m['module'] == 'clock'), {})
        position = module.get('position', '')
        position_index = positions.index(position) if position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Clock position read:", position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        clock_module = next((m for m in config['modules'] if m['module'] == 'clock'), None)
        if clock_module:
            clock_module['position'] = position
        else:
            config['modules'].append({'module': 'clock', 'position': position})
        self.service.write_config(profile_index, config)
        print("Clock position written:", position)

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
