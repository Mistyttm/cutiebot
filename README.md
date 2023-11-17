# Cutiebot

[![Cutiebot logo](https://cdn.discordapp.com/app-icons/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.png)](https://discord.com/api/oauth2/authorize?client_id=1055472048899641365&permissions=8&scope=bot%20applications.commands)

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com/) [![forthebadge](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjcuNDQ5OTk2OTQ4MjQyMiIgaGVpZ2h0PSIzNSIgdmlld0JveD0iMCAwIDIyNy40NDk5OTY5NDgyNDIyIDM1Ij48cmVjdCB3aWR0aD0iMTA4LjQ4MzMyOTc3Mjk0OTIyIiBoZWlnaHQ9IjM1IiBmaWxsPSIjZjVhNjIzIi8+PHJlY3QgeD0iMTA4LjQ4MzMyOTc3Mjk0OTIyIiB3aWR0aD0iMTE4Ljk2NjY2NzE3NTI5Mjk3IiBoZWlnaHQ9IjM1IiBmaWxsPSIjZGM5MzFiIi8+PHRleHQgeD0iNTQuMjQxNjY0ODg2NDc0NjEiIHk9IjE3LjUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSInUm9ib3RvJywgc2Fucy1zZXJpZiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyIj5CVUlMVCBXSVRIPC90ZXh0Pjx0ZXh0IHg9IjE2Ny45NjY2NjMzNjA1OTU3IiB5PSIxNy41IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iOTAwIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIiPkRJU0NPUkQuSlM8L3RleHQ+PC9zdmc+)](https://discord.js.org/)

This is a reimplementation of the legacy python based [Cutiebot](https://github.com/cutiedevs/LegacyDiscordQUTVerificationBot). It has been rebuilt from the ground up in JavaScript and [Discord.js](https://discord.js.org/). It was designed to be used with QUT discord servers as a helping hand for QUT students.

[Invite Cutiebot to your server:](https://discord.com/api/oauth2/authorize?client_id=1055472048899641365&permissions=8&scope=bot%20applications.commands)

## Features

 - Verification based on QUT emails
   - Students send their student numbers and are emailed a verification code
 - QUT unit code search
   - Shows basic information about a unit
 - Command to link to HiQ
 - Command to link to the QUT MOPP
 - Command to tell you the current weather at QUT
 - Moderation commands
   - Channel purge
   - User timeout

## Install

**REQUIREMENTS:**
You will need a discord developer account with a bot application and an email client that doesn't require OAuth authentication (Don't use gmail, I personally use Yahoo email).

To install cutiebot and run it locally you can download the latest release of the installer for your system from the releases tab on the side.

### Linux
 - Ensure that the script has proper permissions to run: `chmod +x install_linux_v*.sh` (replace * with your script version number)
 - Once you have done that run the script as a super user: `sudo ./install_linux_v*.sh` as the script adds files in the `/usr/local/bin` directory

### MacOS

 - I currently don't have a MacOS device in order to create this script I am more than open to recieving help with this

### Windows

- I currently don't have a Windows device in order to create this script I am more than open to recieving help with this

## Uninstall

In order to uninstall Cutiebot run this command: `sudo rm -rf /usr/local/bin/cutiebot`
