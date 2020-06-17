import { Motors, Servo } from "johnny-five";

// Maximum turning angle defined by the design
const MAXIMUM_TURNING_ANGLE = 45 / 2;

// Johnny five maximum speed
const MAXIMUM_MOTORS_SPEED = 255;

// Servo center defined by the design
const DIRECTION_CENTER = 95;

// Direction limits
const MAXIMUM_TURNING_RIGHT = DIRECTION_CENTER + MAXIMUM_TURNING_ANGLE;
const MAXIMUM_TURNING_LEFT = DIRECTION_CENTER - MAXIMUM_TURNING_ANGLE;

// Direction servo
const directionServo = new Servo({ pin: 16, startAt: DIRECTION_CENTER });

// Front and rear motors
const motors = new Motors([
  { pins: { pwm: 32, dir: 36 }, invertPWM: true },
  { pins: { pwm: 40, dir: 38 }, invertPWM: true },
]);

// Changes the current speed of the car
export function changeSpeed(speed: number) {
  // If the speed exceeds the maximum, set it to his limits.
  if (speed > MAXIMUM_MOTORS_SPEED) speed = MAXIMUM_MOTORS_SPEED;
  else if (speed < MAXIMUM_MOTORS_SPEED * -1) speed = MAXIMUM_MOTORS_SPEED * -1;

  const sign = Math.sign(speed);

  // Depending on the numeric sign, goes in the intended direction
  if (sign === 1) motors.forward(speed * -1);
  else if (sign === -1) motors.reverse(speed * -1);
  else motors.stop();
}

// Changes the current direction of the car
export function changeDirection(direction: number) {
  // If the direction exceeds the maximum, set it to his limits.
  if (direction > MAXIMUM_TURNING_LEFT) direction = MAXIMUM_TURNING_LEFT;
  else if (direction < MAXIMUM_TURNING_RIGHT) direction = MAXIMUM_TURNING_RIGHT;

  // Change direction
  directionServo.to(direction);
}
