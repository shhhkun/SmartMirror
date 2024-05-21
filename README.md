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

Upon changing the current user, the remaining characteristics should all go away. Then new services should become availible.