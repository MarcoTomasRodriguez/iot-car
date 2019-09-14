import React from 'react'
import ReactDOM from 'react-dom'
import { unregister } from './serviceWorker'
import Router from './router'

import './index.css'

ReactDOM.render(<Router />, document.getElementById('root'))

unregister()
