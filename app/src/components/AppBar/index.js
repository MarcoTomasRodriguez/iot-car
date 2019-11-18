import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, makeStyles } from '@material-ui/core'
import { PowerSettingsNew, Loop } from '@material-ui/icons'
import io from 'socket.io-client'
import ip from 'local-ip'

const socket = io(`http://${ip('wlan0')}:8000`)

const useStyles = makeStyles(theme => ({
	iconButton: {
		marginRight: theme.spacing(2)
	}
}))

export default () => {
    const classes = useStyles()
    const shutdown = () => socket.emit('shutdown')
    const reboot = () => socket.emit('reboot')
    return (
        <AppBar position='relative'>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    IoT Car
                </Typography>
                <IconButton edge='start' color='inherit' className={classes.iconButton} onClick={reboot}>
                    <Loop />
                </IconButton>
                <IconButton edge='start' color='inherit' className={classes.iconButton} onClick={shutdown}>
                    <PowerSettingsNew />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}