This is not functional if simply just starting to run before installing pre-required modules.
To launch, do the following steps:

1. Go into this directory
2. Type 'npm-install'
2a. If you run into version issues, you need to update node package manager.
3. Type npm start run


To do:
Implement profile switching - works currently, just need a way to automate it. 
To test profile switching, make a profile under 'MagicMirror/config' directory. Name it whatever you'd like so long as it ends with a .js extension. 
Follow the template for it under 'default.js'. Any modules removed will not be shown.

After making your profile, go to 'MagicMirror/js/electron.js'. Go to line 163. There, change 'const userId = "config"' line. Change 'config' to the name of your new profile, without the extension. This will make it show your profile. Currently need a way to automate this for the bluetooth team. 


Calendar:

To add your calendar, go to your respective user config, find 'calendar' module,
Change 'url' to the url you can obtain from google with the following steps:
Go to the Google Calendar of the account you'd like to use.
Go to Settings & Privacy
Under the calendar you'd like to share, go to Integrate Calendar
Copy the Public Address in iCal Format
Paste it into 'url' of calendar.

Note: Will only work if you make your calendar public.


Spotify:

Go to modules/MMM-NowPlayingOnSpotify/authorization
Run node app
Follow the instructions found there. 