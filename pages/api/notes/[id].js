import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'unauthorized' })
  const tenantId = payload.tenantId
  const id = parseInt(req.query.id)

  const note = await prisma.note.findUnique({ where: { id } })
  if (!note || note.tenantId !== tenantId) return res.status(404).json({ error: 'not found' })

  if (req.method === 'GET') return res.json(note)

  if (req.method === 'PUT') {
    const { title, content } = req.body || {}
    const updated = await prisma.note.update({ where: { id }, data: { title: title||note.title, content: content||note.content } })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.note.delete({ where: { id } })
    return res.json({ ok: true })
  }

  res.status(405).end()
}
