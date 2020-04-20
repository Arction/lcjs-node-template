import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'

import * as homeController from './controllers/home'
import * as submitController from './controllers/submit'

const app = express()

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

// primary routes
app.get('/', homeController.index)
app.get('/submit', submitController.getSubmit)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => next(new Error(req.url)))

// generic error handler
app.use((err: any, req: Request, res: Response) => {
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
