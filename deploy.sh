#!/usr/bin/sudo bash

# Constants
REPOSITORY=https://github.com/MarcoTomasRodriguez/iot-car.git
FOLDER=$HOME/iot-car/
DRIVER_FOLDER=$FOLDER/driver
DRIVER_SERVICE_NAME=car-driver
CLIENT_FOLDER=$FOLDER/client
CLIENT_SERVICE_NAME=car-client
SERVICE_FOLDER=/etc/systemd/system/
USER=root

# Setup and add daemon
setup_service() {
  # Service name
  service_name=$1
  # Folder where the service source is located
  folder=$2

  # Go to service source & setup everything
  cd folder
  npm i

  # Build the service
  npm run build

  # Add service to systemd
  sed -e "s/\${user}/${USER}/" -e "s/\${dir}/${folder}/" ./${service_name}.service > $SERVICE_FOLDER/${service_name}.service
  
  # Enable service
  systemctl enable ${service_name}
}

# Start daemon
start_service() {
  service_name=$1
  systemctl start $service_name 
}

# Install prerequisites
apt update
apt install git nodejs npm build-essential -y
npm install -g serve

# Clone repo
git clone $REPOSITORY $FOLDER

# Setup services
setup_service $DRIVER_SERVICE_NAME $DRIVER_FOLDER 
setup_service $CLIENT_SERVICE_NAME $CLIENT_FOLDER

# Initialize services
start_service $DRIVER_SERVICE_NAME
start_service $CLIENT_SERVICE_NAME