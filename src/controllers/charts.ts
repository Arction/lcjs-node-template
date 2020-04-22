import { Request, Response } from 'express'
import { addToLatest, generateChart, getChartImage, getChartOptionsFromSession } from '../chart/chart'

export const getLatestChart = async (req: Request, res: Response) => {
    const id = Number(req.params.n)
    const img = getChartImage(id)
    if (img) {
        return img.clone().toFormat('png').pipe(res)
    }
    return res.sendStatus(404)
}

export const postChart = async (req: Request, res: Response) => {
    let theme: 'dark' | 'light' = 'dark'
    console.log(req.body)
    switch (req.body.theme.toLowerCase()) {
        case 'light':
            theme = 'light'
            break
        default:
            theme = 'dark'
    }

    req.session.theme = theme
    if (req.body.title) {
        req.session.chartTitle = req.body.title
    }
    const options = getChartOptionsFromSession(req)
    const img = await generateChart(options)
    addToLatest(img)
    return res.redirect('/')
}
