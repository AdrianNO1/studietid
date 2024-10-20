import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'

type Data = {
    token: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        if (!req.body) {
            res.status(400).json({ error: 'No body provided' })
            return
        }
        if (req.body.token === undefined) {
            let missingParam = ''
            if (req.body.token === undefined) missingParam = 'token'
            res.status(400).json({ error: `Missing parameter: ${missingParam}` })
            return
        }

        const { token } = req.body as Data

        const user = db.prepare('SELECT * FROM Users WHERE token = ?').get(token) as { name: string, email: string, id: number, isAdmin: number } | undefined | null
        let isvalid = user ? true : false
        let isAdmin = user && user.isAdmin

        res.status(200).json({ isvalid, isAdmin })
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
