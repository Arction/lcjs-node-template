import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const getSubmit = (req: Request, res: Response) => {
    res.render('submit', {
        title: 'Submit',
    })
}
