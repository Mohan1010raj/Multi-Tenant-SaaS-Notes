import prisma from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers.authorization?.replace('Bearer ', '')
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'unauthorized' })

  const { slug } = req.query
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  if (!tenant) return res.status(404).json({ error: 'tenant not found' })
  // only admins from same tenant can upgrade
  if (payload.tenantId !== tenant.id || payload.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }
  await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: 'pro' } })
  res.json({ ok: true, plan: 'pro' })
}
