import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'
import bcrypt from 'bcryptjs'


type Data = {
	name: string,
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
		if (req.body.name === undefined || req.body.email === undefined || req.body.password === undefined) {
			let missingParam = ''
			if (req.body.name === undefined) missingParam = 'name'
			else if (req.body.email === undefined) missingParam = 'email'
			else if (req.body.password === undefined) missingParam = 'password'
			res.status(400).json({ error: `Missing parameter: ${missingParam}` })
			return
		}

		// check if email already exists
		const emailExists = db.prepare('SELECT * FROM Users WHERE email = ?').get(req.body.email)
		if (emailExists) {
			res.status(409).json({ error: 'Email is already associated with an account' })
			return
		}

		const { name, email, password } = req.body as Data
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const stmt = db.prepare('INSERT INTO Users (name, email, password, salt, token) VALUES (?, ?, ?, ?, ?)')
		const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		const info = stmt.run(name, email, hashedPassword, salt, token)

		res.status(200).json({ token })
	} else {
		res.status(405).json({ error: 'Method Not Allowed' })
	}
}
