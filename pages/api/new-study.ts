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
        if (req.body.token === undefined || req.body.subject === undefined || req.body.room === undefined || req.body.startTime === undefined || req.body.duration === undefined) {
            let missingParam = ''
            if (req.body.token === undefined) missingParam = 'token'
            else if (req.body.subject === undefined) missingParam = 'subject'
            else if (req.body.room === undefined) missingParam = 'room'
            else if (req.body.startTime === undefined) missingParam = 'startTime'
            else if (req.body.duration === undefined) missingParam = 'duration'
            res.status(400).json({ error: `Missing parameter: ${missingParam}` })
            return
        }

        const { token, subject, room, startTime, duration } = req.body as Data

        console.log("Token: ", token)
        console.log("Subject: ", subject)
        console.log("Room: ", room)
        console.log("Start time: ", startTime)
        console.log("Duration: ", duration)

        const user = db.prepare('SELECT * FROM Users WHERE token = ?').get(token) as { name: string, email: string, id: number } | undefined | null
        if (!user) {
            res.status(401).json({ error: 'Invalid token' })
            return
        }

        console.log("Database tables:", db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());

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

        // Insert the new study time
        const stmt = db.prepare('INSERT INTO Studietid (bruker_id, subject_id, rom_id, datetime, timer, status) VALUES (?, ?, ?, ?, ?, ?)')
        stmt.run(user.id, subjectRow.id, roomRow.id, startTime, duration, 'venter på godkjenning')


        res.status(200).json({ success: true })
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
