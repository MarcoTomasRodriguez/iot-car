import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, makeStyles } from '@material-ui/core'
import { PowerSettingsNew } from '@material-ui/icons'
import io from 'socket.io-client'

const socket = io('http://localhost:8000')

const useStyles = makeStyles(theme => ({
	iconButton: {
		marginRight: theme.spacing(2)
	}
}))

export default () => {
    const classes = useStyles()
    const kill = () => socket.emit('shutdown')
    return (
        <AppBar position='relative'>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    IoT Car
                </Typography>
                <IconButton edge='start' color='inherit' className={classes.iconButton} onClick={kill}>
                    <PowerSettingsNew />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}