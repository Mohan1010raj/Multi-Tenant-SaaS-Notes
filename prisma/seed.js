const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Cleaning old data...")
  await prisma.note.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()

  console.log("🏗️ Creating tenants...")
  const acme = await prisma.tenant.create({
    data: { name: "Acme Inc", slug: "acme", plan: "free" }
  })
  const globex = await prisma.tenant.create({
    data: { name: "Globex Corp", slug: "globex", plan: "free" }
  })

  console.log("🔑 Hashing default password...")
  const pass = await bcrypt.hash('password', 10)

  console.log("👥 Creating users...")
  await prisma.user.createMany({
    data: [
      { email: "admin@acme.test", password: pass, role: "ADMIN", tenantId: acme.id },
      { email: "user@acme.test", password: pass, role: "MEMBER", tenantId: acme.id },
      { email: "admin@globex.test", password: pass, role: "ADMIN", tenantId: globex.id },
      { email: "user@globex.test", password: pass, role: "MEMBER", tenantId: globex.id },
    ]
  })

  console.log("📝 Creating sample notes...")
  await prisma.note.createMany({
    data: [
      { title: "Acme - Welcome", content: "Welcome to Acme notes!", tenantId: acme.id },
      { title: "Acme - Tip", content: "Remember to write good notes.", tenantId: acme.id },
      { title: "Globex - Welcome", content: "Welcome to Globex notes!", tenantId: globex.id },
    ]
  })

  console.log("✅ Seed complete! Accounts created:")
  console.log("  admin@acme.test / password")
  console.log("  user@acme.test  / password")
  console.log("  admin@globex.test / password")
  console.log("  user@globex.test  / password")
}

main()
  .catch(e => {
    console.error("❌ Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
