import { Request, Response } from 'express'
import { addToLatest, generateChart, generateMapChart, getChartImage, getChartOptionsFromSession } from '../chart/chart'

/**
 * GET /chart/:n
 * Fetch one of the latest chart images.
 * :n defines which of the charts to get.
 * If the chart image doesn't exist, return 404 status
 */
export const getLatestChart = async (req: Request, res: Response) => {
    const id = Number(req.params.n)
    const img = getChartImage(id)
    if (img) {
        return res.send(img)
    }
    return res.sendStatus(404)
}

/**
 * POST /chart
 * Chart settings submit
 */
export const postChart = async (req: Request, res: Response) => {
    // resolve theme
    let theme: 'dark' | 'light' = 'dark'
    switch (req.body.theme.toLowerCase()) {
        case 'light':
            theme = 'light'
            break
        default:
            theme = 'dark'
    }
    const chartType = req.query.type ? req.query.type.toString() : 'xy'
    // store chart generation settings in the session
    req.session.theme = theme
    if (req.body.title) {
        req.session.chartTitle = req.body.title
    }

    // get stored settings from current user session
    const options = getChartOptionsFromSession(req, chartType)
    // generate a new chart image and store it to the latest generated charts list
    let img
    if (chartType === 'map') {
        img = await generateMapChart(options)
    } else {
        img = await generateChart(options)
    }
    addToLatest(img)
    // redirect back to home page, home page will load the generated chart from latest chart list
    if (chartType === 'map') {
        return res.redirect('/map')
    }
    return res.redirect('/')
}
