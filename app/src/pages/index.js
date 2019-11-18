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
        backgroundImage: "url('http://192.168.1.100:8081/')",
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

const socket = io('http://192.168.1.100:8000')

export default () => {
    const classes = useStyles()

    const [lastPosition, setLastPosition] = useState(22)
    const [lastForce, setLastForce] = useState(0)

    const MAX_SPEED = 255
    const MAX_FORCE = 1
    const POSITIONS = [...Array(46).keys()]
    const INVERTED_POSITIONS = POSITIONS.reverse()

    const onMove = (_, { angle: { degree }, force }) => {
        let roundedDegree = Math.round(degree / 4)
        if (roundedDegree !== lastPosition) {
            setLastPosition(roundedDegree)
        }
        if (force > MAX_FORCE) force = MAX_FORCE
        if (force !== lastForce) {
            setLastForce(force)
        }
    }

    const move = (degrees, direction, force) => {
        // Starts motors
        if (direction === 'forward') {
            socket.emit('motors', Math.round(MAX_SPEED * force))
        } else {
            socket.emit('motors', Math.round(MAX_SPEED * (force * -1)))
        }

        socket.emit('direction', degrees + 73)
    }

    useEffect(() => {
        if (lastPosition > 45) {
            move(POSITIONS[lastPosition - 45], 'reverse', lastForce)
        } else {
            move(INVERTED_POSITIONS[lastPosition], 'forward', lastForce)
        }
    }, [lastPosition, lastForce])


    return (
        <div className={classes.root}>
            <ReactNipple options={{ color: 'blue' }} className={classes.root} 
                onMove={onMove} />
        </div>
    )
}