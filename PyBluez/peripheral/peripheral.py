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
    RUSSIAN = 3
    FRENCH = 4
    PORTUGUESE = 5
    HINDI = 6
    JAPANESE = 7
    GERMAN = 8
    VIETNAMESE = 9
    
languages = [
    "en", "es", "zh", "ru", "fr", "pt", "hi", "ja", "de", "vi"
]

class MetricSys(Enum):
    METRIC = 0
    IMPERIAL = 1
    
metricsys = [
    "metric", "imperial"
]

def read_user_id():
    user_id_file_path = os.path.expanduser("~/Desktop/SmartMirror/App/js/userId.js")
    if os.path.exists(user_id_file_path):
        with open(user_id_file_path, 'r') as file:
            content = file.read()
            match = re.search(r'exports.userId = "(.*?)"', content)
            if match:
                print(f"current user id: {match.group(1)}")
                return match.group(1)
    return None

def write_to_js_config(characteristic_name, key, value):
    # Read current user id
    user_id = read_user_id()
    if user_id is None:
        return

    # Define file path
    file_path = f"~/Desktop/SmartMirror/App/config/{user_id}.js"
    file_path = os.path.expanduser(file_path)

    # Read content from file
    with open(file_path, 'r') as file:
        config_content = file.read()

    # Update config based on characteristic_name and key
    if characteristic_name == "language":
        config_content = re.sub(r'language: ".*?"', f'language: "{value}"', config_content)
    elif characteristic_name == "units":
        config_content = re.sub(r'units: ".*?"', f'units: "{value}"', config_content)
    elif characteristic_name in ["clock", "updatenotification", "calendar", "compliments", "weather", "news"]:
        if key == "position":
            config_content = re.sub(rf'position: ".*?",( // {characteristic_name} position)', f'position: "{value}",\\1', config_content)
        elif key == "disabled":
            config_content = re.sub(rf'disabled: .*?( // {characteristic_name} disabled)', f'disabled: {value}\\1', config_content)
            
    # Write updated content back to file
    with open(file_path, 'w') as file:
        file.write(config_content)
        
class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"
    
    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.add_characteristic(ProfileIndexCharacteristic(self))
        self.add_characteristic(LanguageCharacteristic(self))
        self.add_characteristic(UnitsCharacteristic(self))
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

class ProfileIndexCharacteristic(Characteristic):
    PROFILE_INDEX_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.PROFILE_INDEX_UUID,
            ["read", "write"], service)
        self.add_descriptor(ProfileIndexDescriptor(self))
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
        self.add_descriptor(LanguageDescriptor(self))
        self.language = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.language)]
        print("Language read:", languages[self.language])
        return value

    def WriteValue(self, value, options):
        self.language = int(value[0])
        print("Language written:", languages[self.language])
        write_to_js_config("language", "", languages[self.language])

class UnitsCharacteristic(Characteristic):
    UNITS_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UNITS_UUID,
            ["read", "write"], service)
        self.add_descriptor(UnitsDescriptor(self))
        self.units = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.units)]
        print("Units read:", metricsys[self.units])
        return value

    def WriteValue(self, value, options):
        self.units = int(value[0])
        print("Units written:", metricsys[self.units])
        write_to_js_config("units", "", metricsys[self.units])

class ClockPositionCharacteristic(Characteristic):
    CLOCK_POSITION_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ClockPositionDescriptor(self))
        self.clock_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.clock_position)]
        print("Clock position read:", positions[self.clock_position])
        return value

    def WriteValue(self, value, options):
        self.clock_position = int(value[0])
        print("Clock position written:", positions[self.clock_position])
        write_to_js_config("clock", "position", positions[self.clock_position])
        
class ClockDisableCharacteristic(Characteristic):
    CLOCK_DISABLE_UUID = "00000006-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CLOCK_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(ClockDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Clock disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Clock disable written:", self.disabled)
        print("Writing value:", value)
        print("Self disabled:", self.disabled)
        write_to_js_config("clock", "disabled", self.disabled)

class UpdateNotificationPositionCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_POSITION_UUID = "00000007-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationPositionDescriptor(self))
        self.update_notification_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.update_notification_position)]
        print("Update notification position read:", positions[self.update_notification_position])
        return value

    def WriteValue(self, value, options):
        self.update_notification_position = int(value[0])
        print("Update notification position written:", positions[self.update_notification_position])
        write_to_js_config("updatenotification", "position", positions[self.update_notification_position])
        
class UpdateNotificationDisableCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_DISABLE_UUID = "00000008-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Update notification disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Update notification disable written:", self.disabled)
        write_to_js_config("updatenotification", "disabled", self.disabled)

class CalendarPositionCharacteristic(Characteristic):
    CALENDAR_POSITION_UUID = "00000009-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarPositionDescriptor(self))
        self.calendar_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.calendar_position)]
        print("Calendar position read:", positions[self.calendar_position])
        return value

    def WriteValue(self, value, options):
        self.calendar_position = int(value[0])
        print("Calendar position written:", positions[self.calendar_position])
        write_to_js_config("calendar", "position", positions[self.calendar_position])
        
class CalendarDisableCharacteristic(Characteristic):
    CALENDAR_DISABLE_UUID = "0000000A-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Calendar disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Calendar disable written:", self.disabled)
        write_to_js_config("calendar", "disabled", self.disabled)

class ComplimentsPositionCharacteristic(Characteristic):
    COMPLIMENTS_POSITION_UUID = "0000000B-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsPositionDescriptor(self))
        self.compliments_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.compliments_position)]
        print("Compliments position read:", positions[self.compliments_position])
        return value

    def WriteValue(self, value, options):
        self.compliments_position = int(value[0])
        print("Compliments position written:", positions[self.compliments_position])
        write_to_js_config("compliments", "position", positions[self.compliments_position])
        
class ComplimentsDisableCharacteristic(Characteristic):
    COMPLIMENTS_DISABLE_UUID = "0000000C-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Compliments disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Compliments disable written:", self.disabled)
        write_to_js_config("compliments", "disabled", self.disabled)

class WeatherPositionCharacteristic(Characteristic):
    WEATHER_POSITION_UUID = "0000000D-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherPositionDescriptor(self))
        self.weather_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.weather_position)]
        print("Weather position read:", positions[self.weather_position])
        return value

    def WriteValue(self, value, options):
        self.weather_position = int(value[0])
        print("Weather position written:", positions[self.weather_position])
        write_to_js_config("weather", "position", positions[self.weather_position])
        
class WeatherDisableCharacteristic(Characteristic):
    WEATHER_DISABLE_UUID = "0000000E-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("Weather disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("Weather disable written:", self.disabled)
        write_to_js_config("weather" "disabled", self.disabled)

class NewsPositionCharacteristic(Characteristic):
    NEWS_POSITION_UUID = "0000000F-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsPositionDescriptor(self))
        self.news_position = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.news_position)]
        print("News position read:", positions[self.news_position])
        return value

    def WriteValue(self, value, options):
        self.news_position = int(value[0])
        print("News position written:", positions[self.news_position])
        write_to_js_config("news", "position", positions[self.news_position])
        
class NewsDisableCharacteristic(Characteristic):
    NEWS_DISABLE_UUID = "0000001F-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsDisableDescriptor(self))
        self.disabled = 0

    def ReadValue(self, options):
        value = [dbus.Byte(self.disabled)]
        print("News disable read:", self.disabled)
        return value

    def WriteValue(self, value, options):
        self.disabled = int(value[0])
        print("News disable written:", self.disabled)
        write_to_js_config("news", "disabled", self.disabled)

class UserProfileDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "User Profile Descriptor".encode()

    def ReadValue(self, options):
        return self.value

class ProfileIndexDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Profile Index".encode()

    def ReadValue(self, options):
        return self.value

class LanguageDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Language".encode()

    def ReadValue(self, options):
        return self.value

class UnitsDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Units".encode()

    def ReadValue(self, options):
        return self.value

class ClockPositionDescriptor(Descriptor):
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Clock Position".encode()

    def ReadValue(self, options):
        return self.value
    
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
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Update Notification Position".encode()

    def ReadValue(self, options):
        return self.value

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
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Calendar Position".encode()

    def ReadValue(self, options):
        return self.value

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
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Compliments Position".encode()

    def ReadValue(self, options):
        return self.value
    
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
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "Weather Position".encode()

    def ReadValue(self, options):
        return self.value
    
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
    def __init__(self, characteristic):
        Descriptor.__init__(
            self, '2901',
            ["read"],
            characteristic)
        self.value = "News Position".encode()

    def ReadValue(self, options):
        return self.value
    
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
