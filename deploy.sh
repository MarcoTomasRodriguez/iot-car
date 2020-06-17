#!/usr/bin/sudo bash

REPOSITORY=https://github.com/MarcoTomasRodriguez/iot-car.git
FOLDER=$HOME/iot-car/
DRIVER_FOLDER=$FOLDER/driver
CLIENT_FOLDER=$FOLDER/client
SERVICE_FOLDER=/etc/systemd/system/
USER=root

# Install prerequisites
apt update
apt install git nodejs npm build-essential
npm install -g serve

# Clone repo
git clone $REPOSITORY $FOLDER

# Setup driver
cd $DRIVER_FOLDER
npm run build

# Add driver daemon
sed -e "s/\${user}/$USER/" -e "s/\${dir}/$DRIVER_FOLDER/" ./driver.service > $SERVICE_FOLDER/car-driver.service
systemctl enable car-driver
cd ..

# Setup client
cd $CLIENT_FOLDER
npm run build

# Add client daemon
sed -e "s/\${user}/$USER/" -e "s/\${dir}/$CLIENT_FOLDER/" ./client.service > $SERVICE_FOLDER/car-client.service
systemctl enable car-client
cd ..

# Initialize services
systemctl start car-driver
systemctl start car-client



