#!/usr/bin/env node
/**
 * Module dependencies.
 */

import * as http from 'http'
import { app } from './app'

/**
 * Normalize a port into a number, string, or false.
 */
export const normalizePort = (val: string) => {
    const port = parseInt(val, 10)

    if (Number.isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */
export const onError = (error: any) => (port: number) => {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // eslint-disable-next-line no-console
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            // eslint-disable-next-line no-console
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
export const onListening = (server: any) => () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`
    // eslint-disable-next-line no-console
    console.log(`Listening on ${bind}`)
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError(port))
server.on('listening', onListening(server))
