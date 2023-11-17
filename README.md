# Cutiebot

[![Cutiebot logo](https://cdn.discordapp.com/app-icons/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.png)](https://discord.com/api/oauth2/authorize?client_id=1055472048899641365&permissions=8&scope=bot%20applications.commands)

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com/) [![forthebadge](images/built%20with-discord.js-.svg)](https://discord.js.org/)

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
