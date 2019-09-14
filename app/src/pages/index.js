import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core'

const socket = io('http://localhost:8000')

const useStyles = makeStyles(theme => ({
    box: {
        padding: theme.spacing(3),
        margin: theme.spacing(2)
    },
    root: {
        height: `calc(100vh - ${theme.spacing(8)}px)`
    },
    img: {
        width: `calc(100% - ${theme.spacing(2)}px)`,
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        alignSelf: 'center'
    }
}))

const execute = e => {
    let key = e.key
    let repeat = e.repeat
    // Events that can be repeated.
    if ([' '].includes(key)) {
        // Space to ring the horn
        socket.emit('horn')
    } else if (['l', 'L'].includes(key)) {
        // L to turn on/off the lights
        socket.emit('lights', true)
    }
    // Events that cannot be repeated
    // Prevents repeating the event while pressing a key. It only detects once.
    if (!repeat) {
        if (['w', 'a', 's', 'd'].includes(key)) {
            // W A S D to move the car
            if (key === ('w' || 'W')) key = 'up'
            else if (key === ('d' || 'D')) key = 'right'
            else if (key === ('s' || 's')) key = 'down'
            else if (key === ('a' || 'A')) key = 'left'
            socket.emit('move car', key)
        } else if (['ArrowLeft', 'ArrowRight'].includes(key)) {
            // <- -> to move the camera
            if (key === 'ArrowRight') key = 'right'
            else if (key === 'ArrowLeft') key = 'left'
            socket.emit('move camera', key)
        }
    }

}

const CustomCard = ({ title, content }) => {
    const classes = useStyles()
    return (
        <Grid item xs={12}>
            <Paper square className={classes.box}>
                <Typography variant='h6' align='center' style={{ fontWeight: 400 }}>
                    {title}
                </Typography>
                <Typography variant='h4' align='center'>
                    {content}
                </Typography>
            </Paper>
        </Grid>
    )
}

export default () => {
    const [status, setStatus] = useState({ lights: false, speed: 0, proximityForward: 0, proximityBack: 0 })
    const classes = useStyles()

    useEffect(() => {
        document.addEventListener('keydown', event => execute(event))
        socket.addEventListener('status', status => setStatus(status))
        return () => {
            document.removeEventListener('keydown')
            socket.removeEventListener('status')
        }
    }, [])

    return (
        <div className={classes.root}>
            <Grid container justify='center'>
                <Grid item xs={3}>
                    <Grid container direction='column'>
                        <CustomCard title='Lights' content={status.lights ? 'On' : 'Off'} />
                        <CustomCard title='Speed' content={`${status.speed} cm/s`} />
                        <CustomCard title='Proximity (forward)' content={`${status.proximityForward} cm`} />
                        <CustomCard title='Proximity (back)' content={`${status.proximityBack} cm`} />
                    </Grid>
                </Grid>
                <Grid item xs={9}>
                    <img 
                        srcSet='https://www.purina.es/gato/purina-one/sites/g/files/mcldtz1856/files/2018-06/Mi_gato_no_come%20%282%29.jpg'
                        className={classes.img}
                        alt='Live video'
                    />
                </Grid>
            </Grid>
        </div>
    )
}