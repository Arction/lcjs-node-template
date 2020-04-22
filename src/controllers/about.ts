import { Request, Response } from 'express'

/**
 * GET /about
 * About page.
 */
export const index = async (req: Request, res: Response) => {
    res.render('about', {
        title: 'About',
    })
}
