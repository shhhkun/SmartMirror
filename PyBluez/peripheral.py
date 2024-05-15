import dbus
import json
import os

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"  # SERVICE UUID

    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.profile_index = 0  # Initialize with a default value
        self.add_characteristic(UserProfileCharacteristic(self))
        self.add_characteristic(LanguageCharacteristic(self))
        self.add_characteristic(UnitsCharacteristic(self))

    def open_profile_file(self, profile_index):
        filename = f'file{profile_index}.json'
        if not os.path.exists(filename):
            raise FileNotFoundError(f"File {filename} does not exist.")
        with open(filename, 'r+') as file:
            config = json.load(file)
        return config, filename

    def update_profile_file(self, profile_index, config):
        filename = f'file{profile_index}.json'
        with open(filename, 'w') as file:
            json.dump(config, file, indent=4)
        print(f"Updated file: {filename}")

class UserProfileCharacteristic(Characteristic):
    USER_PROFILE_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"  # USER PROFILE CHAR. 1 UUID

    def __init__(self, service):
        Characteristic.__init__(
            self, self.USER_PROFILE_CHARACTERISTIC_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        value = [dbus.Byte(self.service.profile_index)]
        print("User profile index read:", self.service.profile_index)
        return value

    def WriteValue(self, value, options):
        self.service.profile_index = int(value[0])
        print("User profile index written:", self.service.profile_index)
        # Open corresponding file
        config, filename = self.service.open_profile_file(self.service.profile_index)
        print(f"Opened file: {filename}")

class UserProfileDescriptor(Descriptor):
    USER_PROFILE_DESCRIPTOR_UUID = "2901"
    USER_PROFILE_DESCRIPTOR_VALUE = "User Profile Index"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.USER_PROFILE_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.USER_PROFILE_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class LanguageCharacteristic(Characteristic):
    LANGUAGE_CHARACTERISTIC_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"  # LANGUAGE CHAR. UUID

    def __init__(self, service):
        Characteristic.__init__(
            self, self.LANGUAGE_CHARACTERISTIC_UUID,
            ["read", "write"], service)
        self.add_descriptor(LanguageDescriptor(self))

    def ReadValue(self, options):
        config, _ = self.service.open_profile_file(self.service.profile_index)
        language = config.get("language", "en")
        value = [dbus.Byte(c.encode()) for c in language]
        print("Language read:", language)
        return value

    def WriteValue(self, value, options):
        config, filename = self.service.open_profile_file(self.service.profile_index)
        new_language = "".join([chr(b) for b in value])
        config["language"] = new_language
        self.service.update_profile_file(self.service.profile_index, config)
        print("Language written:", new_language)

class LanguageDescriptor(Descriptor):
    LANGUAGE_DESCRIPTOR_UUID = "2901"
    LANGUAGE_DESCRIPTOR_VALUE = "Language"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.LANGUAGE_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.LANGUAGE_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class UnitsCharacteristic(Characteristic):
    UNITS_CHARACTERISTIC_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"  # UNITS CHAR. UUID

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_CHARACTERISTIC_UUID,
            ["read", "write"], service)
        self.add_descriptor(UnitsDescriptor(self))

    def ReadValue(self, options):
        config, _ = self.service.open_profile_file(self.service.profile_index)
        units = config.get("units", "metric")
        value = [dbus.Byte(c.encode()) for c in units]
        print("Units read:", units)
        return value

    def WriteValue(self, value, options):
        config, filename = self.service.open_profile_file(self.service.profile_index)
        new_units = "".join([chr(b) for b in value])
        config["units"] = new_units
        self.service.update_profile_file(self.service.profile_index, config)
        print("Units written:", new_units)

class UnitsDescriptor(Descriptor):
    UNITS_DESCRIPTOR_UUID = "2901"
    UNITS_DESCRIPTOR_VALUE = "Units"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.UNITS_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UNITS_DESCRIPTOR_VALUE

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
