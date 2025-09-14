import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers.authorization?.replace('Bearer ', '')
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'unauthorized' })
  // only admins can invite
  if (payload.role !== 'admin') return res.status(403).json({ error: 'forbidden' })
  const { email, role } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  const passHash = await bcrypt.hash('password', 10) // default invite password: password
  const user = await prisma.user.create({ data: { email, password: passHash, role: role||'member', tenantId: payload.tenantId } })
  res.status(201).json({ id: user.id, email: user.email })
}
