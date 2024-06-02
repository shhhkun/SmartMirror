import dbus
import os
from enum import Enum

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

CONFIG_DIR = os.getcwd()  # Use the current working directory for the config files

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

def write_to_js_config(profile_index, characteristic_name, value):
    config_path = os.path.join(CONFIG_DIR, f"file{profile_index}.js")
    # Read the existing configuration from the JavaScript file
    with open(config_path, 'r') as file:
        config_content = file.read()

    # Modify the configuration object based on the characteristic being written
    if characteristic_name == "language":
        new_config_content = config_content.replace(f'language: "{config_content.split("language: \"")[1].split("\"")[0]}"', f'language: "{value}"')
    elif characteristic_name == "units":
        new_config_content = config_content.replace(f'units: "{config_content.split("units: \"")[1].split("\"")[0]}"', f'units: "{value}"')
    elif characteristic_name == "clock_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[1].split("\"")[0]}"', f'position: "{value}"', 1)
    elif characteristic_name == "update_notification_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[2].split("\"")[0]}"', f'position: "{value}"', 1)
    elif characteristic_name == "calendar_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[3].split("\"")[0]}"', f'position: "{value}"', 1)
    elif characteristic_name == "compliments_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[4].split("\"")[0]}"', f'position: "{value}"', 1)
    elif characteristic_name == "weather_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[5].split("\"")[0]}"', f'position: "{value}"', 1)
    elif characteristic_name == "news_position":
        new_config_content = config_content.replace(f'position: "{config_content.split("position: \"")[6].split("\"")[0]}"', f'position: "{value}"', 1)
    else:
        # Handle other characteristics similarly
        pass

    # Write the modified configuration back to the JavaScript file
    with open(config_path, 'w') as file:
        file.write(new_config_content)

class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.add_characteristic(ProfileIndexCharacteristic(self))
        self.add_characteristic(LanguageCharacteristic(self))
        self.add_characteristic(UnitsCharacteristic(self))
        self.add_characteristic(ClockPositionCharacteristic(self))
        self.add_characteristic(UpdateNotificationPositionCharacteristic(self))
        self.add_characteristic(CalendarPositionCharacteristic(self))
        self.add_characteristic(ComplimentsPositionCharacteristic(self))
        self.add_characteristic(WeatherPositionCharacteristic(self))
        self.add_characteristic(NewsPositionCharacteristic(self))
        print("UserProfileService initialized")

    def get_config_path(self, profile_index):
        return os.path.join(CONFIG_DIR, f"file{profile_index}.js")

    def read_config(self, profile_index):
        path = self.get_config_path(profile_index)
        with open(path, 'r') as file:
            return file.read()

    def write_config(self, profile_index, config):
        path = self.get_config_path(profile_index)
        with open(path, 'w') as file:
            file.write(config)

class ProfileIndexCharacteristic(Characteristic):
    PROFILE_INDEX_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.PROFILE_INDEX_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.profile_index = 0
        print("ProfileIndexCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.profile_index)]
        print("Profile index read:", self.profile_index)
        return value

    def WriteValue(self, value, options):
        self.profile_index = int(value[0])
        print("Profile index written:", self.profile_index)
        # Write to the JavaScript configuration file
        self.service.write_config(self.profile_index, f"var profileIndex = {self.profile_index};")

class LanguageCharacteristic(Characteristic):
    LANGUAGE_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.LANGUAGE_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.language = 0
        print("LanguageCharacteristic initialized")

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
        # Extract language value from the JavaScript configuration file
        language = config.split("language: \"")[1].split("\"")[0]
        value = [dbus.Byte(ord(c)) for c in language]
        print("Language read:", language)
        return value

    def WriteValue(self, value, options):
        language = ''.join(chr(b) for b in value)
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "language", language)
        print("Language written:", language)

class UnitsCharacteristic(Characteristic):
    UNITS_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.units = 0
        print("UnitsCharacteristic initialized")

    def ReadValue(self, options):
        config = self.service.read_config(self.service.get_characteristic(ProfileIndexCharacteristic).profile_index)
        # Extract units value from the JavaScript configuration file
        units = config.split("units: \"")[1].split("\"")[0]
        value = [dbus.Byte(ord(u)) for u in units]
        print("Units read:", units)
        return value

    def WriteValue(self, value, options):
        units = ''.join(chr(b) for b in value)
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "units", units)
        print("Units written:", units)

class ClockPositionCharacteristic(Characteristic):
    CLOCK_POSITION_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.clock_position = 0
        print("ClockPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract clock position value from the JavaScript configuration file
        clock_position = config.split("position: \"")[1].split("\"")[0]
        position_index = positions.index(clock_position) if clock_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Clock position read:", clock_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "clock_position", position)
        print("Clock position written:", position)

class UpdateNotificationPositionCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_POSITION_UUID = "00000006-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.update_notification_position = 0
        print("UpdateNotificationPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract update notification position value from the JavaScript configuration file
        update_notification_position = config.split("position: \"")[2].split("\"")[0]
        position_index = positions.index(update_notification_position) if update_notification_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Update notification position read:", update_notification_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "update_notification_position", position)
        print("Update notification position written:", position)

class CalendarPositionCharacteristic(Characteristic):
    CALENDAR_POSITION_UUID = "00000007-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.calendar_position = 0
        print("CalendarPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract calendar position value from the JavaScript configuration file
        calendar_position = config.split("position: \"")[3].split("\"")[0]
        position_index = positions.index(calendar_position) if calendar_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Calendar position read:", calendar_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "calendar_position", position)
        print("Calendar position written:", position)

class ComplimentsPositionCharacteristic(Characteristic):
    COMPLIMENTS_POSITION_UUID = "00000008-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.compliments_position = 0
        print("ComplimentsPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract compliments position value from the JavaScript configuration file
        compliments_position = config.split("position: \"")[4].split("\"")[0]
        position_index = positions.index(compliments_position) if compliments_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Compliments position read:", compliments_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "compliments_position", position)
        print("Compliments position written:", position)

class WeatherPositionCharacteristic(Characteristic):
    WEATHER_POSITION_UUID = "00000009-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.weather_position = 0
        print("WeatherPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract weather position value from the JavaScript configuration file
        weather_position = config.split("position: \"")[5].split("\"")[0]
        position_index = positions.index(weather_position) if weather_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("Weather position read:", weather_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "weather_position", position)
        print("Weather position written:", position)

class NewsPositionCharacteristic(Characteristic):
    NEWS_POSITION_UUID = "00000010-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))
        self.news_position = 0
        print("NewsPositionCharacteristic initialized")

    def ReadValue(self, options):
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        config = self.service.read_config(profile_index)
        # Extract news position value from the JavaScript configuration file
        news_position = config.split("position: \"")[6].split("\"")[0]
        position_index = positions.index(news_position) if news_position in positions else 0
        value = [dbus.Byte(position_index)]
        print("News position read:", news_position)
        return value

    def WriteValue(self, value, options):
        position_index = int(value[0])
        position = positions[position_index] if 0 <= position_index < len(positions) else positions[0]
        profile_index = self.service.get_characteristic(ProfileIndexCharacteristic).profile_index
        write_to_js_config(profile_index, "news_position", position)
        print("News position written:", position)

class ProfileIndexDescriptor(Descriptor):
    PROFILE_INDEX_DESCRIPTOR_UUID = "2901"
    PROFILE_INDEX_DESCRIPTOR_VALUE = "Profile Index"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.PROFILE_INDEX_DESCRIPTOR_UUID, ["read"], characteristic)

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
        Descriptor.__init__(self, self.LANGUAGE_DESCRIPTOR_UUID, ["read"], characteristic)

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
        Descriptor.__init__(self, self.UNITS_DESCRIPTOR_UUID, ["read"], characteristic)

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
        Descriptor.__init__(self, self.CLOCK_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CLOCK_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class UpdateNotificationPositionDescriptor(Descriptor):
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID = "2905"
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE = "Update Notification Position"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class CalendarPositionDescriptor(Descriptor):
    CALENDAR_POSITION_DESCRIPTOR_UUID = "2906"
    CALENDAR_POSITION_DESCRIPTOR_VALUE = "Calendar Position"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.CALENDAR_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CALENDAR_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class ComplimentsPositionDescriptor(Descriptor):
    COMPLIMENTS_POSITION_DESCRIPTOR_UUID = "2907"
    COMPLIMENTS_POSITION_DESCRIPTOR_VALUE = "Compliments Position"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.COMPLIMENTS_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.COMPLIMENTS_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class WeatherPositionDescriptor(Descriptor):
    WEATHER_POSITION_DESCRIPTOR_UUID = "2908"
    WEATHER_POSITION_DESCRIPTOR_VALUE = "Weather Position"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.WEATHER_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.WEATHER_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

class NewsPositionDescriptor(Descriptor):
    NEWS_POSITION_DESCRIPTOR_UUID = "2909"
    NEWS_POSITION_DESCRIPTOR_VALUE = "News Position"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.NEWS_POSITION_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.NEWS_POSITION_DESCRIPTOR_VALUE
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
