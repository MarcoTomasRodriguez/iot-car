import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AppBar from './components/AppBar'
import Index from './pages'

export default () => (
    <Router>
        <Fragment>
            <AppBar />
            <Route path='/' component={Index} />
        </Fragment>
    </Router>
)