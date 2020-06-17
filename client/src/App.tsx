import React, { Component, Fragment } from "react";
import {
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  withStyles,
  WithStyles,
  Icon,
} from "@material-ui/core";
import ReactNipple from "react-nipple";

const HOST_NAME = window.location.hostname;
const DRIVER_PORT = 8080;
const VIDEO_PORT = 8081;

const MAX_SPEED = 255;
const MAX_DIRECTION_MOVEMENT = 45 / 2;
const DIRECTION_CENTER = 95;

const styles = {
  root: {
    height: `calc(100vh - 64px)`,
    width: "100vw",
    overflow: "hidden",
    backgroundImage: `url('http://${HOST_NAME}:${VIDEO_PORT}/')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  },
  video: {
    width: "100%",
    height: "100%",
    margin: "auto",
    zIndex: -1000,
  },
  iconButton: {
    marginRight: 16,
  },
};

const socket = io(`http://${HOST_NAME}:${DRIVER_PORT}`);

type OnMoveEvent = (
  _: any,
  {
    angle: { degree },
    force,
  }: {
    angle: {
      degree: number;
    };
    force: number;
  }
) => void;

interface IProps extends WithStyles {}

interface IState {
  lastPosition: number;
  lastForce: number;
}

class App extends Component<IProps, IState> {
  readonly state: IState = {
    lastPosition: 1,
    lastForce: 0,
  };

  changeDirection = (direction: number) =>
    socket.emit("change-direction", direction);

  changeSpeed = (speed: number) => socket.emit("change-speed", speed);

  shutdown = () => socket.emit("shutdown");

  reboot = () => socket.emit("reboot");

  onMove: OnMoveEvent = (_, { angle: { degree }, force }) => {
    // D / 60 => Only 6 positions available to make the connection lightweight
    let roundedDegrees = degree / 60;
    let roundedForce = Math.round(force);

    // If the force exceeds 1, set to 1
    if (roundedForce > 1) roundedForce = 1;

    // If there was a change in the degrees, update the direction
    if (roundedDegrees !== this.state.lastPosition) {
      // Define where to go based on the degrees
      if (roundedDegrees === 0 || roundedDegrees === 5) {
        this.changeDirection(DIRECTION_CENTER + MAX_DIRECTION_MOVEMENT);
      }
      if (roundedDegrees === 1 || roundedDegrees === 4) {
        this.changeDirection(DIRECTION_CENTER);
      }
      if (roundedDegrees === 2 || roundedDegrees === 3) {
        this.changeDirection(DIRECTION_CENTER - MAX_DIRECTION_MOVEMENT);
      }

      this.setState({ lastPosition: roundedDegrees });
    }

    // If there was a change in the force, update the speed
    if (roundedForce !== this.state.lastForce) {
      // Check if the car is going forward or backwards
      if (roundedDegrees > 2) {
        this.changeSpeed(roundedForce * MAX_SPEED * -1);
      } else {
        this.changeSpeed(roundedForce * MAX_SPEED);
      }

      this.setState({ lastForce: roundedForce });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              IoT Car
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              className={classes.iconButton}
              onClick={this.reboot}
            >
              <Icon>loop</Icon>
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              className={classes.iconButton}
              onClick={this.shutdown}
            >
              <Icon>power_settings_new</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.root} style={{ position: "absolute" }}>
          <ReactNipple
            options={{ color: "blue" }}
            className={classes.root}
            onMove={this.onMove}
          />
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(App);
