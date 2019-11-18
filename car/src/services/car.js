const { Motors, Servo } = require('johnny-five')

const MAXIMUM_TURNING_ANGLE = 45 / 2

const MAXIMUM_MOTORS_SPEED = 255

const DIRECTION_CENTER = 95

// Tower Pro SG90
const DIRECTION_SERVO= { pin: 'GPIO23', startAt: DIRECTION_CENTER }

// 3-6V Motor w/ Gearbox
const MOTORS = [
    { pins: { pwm: 'GPIO12', dir: 'GPIO16' }, invertPWM: true }, 
    { pins: { pwm: 'GPIO21', dir: 'GPIO20' }, invertPWM: true }
]

class Car {
    constructor() {
        this._direction = new Servo(DIRECTION_SERVO)
        this._motors = new Motors(MOTORS)
    }

    motors(speed) {
        if (speed > MAXIMUM_MOTORS_SPEED) speed = MAXIMUM_MOTORS_SPEED
        else if (speed < MAXIMUM_MOTORS_SPEED * -1) speed = MAXIMUM_MOTORS_SPEED * -1
        console.log(speed, Math.sign(speed))
	switch (Math.sign(speed)) {
            case -1:
                this._motors.rev(speed * -1)
            case -0:
                this._motors.stop()
                break
            case 0:
                this._motors.stop()
                break
            case 1:
                this._motors.fwd(speed)
                break
            default:
                break
        }
    }

    direction(degrees) {
        if (degrees > DIRECTION_CENTER + MAXIMUM_TURNING_ANGLE) {
            degrees = DIRECTION_CENTER + MAXIMUM_TURNING_ANGLE
        } else if (degrees < DIRECTION_CENTER - MAXIMUM_TURNING_ANGLE) {
            degrees = DIRECTION_CENTER - MAXIMUM_TURNING_ANGLE
        }
        this._direction.to(degrees)
    }
}

const service = async (board, socket) => {
    const car = new Car()
    board.on('ready', () => {
        socket.on('motors', speed => car.motors(speed))
        socket.on('direction', direction => car.direction(direction))
    })
}

module.exports = service
