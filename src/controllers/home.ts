import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response) => {
    res.render('home', {
        title: 'Home',
        theme: req.session.theme || 'dark',
        chartTitle: req.session.chartTitle || 'ChartXY',
    })
}
