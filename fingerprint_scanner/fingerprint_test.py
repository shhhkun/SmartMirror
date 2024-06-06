# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

import time
import board
import busio
from digitalio import DigitalInOut, Direction
import adafruit_fingerprint
import os # used to change dirs
import re # Needed for regex

led = DigitalInOut(board.D13)
led.direction = Direction.OUTPUT

#uart = busio.UART(board.TX, board.RX, baudrate=57600)

# If using with a computer such as Linux/RaspberryPi, Mac, Windows with USB/serial converter:
# import serial
# uart = serial.Serial("/dev/ttyUSB0", baudrate=57600, timeout=1)

# If using with Linux/Raspberry Pi and hardware UART:
import serial
uart = serial.Serial("/dev/ttyS0", baudrate=57600, timeout=1)

finger = adafruit_fingerprint.Adafruit_Fingerprint(uart)

##################################################


def get_fingerprint():
    """Get a finger print image, template it, and see if it matches!"""
    print("Waiting for image...")
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    print("Templating...")
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False
    print("Searching...")
    if finger.finger_search() != adafruit_fingerprint.OK:
        return False
    return True


# pylint: disable=too-many-branches
def get_fingerprint_detail():
    """Get a finger print image, template it, and see if it matches!
    This time, print out each error instead of just returning on failure"""
    print("Getting image...", end="")
    i = finger.get_image()
    if i == adafruit_fingerprint.OK:
        print("Image taken")
    else:
        if i == adafruit_fingerprint.NOFINGER:
            print("No finger detected")
        elif i == adafruit_fingerprint.IMAGEFAIL:
            print("Imaging error")
        else:
            print("Other error")
        return False

    print("Templating...", end="")
    i = finger.image_2_tz(1)
    if i == adafruit_fingerprint.OK:
        print("Templated")
    else:
        if i == adafruit_fingerprint.IMAGEMESS:
            print("Image too messy")
        elif i == adafruit_fingerprint.FEATUREFAIL:
            print("Could not identify features")
        elif i == adafruit_fingerprint.INVALIDIMAGE:
            print("Image invalid")
        else:
            print("Other error")
        return False

    print("Searching...", end="")
    i = finger.finger_fast_search()
    # pylint: disable=no-else-return
    # This block needs to be refactored when it can be tested.
    if i == adafruit_fingerprint.OK:
        print("Found fingerprint!")
        return True
    else:
        if i == adafruit_fingerprint.NOTFOUND:
            print("No match found")
        else:
            print("Other error")
        return False


# pylint: disable=too-many-statements
def enroll_finger(location):
    """Take a 2 finger images and template it, then store in 'location'"""
    for fingerimg in range(1, 3):
        if fingerimg == 1:
            print("Place finger on sensor...", end="")
        else:
            print("Place same finger again...", end="")

        while True:
            i = finger.get_image()
            if i == adafruit_fingerprint.OK:
                print("Image taken")
                break
            if i == adafruit_fingerprint.NOFINGER:
                print(".", end="")
            elif i == adafruit_fingerprint.IMAGEFAIL:
                print("Imaging error")
                return False
            else:
                print("Other error")
                return False

        print("Templating...", end="")
        i = finger.image_2_tz(fingerimg)
        if i == adafruit_fingerprint.OK:
            print("Templated")
        else:
            if i == adafruit_fingerprint.IMAGEMESS:
                print("Image too messy")
            elif i == adafruit_fingerprint.FEATUREFAIL:
                print("Could not identify features")
            elif i == adafruit_fingerprint.INVALIDIMAGE:
                print("Image invalid")
            else:
                print("Other error")
            return False

        if fingerimg == 1:
            print("Remove finger")
            time.sleep(1)
            while i != adafruit_fingerprint.NOFINGER:
                i = finger.get_image()

    print("Creating model...", end="")
    i = finger.create_model()
    if i == adafruit_fingerprint.OK:
        print("Created")
    else:
        if i == adafruit_fingerprint.ENROLLMISMATCH:
            print("Prints did not match")
        else:
            print("Other error")
        return False

    print("Storing model #%d..." % location, end="")
    i = finger.store_model(location)
    if i == adafruit_fingerprint.OK:
        print("Stored")
    else:
        if i == adafruit_fingerprint.BADLOCATION:
            print("Bad storage location")
        elif i == adafruit_fingerprint.FLASHERR:
            print("Flash storage error")
        else:
            print("Other error")
        return False

    return True


##################################################

# used to keep track of
failed_attempts = 0

def change_user():
    # Change dirs to access the file to change users
    os.chdir('../App/js')

# Opens userId.js file and reads the number of users currently enrolled
def read_num_users(file_path):
    try:
        with open(file_path, 'r') as file:
            for line in file:
                match = re.search(r'exports\.numUsers\s*=\s*(\d+);', line)
                if match:
                    num_users_str = match.group(1)
                    return int(num_users_str)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    return None  # Return None if the file wasn't found or the number wasn't found

# My edited code to assign a number to each new user
def get_num():
    """Use input() to get a valid number from 1 to 127. Retry till success!"""
    i = 0
    while (i > 127) or (i < 1):
        try:
            i = read_num_users('../App/js/userId.js') # will open userId.js and read the number of users
            if i == None:
                print("Error reading number of users")
        except ValueError:
            pass
    i += 1
    #DEBUG
    i = int(input("Enter ID # from 1-127: "))
    print("i is: ", i)
    return i

# def get_num():
#     """Use input() to get a valid number from 1 to 127. Retry till success!"""
#     i = 0
#     while (i > 127) or (i < 1):
#         try:
#             i = int(input("Enter ID # from 1-127: "))
#         except ValueError:
#             pass
#     return i

# My code that will always run to detect new fingerprints
# This is meant to work with the electron.js program for MM. This will output to console so that
# the electron.js program can detect and switch users accordingly. It does this by first always
# looking for a fingerprint, once it finds one, it will change the active user by editing the
# userId.js file userID string to the found fingerprint. If no fingerprint is found, it will
# output "User not found" to the console so that the electron.js program can detect and prompt
# the user if they would like to enroll a new fingerprint, if the user does want to enroll a new
# fingerprint, then the user will just place the unenrolled fingerprint again and it will create
# a new user and enroll the fingerprint. If it was a mistake, the user can just ignore the prompt
# and placed an enrolled fingerprint again and it will detect the user and switch accordingly.
#
# TLDR; Code below will always be looking for enrolled fingerprints and edit userId.js file to
# change user profiles by editing a string in the file, otherwise if it doesn't find a fingerprint
# it will print "User not found" to the console twice so that the electron.js program can detect 2
# negatives and create a new user.
while True:
    time.sleep(1) # Will sleep the counter to not spam consoled
    # Initial check to make sure it can find fingerprints
    if finger.read_templates() != adafruit_fingerprint.OK:
        raise RuntimeError("Failed to read templates")

    # If failed fingerprints is 2, then it will prompt the user to enroll a new fingerprint
    if failed_attempts == 2:
        failed_attempts = 0 # Reset failed attempts
        print("ENROLLING", flush=True)

        enroll_finger(get_num())
    if get_fingerprint(): # Will always find a fingerprint first, and then react accordingly
        # Resets counter for failed attempts
        failed_attempts = 0
        # Prints to console for node.js module to detect and switch user accordingly
        print("user", finger.finger_id, "with confidence", finger.confidence) # Debugging only
    else:
        # Prints no user found so js module can detect and prompt if they want to enroll a new user
        print("READ_FAIL", flush=True) # Input for ProfileManager
        failed_attempts += 1


# while True:
#     print("----------------")
#     if finger.read_templates() != adafruit_fingerprint.OK:
#         raise RuntimeError("Failed to read templates")
#     print("Fingerprint templates:", finger.templates)
#     print("e) enroll print")
#     print("f) find print")
#     print("d) delete print")
#     print("----------------")
#     c = input("> ")

#     if c == "e":
#         enroll_finger(get_num())
#     if c == "f":
#         if get_fingerprint():
#             # Prints to console for node.js module to detect and switch user accordingly
#             print("Detected #", finger.finger_id, "with confidence", finger.confidence)
#         else:
#             print("User not found") # Print error message to stdout for
#     if c == "d":
#         if finger.delete_model(get_num()) == adafruit_fingerprint.OK:
#             print("Deleted!")
#         else:
#             print("Failed to delete")
