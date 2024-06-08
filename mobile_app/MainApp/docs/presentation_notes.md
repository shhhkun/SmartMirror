Mobile app presentation notes

Poll the current user continuously to keep the connection alive during early part of presentation
https://youtu.be/XPClvklzuRY


Mobile app overview
- Used just for setting up and configuring the mirror. Not for ongoing use of the mirror.
- Connects to the mirror via BLE
- The user can move their apps around and hide/show certain ones in our version. In final version, could further configure apps and authenticate when needed (calendar, Spotify, etc)
- For the connection to be established, user must acknowledge on mirror side and on the hone side. With a fingerprint touch and a popup “ok”. Similar to pairing a phone to car bluetooth.

BLE central slide
- We chose react native for the mobile app.
- We had the dilemma of going cross platform vs native.
    - Being closer to the bluetooth stack on native would have definitely been a perk. As opposed to relying on a library that calls the native bluetooth stack and might have worse error reporting and could be less performant.
    - But wanted something cross platform for ease of actually releasing something to the public
    - Chose react native over dart flutter due to previous experience in it
- A React is made up of building blocks known as “components”. Similar to Flutter widgets, for those who are familiar. One screen in an app is a “component”, which might be made up of child components like buttons.
- This presents some issues with state management - like holding onto states of what the user has specified their preferred app configuration to be, or holding onto info about the BLE connected device
- Made the architectural choice to use a special kind of component known as a context provider. Makes it much easier to access and save state from anywhere in the app
    - Wraps the entire app and acts as a global state.
    - Top level one is for BLE services and states
    - One level below is module states
    - Inside that is the rest of the app


BLE custom profile slide
- Here’s a visual representation of how we’re doing our data transfer between the phone and the mirror.
- BLE communication happens over “characteristics”. Like writing or reading a variable on a remote device.
- We faced a dilemma about how much to transfer over one characteristic versus over multiple. Tradeoffs around reliability vs complexity.
- We decided to expose each changeable aspect of the device on one characteristic each.
- Italicized items are not in our functional prototype. In the final design, there would be an addition characteristic for handling adding of new apps, and a characteristic per app that handles app-specific details (like location for weather)
- As mentioned earlier, for a phone to become bonded, need to acknowledge on the mirror and the phone. In general, we assume that if someone can physically access the mirror, then they’re trusted.
    - Otherwise, if you have some unknown hostile stranger in your house, you have bigger problems.
    - Thus we’re not authenticating on every write operation. Instead, once a user is bonded, they can continuously communicate with the mirror without interruption
- For security, we’re using encrypted BLE. Fortunately this is handled by the devices’ bluetooth stacks. This prevents eavesdropping attacks
    - This is relevant for our final design, where you might have sensitive data displayed in emails or a calendar, or you’re dealing with authentication for apps, going through this app options characteristic.
