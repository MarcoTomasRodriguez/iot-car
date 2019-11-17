const { RaspiIO } = require('raspi-io')
const { Board } = require('johnny-five')
const detect = require('detect-port')
const io = require('socket.io-client')
const car = require('./services/car')

const UI_PORT = 3000
const SERVER_PORT = 8000

const socket = io('http://localhost:8000')

const status = async port => await detect(port) !== port ? 'running' : 'not running'

const modules = async () => {
    // Shows the current status of all the services
    console.log('Modules:')
    console.log('Car: running.')
    console.log(`UI: ${await status(UI_PORT)}.`)
    console.log(`Server: ${await status(SERVER_PORT)}.`)

    // Initialize the board
    const board = new Board({ io: new RaspiIO(), repl: false })

    // Starts all the car services.
    car(board, socket)
    // camera(board, socket) NOT IMPLEMENTED YET!
    // system(socket) NOT IMPLEMENTED YET!
}

modules()
