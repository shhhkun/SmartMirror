import dbus
import os
from enum import Enum
import signal
import time
from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

CONFIG_DIR = os.getcwd()  # use the current working directory for the config files

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
    config_path = f"file{profile_index}.js"
    # Read the existing configuration from the JavaScript file
    with open(config_path, 'r') as file:
        config_content = file.read()

    # Modify the configuration object based on the characteristic being written
    if characteristic_name == "language":
        old_value = config_content.split('language: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'language: "{old_value}"', f'language: "{value}"')
    elif characteristic_name == "units":
        old_value = config_content.split('units: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'units: "{old_value}"', f'units: "{value}"')
    elif characteristic_name == "clock_position":
        old_value = config_content.split('module: "clock",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    elif characteristic_name == "update_notification_position":
        old_value = config_content.split('module: "updatenotification",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    elif characteristic_name == "calendar_position":
        old_value = config_content.split('module: "calendar",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    elif characteristic_name == "compliments_position":
        old_value = config_content.split('module: "compliments",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    elif characteristic_name == "weather_position":
        old_value = config_content.split('module: "weather",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    elif characteristic_name == "news_position":
        old_value = config_content.split('module: "newsfeed",')[1].split('position: "')[1].split('"')[0]
        new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
    else:
        # Handle other characteristics similarly
        return

    # Write the modified configuration back to the JavaScript file
    with open(config_path, 'w') as file:
        file.write(new_config_content)

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
        self.language = 0
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
        self.units = 0
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
        self.clock_position = 0
        print("ClockPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.clock_position)]
        print("Clock position read:", self.clock_position)
        return value

    def WriteValue(self, value, options):
        self.clock_position = int(value[0])
        print("Clock position written:", self.clock_position)

class UpdateNotificationPositionCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_POSITION_UUID = "00000006-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationPositionDescriptor(self))
        self.update_notification_position = 0
        print("UpdateNotificationPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.update_notification_position)]
        print("Update notification position read:", self.update_notification_position)
        return value

    def WriteValue(self, value, options):
        self.update_notification_position = int(value[0])
        print("Update notification position written:", self.update_notification_position)


class CalendarPositionCharacteristic(Characteristic):
    CALENDAR_POSITION_UUID = "00000007-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarPositionDescriptor(self))
        self.calendar_position = 0
        print("CalendarPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.calendar_position)]
        print("Calendar position read:", self.calendar_position)
        return value

    def WriteValue(self, value, options):
        self.calendar_position = int(value[0])
        print("Calendar position written:", self.calendar_position)


class ComplimentsPositionCharacteristic(Characteristic):
    COMPLIMENTS_POSITION_UUID = "00000008-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsPositionDescriptor(self))
        self.compliments_position = 0
        print("ComplimentsPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.compliments_position)]
        print("Compliments position read:", self.compliments_position)
        return value

    def WriteValue(self, value, options):
        self.compliments_position = int(value[0])
        print("Compliments position written:", self.compliments_position)


class WeatherPositionCharacteristic(Characteristic):
    WEATHER_POSITION_UUID = "00000009-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherPositionDescriptor(self))
        self.weather_position = 0
        print("WeatherPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.weather_position)]
        print("Weather position read:", self.weather_position)
        return value

    def WriteValue(self, value, options):
        self.weather_position = int(value[0])
        print("Weather position written:", self.weather_position)


class NewsPositionCharacteristic(Characteristic):
    NEWS_POSITION_UUID = "0000000A-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsPositionDescriptor(self))
        self.news_position = 0
        print("NewsPositionCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.news_position)]
        print("News position read:", self.news_position)
        return value

    def WriteValue(self, value, options):
        self.news_position = int(value[0])
        print("News position written:", self.news_position)


# Descriptors
class UserProfileDescriptor(Descriptor):
    USER_PROFILE_DESCRIPTOR_UUID = "2901"
    USER_PROFILE_DESCRIPTOR_VALUE = "User Profile Descriptor"

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

class ProfileIndexDescriptor(Descriptor):
    PROFILE_INDEX_DESCRIPTOR_UUID = "2901"
    PROFILE_INDEX_DESCRIPTOR_VALUE = "Profile Index Descriptor"

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
    LANGUAGE_DESCRIPTOR_UUID = "2901"
    LANGUAGE_DESCRIPTOR_VALUE = "Language Descriptor"

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
    UNITS_DESCRIPTOR_UUID = "2901"
    UNITS_DESCRIPTOR_VALUE = "Units Descriptor"

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
    CLOCK_POSITION_DESCRIPTOR_UUID = "2901"
    CLOCK_POSITION_DESCRIPTOR_VALUE = "Clock Position Descriptor"

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

class UpdateNotificationPositionDescriptor(Descriptor):
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID = "2901"
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE = "Update Notification Position Descriptor"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class CalendarPositionDescriptor(Descriptor):
    CALENDAR_POSITION_DESCRIPTOR_UUID = "2901"
    CALENDAR_POSITION_DESCRIPTOR_VALUE = "Calendar Position Descriptor"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.CALENDAR_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CALENDAR_POSITION_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class ComplimentsPositionDescriptor(Descriptor):
    COMPLIMENTS_POSITION_DESCRIPTOR_UUID = "2901"
    COMPLIMENTS_POSITION_DESCRIPTOR_VALUE = "Compliments Position Descriptor"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.COMPLIMENTS_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.COMPLIMENTS_POSITION_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class WeatherPositionDescriptor(Descriptor):
    WEATHER_POSITION_DESCRIPTOR_UUID = "2901"
    WEATHER_POSITION_DESCRIPTOR_VALUE = "Weather Position Descriptor"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.WEATHER_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.WEATHER_POSITION_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class NewsPositionDescriptor(Descriptor):
    NEWS_POSITION_DESCRIPTOR_UUID = "2901"
    NEWS_POSITION_DESCRIPTOR_VALUE = "News Position Descriptor"

    def __init__(self, characteristic):
        Descriptor.__init__(
            self, self.NEWS_POSITION_DESCRIPTOR_UUID,
            ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.NEWS_POSITION_DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

class UserProfileAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_service_uuid(UserProfileService.USER_PROFILE_SVC_UUID)
        self.include_tx_power = True

def register_app_cb():
    print("GATT application registered")

def register_app_error_cb(error):
    print("Failed to register application: " + str(error))
    mainloop.quit()

def register_ad_cb():
    print("Advertisement registered")

def register_ad_error_cb(error):
    print("Failed to register advertisement: " + str(error))
    mainloop.quit()

app = Application()
app.add_service(UserProfileService(0))
app.add_service(UserProfileService(1))

adv = UserProfileAdvertisement(0)

def handler(signum, frame):
    raise KeyboardInterrupt

signal.signal(signal.SIGINT, handler)

app.register()
adv.register()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Program interrupted, exiting...")
