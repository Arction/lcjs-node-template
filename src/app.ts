import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import session from 'express-session'
import 'sharp'
// IMPORTANT
// the "@arction/lcjs-headless" package should always be imported as soon as possible
// and it has to be imported before anything is imported from the "@arction/lcjs" package!
import 'lcjs-headless'

import * as homeController from './controllers/home'
import * as aboutController from './controllers/about'
import * as chartController from './controllers/charts'

// initialize the application
const app = express()

// express session secret
// in a real application make sure to have better secret and
// to load it from environment instead of hard coding it in source
const SESSION_SECRET = '123'

// express settings and middleware
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: SESSION_SECRET,
    }),
)

// serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

// primary routes
app.get('/', homeController.index)
app.get('/about', aboutController.index)
app.get('/chart/:n', chartController.getLatestChart)
app.post('/chart', chartController.postChart)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => next(new Error(req.url)))

// generic error handler
app.use((err: any, req: Request, res: Response) => {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.status} | ${err}`)

    // create error return only providing error in development
    const localError = {
        error: process.env.NODE_ENV === 'development' ? err : undefined,
        message: err.message,
    }

    // respond with error json
    res.status(err.status || 500).json(localError)
})

export { app }
