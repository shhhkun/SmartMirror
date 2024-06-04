import dbus
import os
import re
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

class Languages(Enum):
    ENGLISH = 0
    SPANISH = 1
    CHINESE = 2
    
languages = [
    "en", "es", "zh"
]

class MetricSys(Enum):
    METRIC = 0
    IMPERIAL = 1
    
metricsys = [
    "metric", "imperial"
]

<<<<<<< HEAD
=======
# --------------------------------------------------------------------------
# implement reading from ~/SmartMirror/App/js/userId.js
# read from first line to check for existence of "user#" pattern
# if exists: 
#           parse out # and that determines which config file to write to
# if not:
#           don't write to config file
#
# config file exists in ~/SmartMirror/App/config
#           files are named user0.js, user1.js, user2.js, ...
# --------------------------------------------------------------------------

import os
import re

>>>>>>> 7ff5e6846c4e51cd6d35c006beaf65eff2c33eab
def read_user_id():
    user_id_file_path = os.path.expanduser("~/SmartMirror/App/js/userId.js")
    if os.path.exists(user_id_file_path):
        with open(user_id_file_path, 'r') as file:
            content = file.read()
            match = re.search(r'exports.userId = "(.*?)"', content)
            if match:
                return match.group(1)
    return None

def write_to_js_config(profile_index, characteristic_name, value):
    # Read userId from userId.js
    user_id = read_user_id()
    if user_id and user_id.startswith("user"):
        # Proceed with writing to the config file
<<<<<<< HEAD
        config_path = os.path.expanduser(f"~/SmartMirror/configs/file{profile_index}.js")
=======
        config_path = f"file{profile_index}.js"
>>>>>>> 7ff5e6846c4e51cd6d35c006beaf65eff2c33eab
        
        # Check if the config file exists
        if not os.path.exists(config_path):
            print(f"Config file {config_path} does not exist.")
            return
        
        # Read the existing configuration content
        with open(config_path, 'r') as file:
            config_content = file.read()
        
        # Modify the configuration object based on the characteristic being written
<<<<<<< HEAD
        new_config_content = config_content
        if characteristic_name == "language":
            old_value = config_content.split('language: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'language: "{old_value}"', f'language: "{value}"')
        elif characteristic_name == "language_disable":
            old_value = config_content.split('module: "language",')[1].split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
        elif characteristic_name == "units":
            old_value = config_content.split('units: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'units: "{old_value}"', f'units: "{value}"')
        elif characteristic_name == "units_disable":
            old_value = config_content.split('module: "units",')[1].split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
        elif characteristic_name == "clock_position":
            old_value = config_content.split('module: "clock",')[1].split('position: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
        elif characteristic_name == "clock_disable":
            old_value = config_content.split('module: "clock",')[1].split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
        elif characteristic_name == "update_notification_position":
            old_value = config_content.split('module: "updatenotification",')[1].split('position: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
        elif characteristic_name == "update_notification_disable":
            old_value = config_content.split('module: "updatenotification",')[1].split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
=======
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
>>>>>>> 7ff5e6846c4e51cd6d35c006beaf65eff2c33eab
        
        # Write the modified configuration back to the JavaScript file
        with open(config_path, 'w') as file:
            file.write(new_config_content)
    else:
        print("Not writing to a file. User ID is not user-specific.")
<<<<<<< HEAD

    # Write the modified configuration back to the JavaScript file
    with open(config_path, 'w') as file:
        file.write(new_config_content)
=======
        return
>>>>>>> 7ff5e6846c4e51cd6d35c006beaf65eff2c33eab
        
class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"
    
    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.add_characteristic(ProfileIndexCharacteristic(self))
        self.add_characteristic(LanguageCharacteristic(self))
        self.add_characteristic(LanguageDisableCharacteristic(self))
        self.add_characteristic(UnitsCharacteristic(self))
        self.add_characteristic(UnitsDisableCharacteristic(self))
        self.add_characteristic(ClockPositionCharacteristic(self))
        self.add_characteristic(ClockDisableCharacteristic(self))
        self.add_characteristic(UpdateNotificationPositionCharacteristic(self))
        self.add_characteristic(UpdateNotificationDisableCharacteristic(self))
        self.add_characteristic(CalendarPositionCharacteristic(self))
        self.add_characteristic(CalendarDisableCharacteristic(self))
        self.add_characteristic(ComplimentsPositionCharacteristic(self))
        self.add_characteristic(ComplimentsDisableCharacteristic(self))
        self.add_characteristic(WeatherPositionCharacteristic(self))
        self.add_characteristic(WeatherDisableCharacteristic(self))
        self.add_characteristic(NewsPositionCharacteristic(self))
        self.add_characteristic(NewsDisableCharacteristic(self))
        print("UserProfileService initialized")

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
        write_to_js_config(self.service.index, "language", languages[self.language])
        
class LanguageDisableCharacteristic(Characteristic):
    LANGUAGE_DISABLE_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.LANGUAGE_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(LanguageDisableDescriptor(self))
        self.disabled = 0
        print("LanguageDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Language disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Language disable written:", self.disabled)
        write_to_js_config(self.service.index, "language_disable", self.disabled)

class UnitsCharacteristic(Characteristic):
    UNITS_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "units", metricsys[self.units])
        
class UnitsDisableCharacteristic(Characteristic):
    UNITS_DISABLE_UUID = "00000006-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(UnitsDisableDescriptor(self))
        self.disabled = 0
        print("UnitsDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Units disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Units disable written:", self.disabled)
        write_to_js_config(self.service.index, "units_disable", self.disabled)

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
        write_to_js_config(self.service.index, "clock_position", positions[self.clock_position])
        
class ClockDisableCharacteristic(Characteristic):
    CLOCK_DISABLE_UUID = "00000006-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(ClockDisableDescriptor(self))
        self.disabled = 0
        print("ClockDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Clock disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Clock disable written:", self.disabled)
        write_to_js_config(self.service.index, "clock_disable", self.disabled)

class UpdateNotificationPositionCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_POSITION_UUID = "00000007-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "update_notification_position", positions[self.update_notification_position])
        
class UpdateNotificationDisableCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_DISABLE_UUID = "00000008-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationDisableDescriptor(self))
        self.disabled = 0
        print("UpdateNotificationDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Update notification disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Update notification disable written:", self.disabled)
        write_to_js_config(self.service.index, "update_notification_disable", self.disabled)

class CalendarPositionCharacteristic(Characteristic):
    CALENDAR_POSITION_UUID = "00000009-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "calendar_position", positions[self.calendar_position])
        
class CalendarDisableCharacteristic(Characteristic):
    CALENDAR_DISABLE_UUID = "0000000A-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarDisableDescriptor(self))
        self.disabled = 0
        print("CalendarDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Calendar disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Calendar disable written:", self.disabled)
        write_to_js_config(self.service.index, "calendar_disable", self.disabled)

class ComplimentsPositionCharacteristic(Characteristic):
    COMPLIMENTS_POSITION_UUID = "0000000B-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "compliments_position", positions[self.compliments_position])
        
class ComplimentsDisableCharacteristic(Characteristic):
    COMPLIMENTS_DISABLE_UUID = "0000000C-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsDisableDescriptor(self))
        self.disabled = 0
        print("ComplimentsDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Compliments disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Compliments disable written:", self.disabled)
        write_to_js_config(self.service.index, "compliments_disable", self.disabled)

class WeatherPositionCharacteristic(Characteristic):
    WEATHER_POSITION_UUID = "0000000D-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "weather_position", positions[self.weather_position])
        
class WeatherDisableCharacteristic(Characteristic):
    WEATHER_DISABLE_UUID = "0000000E-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherDisableDescriptor(self))
        self.disabled = 0
        print("WeatherDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Weather disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Weather disable written:", self.disabled)
        write_to_js_config(self.service.index, "weather_disable", self.disabled)

class NewsPositionCharacteristic(Characteristic):
    NEWS_POSITION_UUID = "0000000F-710e-4a5b-8d75-3e5b444bc3cf"

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
        write_to_js_config(self.service.index, "news_position", positions[self.news_position])
        
class NewsDisableCharacteristic(Characteristic):
    NEWS_DISABLE_UUID = "0000001F-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsDisableDescriptor(self))
        self.disabled = 0
        print("NewsDisableCharacteristic initialized")

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("News disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("News disable written:", self.disabled)
        write_to_js_config(self.service.index, "news_disable", self.disabled)

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
    PROFILE_INDEX_DESCRIPTOR_UUID = "2902"
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
    LANGUAGE_DESCRIPTOR_UUID = "2903"
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
    
class LanguageDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Language Disable".encode()

    def ReadValue(self, options):
        return self.value

class UnitsDescriptor(Descriptor):
    UNITS_DESCRIPTOR_UUID = "2904"
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

class UnitsDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Units Disable".encode()

    def ReadValue(self, options):
        return self.value

class ClockPositionDescriptor(Descriptor):
    CLOCK_POSITION_DESCRIPTOR_UUID = "2905"
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
    
class ClockDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Clock Disable".encode()

    def ReadValue(self, options):
        return self.value

class UpdateNotificationPositionDescriptor(Descriptor):
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID = "2906"
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

class UpdateNotificationDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Update Notification Disable".encode()

    def ReadValue(self, options):
        return self.value

class CalendarPositionDescriptor(Descriptor):
    CALENDAR_POSITION_DESCRIPTOR_UUID = "2907"
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

class CalendarDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Calendar Disable".encode()

    def ReadValue(self, options):
        return self.value

class ComplimentsPositionDescriptor(Descriptor):
    COMPLIMENTS_POSITION_DESCRIPTOR_UUID = "2908"
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
    
class ComplimentsDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Compliments Disable".encode()

    def ReadValue(self, options):
        return self.value

class WeatherPositionDescriptor(Descriptor):
    WEATHER_POSITION_DESCRIPTOR_UUID = "2909"
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
    
class WeatherDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Weather Disable".encode()

    def ReadValue(self, options):
        return self.value

class NewsPositionDescriptor(Descriptor):
    NEWS_POSITION_DESCRIPTOR_UUID = "2910"
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
    
class NewsDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "News Disable".encode()

    def ReadValue(self, options):
        return self.value

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
#app.add_service(UserProfileService(1))
app.register()

adv = UserProfileAdvertisement(0)
adv.register()

try:
    while True:
        app.run()
except KeyboardInterrupt:
    app.quit()
