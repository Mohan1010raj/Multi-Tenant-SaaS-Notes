import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'change_me'
export function sign(user) {
  const payload = { userId: user.id, tenantId: user.tenantId, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })
}
export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET) } catch (e) { return null }
}
