import dbus

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

class UserProfileService(Service):
    USER_PROFILE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf" # SERVICE UUID

    def __init__(self, index):
        Service.__init__(self, index, self.USER_PROFILE_SVC_UUID, True)
        self.add_characteristic(UserProfileCharacteristic(self))

class UserProfileCharacteristic(Characteristic):
    USER_PROFILE_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf" # USER PROFILE CHAR. 1 UUID

    def __init__(self, service):
        self.profile_index = 0  # Initialize with a default value
        Characteristic.__init__(
                self, self.USER_PROFILE_CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(UserProfileDescriptor(self))

    def ReadValue(self, options):
        value = [dbus.Byte(self.profile_index)]
        print("User profile index read:", self.profile_index)
        return value

    def WriteValue(self, value, options):
        self.profile_index = int(value[0])
        print("User profile index written:", self.profile_index)
        # You can add logic here to load the corresponding user profile based on the index

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
