import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'
import bcrypt from 'bcryptjs'

type Data = {
    email: string,
    password: string,
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
        if (req.body.email === undefined || req.body.password === undefined) {
            let missingParam = ''
            if (req.body.email === undefined) missingParam = 'email'
            else if (req.body.password === undefined) missingParam = 'password'
            res.status(400).json({ error: `Missing parameter: ${missingParam}` })
            return
        }

        const { email, password } = req.body as Data

        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email) as { email: string, password: string, salt: string, token: string }
        if (!user) {
            res.status(401).json({ error: 'Email is not associated with an account' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, user.salt)
        if (hashedPassword !== user.password) {
            res.status(401).json({ error: 'Invalid password' })
            return
        }

        res.status(200).json({ token: user.token })
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
