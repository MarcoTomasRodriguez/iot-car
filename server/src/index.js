const server = require('http').createServer()
const io = require('socket.io')(server)
const PORT = 8000

io.on('connection', socket => {
    socket.on('status', status => io.emit('status', status))
    socket.on('direction', direction => io.emit('direction', direction))
    socket.on('motors', speed => io.emit('motors', speed))
    socket.on('camera', direction => io.emit('camera', direction))
    socket.on('lights', status => io.emit('lights', status))
    socket.on('shutdown', () => io.emit('shutdown'))
    socket.on('reboot', () => io.emit('reboot'))
})

server.listen(PORT, () => console.log(`Socket.IO Server running on port: ${PORT}`))