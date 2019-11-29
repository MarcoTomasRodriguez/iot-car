import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import ReactNipple from 'react-nipple'
import io from 'socket.io-client'
import 'react-nipple/lib/styles.css'

const useStyles = makeStyles(theme => ({
    root: {
        height: `calc(100vh - ${theme.spacing(8)}px)`,
        width: '100vw',
        position: 'absolute',
        overflow: 'hidden',
        backgroundImage: `url('http://${window.location.hostname}:8081/')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    },
    video: {
        width: '100%',
        height: '100%',
        margin: 'auto',
        zIndex: -1000
    }
}))

const socket = io(`http://${window.location.hostname}:8000`)

export default () => {
    const classes = useStyles()

    const [lastPosition, setLastPosition] = useState(1)
    const [lastForce, setLastForce] = useState(0)

    const MAX_SPEED = 255
    const MIN_MOVE = 45 / 2
    const CENTER = 95

    const onMove = (_, { angle: { degree }, force }) => {
        let roundedDegree = ~~(degree / 60)
        let roundedForce = Math.round(force)

        if (roundedForce > 1) roundedForce = 1 

        if (roundedDegree !== lastPosition) {
            setLastPosition(roundedDegree)
        }

        if (roundedForce !== lastForce) {
            setLastForce(roundedForce)
        }
    }

    useEffect(() => {
        let direction
        switch(lastPosition) {
            case 0:
                direction = CENTER + MIN_MOVE
                break
            case 1:
                direction = CENTER
                break
            case 2:
                direction = CENTER - MIN_MOVE
                break
            case 3:
                direction = CENTER - MIN_MOVE
                break
            case 4:
                direction = CENTER
                break
            case 5:
                direction = CENTER + MIN_MOVE
                break
        }
        socket.emit('direction', direction)
	if (lastPosition > 2) {
	    socket.emit('motors', (lastForce * MAX_SPEED) * -1)
	} else {
            socket.emit('motors', lastForce * MAX_SPEED)
	}
    }, [lastPosition, lastForce])


    return (
        <div className={classes.root}>
            <ReactNipple options={{ color: 'blue' }} className={classes.root} 
                onMove={onMove} />
        </div>
    )
}
