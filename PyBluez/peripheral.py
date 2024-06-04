import os
import re
import time
from enum import Enum

CONFIG_DIR = os.getcwd()

# Define the Characteristic base class
class Characteristic:
    def __init__(self, uuid, properties, service):
        self.uuid = uuid
        self.properties = properties
        self.service = service

    def ReadValue(self, options):
        pass

    def WriteValue(self, value, options):
        pass

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

def write_to_js_config(profile_index, characteristic_name, value):
    print(f"profile index: {profile_index}")
    print(f"characteristic name: {characteristic_name}")
    print(f"value: {value}")
    
    user_id = read_user_id()
    if user_id and user_id.startswith("user"):
        config_path = os.path.expanduser(f"~/Desktop/SmartMirror/App/config/user{profile_index}.js")
        if not os.path.exists(config_path):
            print(f"Config file {config_path} does not exist.")
            return
        with open(config_path, 'r') as file:
            config_content = file.read()
        new_config_content = config_content
        if characteristic_name == "language":
            old_value = config_content.split('language: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'language: "{old_value}"', f'language: "{value}"')
        elif characteristic_name == "units":
            old_value = config_content.split('units: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'units: "{old_value}"', f'units: "{value}"')
        elif characteristic_name == "clock_position":
            old_value = config_content.split('position: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
        elif characteristic_name == "clock_disable":
            old_value = config_content.split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
        elif characteristic_name == "update_notification_position":
            old_value = config_content.split('position: "')[1].split('"')[0]
            new_config_content = config_content.replace(f'position: "{old_value}"', f'position: "{value}"')
        elif characteristic_name == "update_notification_disable":
            old_value = config_content.split('disabled: ')[1].split(',')[0]
            new_config_content = config_content.replace(f'disabled: {old_value}', f'disabled: {value}')
        # Add other characteristics here
        
        with open(config_path, 'w') as file:
            file.write(new_config_content)
    else:
        print("Not writing to a file. User ID is not user-specific.")

class UserProfileService:
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"
    
    def __init__(self, index):
        self.index = index
        self.characteristics = [
            ProfileIndexCharacteristic(self),
            LanguageCharacteristic(self),
            UnitsCharacteristic(self),
            ClockPositionCharacteristic(self),
            ClockDisableCharacteristic(self),
            UpdateNotificationPositionCharacteristic(self),
            UpdateNotificationDisableCharacteristic(self),
            CalendarPositionCharacteristic(self),
            CalendarDisableCharacteristic(self),
            ComplimentsPositionCharacteristic(self),
            ComplimentsDisableCharacteristic(self),
            WeatherPositionCharacteristic(self),
            WeatherDisableCharacteristic(self),
            NewsPositionCharacteristic(self),
            NewsDisableCharacteristic(self)
        ]
        print("UserProfileService initialized")

class ProfileIndexCharacteristic:
    PROFILE_INDEX_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.service = service
        self.value = 0
        print("ProfileIndexCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])

class LanguageCharacteristic:
    LANGUAGE_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.service = service
        self.value = 0
        print("LanguageCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "language", languages[self.value])

class UnitsCharacteristic:
    UNITS_UUID = "00000005-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.service = service
        self.value = 0
        print("UnitsCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "units", metricsys[self.value])

class ClockPositionCharacteristic:
    CLOCK_POSITION_UUID = "00000007-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.service = service
        self.value = 0
        print("ClockPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "clock_position", positions[self.value])

class ClockDisableCharacteristic:
    CLOCK_DISABLE_UUID = "00000008-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        self.service = service
        self.value = 0
        print("ClockDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "clock_disable", self.value)

class UpdateNotificationPositionCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_POSITION_UUID = "00000009-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationPositionDescriptor(self))
        self.value = 0
        print("UpdateNotificationPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "update_notification_position", positions[self.value])

class UpdateNotificationDisableCharacteristic(Characteristic):
    UPDATE_NOTIFICATION_DISABLE_UUID = "0000000a-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.UPDATE_NOTIFICATION_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(UpdateNotificationDisableDescriptor(self))
        self.value = 0
        print("UpdateNotificationDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "update_notification_disable", self.value)

class CalendarPositionCharacteristic(Characteristic):
    CALENDAR_POSITION_UUID = "0000000b-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarPositionDescriptor(self))
        self.value = 0
        print("CalendarPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "calendar_position", positions[self.value])

class CalendarDisableCharacteristic(Characteristic):
    CALENDAR_DISABLE_UUID = "0000000c-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.CALENDAR_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(CalendarDisableDescriptor(self))
        self.value = 0
        print("CalendarDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "calendar_disable", self.value)
        
class ComplimentsPositionCharacteristic(Characteristic):
    COMPLIMENTS_POSITION_UUID = "0000000d-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsPositionDescriptor(self))
        self.value = 0
        print("ComplimentsPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "compliments_position", positions[self.value])

class ComplimentsDisableCharacteristic(Characteristic):
    COMPLIMENTS_DISABLE_UUID = "0000000e-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.COMPLIMENTS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(ComplimentsDisableDescriptor(self))
        self.value = 0
        print("ComplimentsDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "compliments_disable", self.value)

class WeatherPositionCharacteristic(Characteristic):
    WEATHER_POSITION_UUID = "0000000f-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherPositionDescriptor(self))
        self.value = 0
        print("WeatherPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "weather_position", positions[self.value])

class WeatherDisableCharacteristic(Characteristic):
    WEATHER_DISABLE_UUID = "0000001f-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.WEATHER_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(WeatherDisableDescriptor(self))
        self.value = 0
        print("WeatherDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "weather_disable", self.value)

class NewsPositionCharacteristic(Characteristic):
    NEWS_POSITION_UUID = "0000002f-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_POSITION_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsPositionDescriptor(self))
        self.value = 0
        print("NewsPositionCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "news_position", positions[self.value])

class NewsDisableCharacteristic(Characteristic):
    NEWS_DISABLE_UUID = "0000003f-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
            self, self.NEWS_DISABLE_UUID,
            ["read", "write"], service)
        self.add_descriptor(NewsDisableDescriptor(self))
        self.value = 0
        print("NewsDisableCharacteristic initialized")

    def ReadValue(self, options):
        return [self.value]

    def WriteValue(self, value, options):
        self.value = int(value[0])
        write_to_js_config(self.service.index, "news_disable", self.value)

# Define descriptor classes

class Descriptor:
    def __init__(self, uuid, permissions, characteristic):
        self.uuid = uuid
        self.permissions = permissions
        self.characteristic = characteristic

    def ReadValue(self, options):
        pass

class UserProfileDescriptor(Descriptor):
    USER_PROFILE_DESCRIPTOR_UUID = "2901"
    USER_PROFILE_DESCRIPTOR_VALUE = "User Profile Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.USER_PROFILE_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.USER_PROFILE_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class ProfileIndexDescriptor(Descriptor):
    PROFILE_INDEX_DESCRIPTOR_UUID = "2902"
    PROFILE_INDEX_DESCRIPTOR_VALUE = "Profile Index Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.PROFILE_INDEX_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.PROFILE_INDEX_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class LanguageDescriptor(Descriptor):
    LANGUAGE_DESCRIPTOR_UUID = "2903"
    LANGUAGE_DESCRIPTOR_VALUE = "Language Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.LANGUAGE_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.LANGUAGE_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class UnitsDescriptor(Descriptor):
    UNITS_DESCRIPTOR_UUID = "2904"
    UNITS_DESCRIPTOR_VALUE = "Units Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.UNITS_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UNITS_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class ClockPositionDescriptor(Descriptor):
    CLOCK_POSITION_DESCRIPTOR_UUID = "2905"
    CLOCK_POSITION_DESCRIPTOR_VALUE = "Clock Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.CLOCK_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CLOCK_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class ClockDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "Clock Disable".encode()

    def ReadValue(self, options):
        return self.value

class UpdateNotificationPositionDescriptor(Descriptor):
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID = "2906"
    UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE = "Update Notification Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.UPDATE_NOTIFICATION_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class UpdateNotificationDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "Update Notification Disable".encode()

    def ReadValue(self, options):
        return self.value

class CalendarPositionDescriptor(Descriptor):
    CALENDAR_POSITION_DESCRIPTOR_UUID = "2907"
    CALENDAR_POSITION_DESCRIPTOR_VALUE = "Calendar Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.CALENDAR_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.CALENDAR_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class CalendarDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "Calendar Disable".encode()

    def ReadValue(self, options):
        return self.value

class ComplimentsPositionDescriptor(Descriptor):
    COMPLIMENTS_POSITION_DESCRIPTOR_UUID = "2908"
    COMPLIMENTS_POSITION_DESCRIPTOR_VALUE = "Compliments Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.COMPLIMENTS_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.COMPLIMENTS_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class ComplimentsDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "Compliments Disable".encode()

    def ReadValue(self, options):
        return self.value

class WeatherPositionDescriptor(Descriptor):
    WEATHER_POSITION_DESCRIPTOR_UUID = "2909"
    WEATHER_POSITION_DESCRIPTOR_VALUE = "Weather Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.WEATHER_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.WEATHER_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class WeatherDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "Weather Disable".encode()

    def ReadValue(self, options):
        return self.value

class NewsPositionDescriptor(Descriptor):
    NEWS_POSITION_DESCRIPTOR_UUID = "2910"
    NEWS_POSITION_DESCRIPTOR_VALUE = "News Position Descriptor"

    def __init__(self, characteristic):
        super().__init__(
            self.NEWS_POSITION_DESCRIPTOR_UUID,
            ["read"],
            characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.NEWS_POSITION_DESCRIPTOR_VALUE
        for c in desc:
            value.append(c.encode())
        return value

class NewsDisableDescriptor(Descriptor):
    def __init__(self, characteristic):
        super().__init__(
            '2901',
            ["read"],
            characteristic)
        self.value = "News Disable".encode()

    def ReadValue(self, options):
        return self.value

# Define UserProfileAdvertisement class
class UserProfileAdvertisement:
    def __init__(self, index):
        self.index = index
        self.services_uuid = [UserProfileService.USER_PROFILE_SVC_UUID]
        self.include_tx_power = True

    def register(self):
        print("Advertisement registered")

# Define callbacks
def register_app_cb():
    print("GATT application registered")

def register_app_error_cb(error):
    print("Failed to register application: " + str(error))

def register_ad_error_cb(error):
    print("Failed to register advertisement: " + str(error))

# Create an instance of the application
app = Application()

# Add UserProfileService
app.add_service(UserProfileService(0))

# Register the application
register_app_cb()

# Create an instance of UserProfileAdvertisement
adv = UserProfileAdvertisement(0)

# Register the advertisement
adv.register()

try:
    while True:
        app.run()
        time.sleep(1)
except KeyboardInterrupt:
    app.quit()
