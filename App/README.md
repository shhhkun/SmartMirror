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
