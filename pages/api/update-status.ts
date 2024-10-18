import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'
import bcrypt from 'bcryptjs'

type Data = {
    token: string,
    status: string,
    id: number,
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

        if (req.body.token === undefined || req.body.status === undefined || req.body.id === undefined) {
            let missingParam = ''
            if (req.body.token === undefined) missingParam = 'token'
            else if (req.body.status === undefined) missingParam = 'status'
            else if (req.body.id === undefined) missingParam = 'id'
            res.status(400).json({ error: `Missing parameter: ${missingParam}` })
            return
        }

        const { token, status, id } = req.body as Data

        const user = db.prepare('SELECT * FROM Users WHERE token = ?').get(token) as { name: string, email: string, id: number } | undefined | null
        if (!user) {
            res.status(401).json({ error: 'Invalid token' })
            return
        }

        if (status !== 'venter på godkjenning' && status !== 'godkjent' && status !== 'avvist') {
            res.status(400).json({ error: 'Invalid status' })
            return
        }

        const result = db.prepare('UPDATE Studietid SET status = ? WHERE id = ?').run(status, id)
        
        if (result.changes === 0) {
            res.status(404).json({ error: 'Row with the specified ID not found' })
            return
        }

        res.status(200).json({ success: true})
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
