import { Request, Response } from 'express'
import { Themes } from 'lcjs'
import { addToLatest, generateChart, getChartImage } from '../chart/chart'

export const getIndexChart = async (req: Request, res: Response) => {
    const theme = req.session.theme || Themes.dark
    const img = await generateChart({ theme })
    addToLatest(img)
    return img.toFormat('png').pipe(res)
}

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

    const img = await generateChart({
        theme,
    })
    req.session.theme = theme
    addToLatest(img)
    return res.redirect('/')
}
