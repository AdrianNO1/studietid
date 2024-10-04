import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { t } = req.query

    try {
      let html = '<html><head><style>'
      html += 'body { font-family: Arial, sans-serif; }'
      html += 'h2 { color: #333; margin-top: 30px; }'
      html += 'table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }'
      html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }'
      html += 'th { background-color: #f2f2f2; font-weight: bold; }'
      html += '</style></head><body>'

      if (!t) {
        // Get all table names
        const tableStmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'") // ORDER BY name")
        const tables: { name: string }[] = tableStmt.all() as { name: string }[]

        for (const table of tables) {
          const tableName = table.name
          html += await generateTableHtml(tableName)
        }
      } else if (typeof t === 'string') {
        html += await generateTableHtml(t)
      } else {
        res.status(400).json({ error: 'Invalid table name parameter' })
        return
      }

      html += '</body></html>'

      // Set the content type to HTML
      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(html)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

async function generateTableHtml(tableName: string): Promise<string> {
  const stmt = db.prepare(`SELECT * FROM ${tableName}`)
  const rows: any[] = stmt.all()

  if (rows.length === 0) {
    return `<h2>Table: ${tableName}</h2><p>No data found in this table.</p>`
  }

  const headers = Object.keys(rows[0] as object)

  let html = `<h2>Table: ${tableName}</h2>`
  html += '<table>'
  html += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>'
  html += rows.map(row => 
    '<tr>' + headers.map(header => `<td>${row[header]}</td>`).join('') + '</tr>'
  ).join('')
  html += '</table>'

  return html
}
