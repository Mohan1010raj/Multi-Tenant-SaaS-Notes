import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'unauthorized' })

  const tenantId = payload.tenantId

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } })
    return res.json(notes)
  }

  if (req.method === 'POST') {
    const { title, content } = req.body || {}
    if (!title) return res.status(400).json({ error: 'title required' })
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant.plan === 'free') {
      const count = await prisma.note.count({ where: { tenantId } })
      if (count >= 3) return res.status(403).json({ error: 'note limit reached for Free plan' })
    }
    const note = await prisma.note.create({ data: { title, content: content||'', tenantId, authorId: payload.userId } })
    return res.status(201).json(note)
  }

  res.status(405).end()
}
