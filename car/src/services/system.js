const { exec } = require('child_process')

const service = async (socket) => {
    socket.on('shutdown', () => exec('sudo shutdown -h now'))
    socket.on('reboot', () => exec('sudo reboot'))
}

module.exports = service