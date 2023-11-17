clear
echo "*************************************************"
echo "*                                               *"
echo "*           Welcome to the Cutiebot             *"
echo "*                  Installer                    *"
echo "*                                               *"
echo "*************************************************"

echo "Making Cuitebot home directory"
if [ -d /usr/local/bin/cutiebot ]; then
    rm -rf /usr/local/bin/cutiebot
fi
mkdir -p /usr/local/bin/cutiebot
echo "Cutiebot is at: /usr/local/bin/cutiebot"

cd /usr/local/bin/cutiebot

echo "*************************************************"
echo "*                                               *"
echo "*             Downloading Cutiebot              *"
echo "*                                               *"
echo "*************************************************"
git clone https://github.com/Mistyttm/cutiebot.git ./

clear
echo "*************************************************"
echo "*                                               *"
echo "*           Installing dependencies             *"
echo "*                                               *"
echo "*************************************************"

npm i

clear
echo "*************************************************"
echo "*                                               *"
echo "*                 Creating ENV                  *"
echo "*                                               *"
echo "*************************************************"
echo "Please enter your bot App ID:"
read APPID
echo "Please enter your bot token:"
read TOKEN
clear
echo "*************************************************"
echo "*                                               *"
echo "*                 Creating ENV                  *"
echo "*                                               *"
echo "*************************************************"
echo "Please create an email account that will be used to send emails from the bot (eg. yahoo mail, do not use Gmail)"
echo "Enter your email host (eg. smtp.mail.yahoo.com):"
read HOST
echo "Enter your email:"
read EMAIL
echo "Enter your email password:"
read EMAILPASSWORD
clear
echo "*************************************************"
echo "*                                               *"
echo "*                 Creating ENV                  *"
echo "*                                               *"
echo "*************************************************"
echo "Please create an account at www.weatherapi.com and get your API key"
echo "Enter it here:"
read WEATHERAPIKEY

# Generate .env file
echo "[bot]" > .env
echo "APP_ID=$APPID" >> .env
echo "TOKEN=$TOKEN" >> .env
echo "[email]" >> .env
echo "EMAIL_HOST=$HOST" >> .env
echo "EMAIL_USER=$EMAIL" >> .env
echo "EMAIL_PASSWORD=$EMAILPASSWORD" >> .env
echo "[weatherapi]" >> .env
echo "WEATHER_API_KEY=$WEATHERAPIKEY" >> .env

clear
echo "*************************************************"
echo "*                                               *"
echo "*            Adding system service              *"
echo "*                                               *"
echo "*************************************************"
echo ""
echo "Would you like to add Cutiebot as a system service? [y/n]"
read SERVICERESPONSE

if [ "$SERVICERESPONSE" = "n" ] || [ "$SERVICERESPONSE" = "N" ]; then
    echo "Skipping service install"
else
    echo "Installing service"
    cp ./cutiebot.service /etc/systemd/system/cutiebot.service
    systemctl enable cutiebot.service
    echo "starting service"
    systemctl start cutiebot.service
fi

echo "*************************************************"
echo "*                                               *"
echo "*             Thank you for using               *"
echo "*                   Cutiebot                    *"
echo "*                                               *"
echo "*************************************************"
echo "To see the current status of Cutiebot run:"
echo "systemctl status cutiebot.service"
echo "To disable Cutiebot from starting on boot run:"
echo "systemctl disable cutiebot.service"
