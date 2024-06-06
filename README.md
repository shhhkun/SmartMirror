# Team3
CSE123B

Structure of our current custom BLE interface between the pi and the phone:

sevice, ID 'xxxx' {
    service SmartMirrorService, UUID 'yyyy' {

        characteristic, desc = "current user",      UUID 'qqq0': int, read/write

        characteristic, desc = "clock position",    UUID 'zzz1': int, read/write
        characteristic, desc = "clock enable",      UUID 'zzz2': int, read/write
        characteristic, desc = "calendar position", UUID 'zzz1': int, read/write
        characteristic, desc = "calendar enable",   UUID 'zzz2': int, read/write
        characteristic, desc = "spotify position",  UUID 'zzzn': int, read/write
        characteristic, desc = "spotify enable",    UUID 'zz1n': int, read/write

    }
}


Structure of our final design custom BLE interface:

sevice, ID 'xxxx' {
    service SmartMirrorService, UUID 'yyyy' {

        characteristic, desc = "current user",      UUID 'qqq0': int, read/write

        characteristic, desc = "authentication",    UUID 'qqq1': string, read/write

        characteristic, desc = "calendar position", UUID 'zzz1': int, read/write
        characteristic, desc = "calendar enable",   UUID 'zzz2': int, read/write
        characteristic, desc = "calendar options",  UUID 'zzz2': JSON serialized, read/write
        ...
    }
}

Approach is for the BLE central to be trusted. The assumption is that if you saw the authentication code and connected to the device, then you would have a hostile unknonw person in your home and you'd have bigger problems.

Some kind of encryption for some stuff. Like when you're passing a token to the mirror over Bluetooth, can someone snoop on those packets.

Some kind of authentication handshake method on both the mirror side and the phone side.

Some kind of protocol for


The "current user" characteristic should basically just expose the system's small JSON file that holds something like current user = 2. If we want to enable profile switching from the app, this should be writeable.

Upon changing the current user (either via fingerprint or a bluetooth command), the module-specific characteristics, z1-zn, should all go away. Then, new characteristics should appear, each with new UUIDs, and exposing different underlying data.

Upon writing to one of these module-specific characteristics, the corresponding section in the user's json config file would be updated with the new content.

----

"Retrieve services" call would get all characteristics and their descriptions.


Have an object that's just changes since last send to mirror - so that you can send just the diffs, not the entire config file.


----