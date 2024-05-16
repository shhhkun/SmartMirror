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
        self.add_characteristic(ModulePositionCharacteristic(self, "updatenotification", "00000004-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModulePositionCharacteristic(self, "clock", "00000005-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModulePositionCharacteristic(self, "calendar", "00000006-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModulePositionCharacteristic(self, "compliments", "00000007-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModulePositionCharacteristic(self, "weather", "00000008-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModulePositionCharacteristic(self, "newsfeed", "00000009-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "updatenotification", "0000000A-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "clock", "0000000B-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "calendar", "0000000C-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "compliments", "0000000D-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "weather", "0000000E-710e-4a5b-8d75-3e5b444bc3cf"))
        self.add_characteristic(ModuleNameCharacteristic(self, "newsfeed", "0000000F-710e-4a5b-8d75-3e5b444bc3cf"))

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
        self.add_descriptor(UserProfileDescriptor(self))
        self.profile_index = 0

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
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
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
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
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

class ModulePositionCharacteristic(Characteristic):
    def __init__(self, service, module_name, uuid):
        self.module_name = module_name
        Characteristic.__init__(
            self, uuid,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
        module = next((m for m in config['modules'] if m['module'] == self.module_name), {})
        position = module.get('position', '')
        position_index = positions.index(position) if position in positions else 0
        value = [dbus.Byte(position_index)]
        print(f"Position read for {self.module_name}:", position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        for module in config['modules']:
            if module['module'] == self.module_name:
                module['position'] = position
        self.service.write_config(profile_index, config)
        print(f"Position written for {self.module_name}:", position)

class ModuleNameCharacteristic(Characteristic):
    def __init__(self, service, module_name, uuid):
        self.module_name = module_name
        Characteristic.__init__(
            self, uuid,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
        module = next((m for m in config['modules'] if m['module'] == self.module_name), {})
        module_name = module.get('module', '')
        value = [dbus.Byte(ord(c)) for c in module_name]
        print(f"Module name read for {self.module_name}:", module_name)
        return value

    def WriteValue(self, value, options):
        module_name = ''.join(chr(b) for b in value)
        if module_name == '0':
            module_name = ''
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        for module in config['modules']:
            if module['module'] == self.module_name:
                module['module'] = module_name
        self.service.write_config(profile_index, config)
        print(f"Module name written for {self.module_name}:", module_name)

class UserProfileDescriptor(Descriptor):
    USER_PROFILE_DESCRIPTOR_UUID = "2901"
    USER_PROFILE_DESCRIPTOR_VALUE = "User Profile Index"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.USER_PROFILE_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.USER_PROFILE_DESCRIPTOR_VALUE
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
