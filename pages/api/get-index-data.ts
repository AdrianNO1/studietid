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

        const user = db.prepare('SELECT * FROM Users WHERE token = ?').get(token) as { name: string, email: string, id: number } | undefined | null
        if (!user) {
            res.status(401).json({ error: 'Invalid token' })
            return
        }

        const name = user.name
        const studietider = db.prepare(`SELECT 
            Rom.romnavn AS room,
            Studietid.datetime AS time,
            Studietid.timer,
            Studietid.kommentar AS comment,
            Studietid.status,
            Subjects.subjectnavn AS subject
        FROM 
            Studietid
        JOIN 
            Rom ON Studietid.rom_id = Rom.id
        JOIN 
            Subjects ON Studietid.subject_id = Subjects.id
        WHERE 
            Studietid.bruker_id = ?;
        `).all(user.id) as { room: string, time: string, comment: string, subject: string, timer: number, status: string }[]

        const rooms = db.prepare(`SELECT Rom.romnavn AS roomname FROM Rom`).all() as { roomname: string }[]
        const subjects = db.prepare(`SELECT Subjects.subjectnavn AS subjectname FROM Subjects`).all() as { subjectname: string }[]

        res.status(200).json({ name, studietider, rooms, subjects })
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
