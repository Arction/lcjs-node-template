import { Request, Response } from 'express'
import { generateMapChart, addToLatest, getChartOptionsFromSession } from '../chart/chart'

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response) => {
    const options = getChartOptionsFromSession(req, 'map')
    const img = await generateMapChart(options)

    addToLatest(img)
    res.render('map', {
        title: 'Map',
        theme: req.session.theme || 'dark',
    })
}
