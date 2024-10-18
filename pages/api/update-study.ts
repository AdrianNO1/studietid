// new-study.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'
import bcrypt from 'bcryptjs'

type Data = {
    token: string,
    subject: number,
    room: number,
    startTime: Date,
    duration: number,
    mode: "add" | "edit" | "delete",
    id?: number
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

        if (req.body.token === undefined || ((req.body.subject === undefined || req.body.room === undefined || req.body.startTime === undefined || req.body.duration === undefined) && req.body.mode !== "delete")) {
            let missingParam = ''
            if (req.body.token === undefined) missingParam = 'token'
            else if (req.body.subject === undefined) missingParam = 'subject'
            else if (req.body.room === undefined) missingParam = 'room'
            else if (req.body.startTime === undefined) missingParam = 'startTime'
            else if (req.body.duration === undefined) missingParam = 'duration'
            res.status(400).json({ error: `Missing parameter: ${missingParam}` })
            return
        }

        if ((req.body.mode === "edit" || req.body.mode === "delete") && req.body.id === undefined) {
            res.status(400).json({ error: 'Missing parameter: id' })
            return
        }
        
        const { token, subject, room, startTime, duration, mode, id } = req.body as Data

        const user = db.prepare('SELECT * FROM Users WHERE token = ?').get(token) as { name: string, email: string, id: number } | undefined | null
        if (!user) {
            res.status(401).json({ error: 'Invalid token' })
            return
        }

        // Check if the subject and room exists and get their ids
        const subjectRow = db.prepare('SELECT id, subjectnavn FROM Subjects WHERE subjectnavn = ?').get(subject) as { id: number, subjectnavn: string } | undefined | null
        if (!subjectRow) {
            res.status(400).json({ error: 'Invalid subject' })
            return
        }

        const roomRow = db.prepare('SELECT id, romnavn FROM Rom WHERE romnavn = ?').get(room) as { id: number, romnavn: string } | undefined | null
        if (!roomRow) {
            res.status(400).json({ error: 'Invalid room' })
            return
        }

        // Check if the user already has a study time at the same time
        //const studyTime = db.prepare('SELECT * FROM Studietid WHERE bruker_id = ? AND datetime = ?').get(user.id, startTime) as { id: number, datetime: string } | undefined | null
        //if (studyTime) {
        //    res.status(400).json({ error: 'User already has a study time at the same time' })
        //    return
        //}

        if (mode === "add") {
            const stmt = db.prepare('INSERT INTO Studietid (bruker_id, subject_id, rom_id, datetime, timer, status) VALUES (?, ?, ?, ?, ?, ?)')
            stmt.run(user.id, subjectRow.id, roomRow.id, startTime, duration, 'venter på godkjenning')
        } else if (mode === "edit" || mode === "delete") {
            const studyTime = db.prepare('SELECT * FROM Studietid WHERE id = ?').get(id) as { id: number, status: string } | undefined | null
            if (!studyTime) {
                res.status(400).json({ error: 'Invalid id' })
                return
            }

            if (studyTime.status !== "venter på godkjenning") {
                res.status(400).json({ error: 'Study time is not pending approval' })
                return
            }
            if (mode === "delete") {
                const stmt = db.prepare('DELETE FROM Studietid WHERE id = ?')
                stmt.run(id)
            } else {
                const stmt = db.prepare('UPDATE Studietid SET subject_id = ?, rom_id = ?, datetime = ?, timer = ? WHERE id = ?')
                stmt.run(subjectRow.id, roomRow.id, startTime, duration, id)
            }
        } else {
            res.status(400).json({ error: 'Invalid mode' })
            return
        }

        res.status(200).json({ success: true })
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
