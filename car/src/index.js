const { exec } = require('child_process')
const detect = require('detect-port')
const io = require('socket.io-client')

const UI_PORT = 3000
const SERVER_PORT = 8000

const socket = io('http://localhost:8000')

const kill = () => exec('sudo shutdown -h now')

socket.on('shutdown', kill)

const status = (res, def) => res !== def ? 'running' : 'not running'

const modules = async () => {
    const ui = await detect(UI_PORT)
    const server = await detect(SERVER_PORT)
    console.log('Modules:')
    console.log('Car: running.')
    console.log(`UI: ${status(ui, UI_PORT)}.`)
    console.log(`Server: ${status(server, SERVER_PORT)}.`)
}

modules()