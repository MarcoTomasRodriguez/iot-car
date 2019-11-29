clear
cd ./car && npm i && cd ..
cd ./server && npm i && cd ..
sudo pm2 unstartup ecosystem.config.json
sudo pm2 stop ecosystem.config.json
sudo pm2 start ecosystem.config.json
sudo pm2 startup
sudo pm2 save