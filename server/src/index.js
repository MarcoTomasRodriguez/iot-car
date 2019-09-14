const server = require('http').createServer()
const io = require('socket.io')(server)
const PORT = 8000

io.on('connection', socket => {
    socket.on('status', status => io.emit('status', status))
    socket.on('move car', direction => io.emit('move car', direction))
    socket.on('move camera', direction => io.emit('move camera', direction))
    socket.on('lights', status => io.emit('lights', status))
    socket.on('horn', () => io.emit('horn'))
    socket.on('shutdown', () => io.emit('shutdown'))
})

server.listen(PORT, () => console.log(`Socket.IO Server running on port: ${PORT}`))