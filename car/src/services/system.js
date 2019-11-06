import { exec } from "child_process"

const service = async (socket) => {
    socket.on('connection', socket => {
        socket.on('shutdown', () => exec('sudo shutdown -h now'))
        socket.on('reboot', () => exec('sudo reboot'))
    })
}