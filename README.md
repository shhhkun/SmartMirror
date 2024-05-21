# Team3
CSE123B

Structure of our custom BLE interface between the pi and the phone:

Device, ID x {
    Service SmartMirrorService, UUID y {

        characteristic, desc = "current user", UUID z0: int, read/write?

        characteristic, desc = "clock",        UUID z1: JSON serialized, read/write
        characteristic, desc = "weather",      UUID z2: JSON serialized, read/write
        characteristic, desc = "news",         UUID zn: JSON serialized, read/write

    }
}

The "current user" characteristic should basically just expose the system's small JSON file that holds something like current user = 2. If we want to enable profile switching from the app, this should be writeable.

Upon changing the current user (either via fingerprint or a bluetooth command), the module-specific characteristics, z1-zn, should all go away. Then, new characteristics should appear, each with new UUIDs, and exposing different underlying data.

Upon writing to one of these module-specific characteristics, the corresponding section in the user's json config file would be updated with the new content.