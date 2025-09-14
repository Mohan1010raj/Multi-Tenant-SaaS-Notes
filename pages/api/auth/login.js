import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { sign } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email & password required' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })
  const token = sign(user)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId } })
}
