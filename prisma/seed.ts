import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

// We must initialize the client here too if running standalone
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clean up existing data to avoid unique constraint violations
  await prisma.deal.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()

  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      image: 'https://i.pravatar.cc/150?u=jane@example.com',
    },
  })
  console.log(`Created user: ${user.name}`)

  // Create some contacts for the user
  const contact1 = await prisma.contact.create({
    data: {
      userId: user.id,
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      company: 'Acme Corporation',
      phone: '555-0100',
    },
  })

  const contact2 = await prisma.contact.create({
    data: {
      userId: user.id,
      name: 'Globex',
      email: 'hello@globex.com',
      company: 'Globex Inc',
      phone: '555-0200',
    },
  })
  console.log(`Created contacts for user.`)

  // Create deals for the user and contacts
  await prisma.deal.create({
    data: {
      userId: user.id,
      contactId: contact1.id,
      title: 'Website Redesign',
      amount: 5000,
      stage: 'PROPOSAL',
    },
  })

  await prisma.deal.create({
    data: {
      userId: user.id,
      contactId: contact2.id,
      title: 'Marketing Campaign',
      amount: 12000,
      stage: 'WON',
    },
  })

  await prisma.deal.create({
    data: {
      userId: user.id,
      contactId: contact1.id,
      title: 'SEO Retainer',
      amount: 1500,
      stage: 'LEAD',
    },
  })
  console.log(`Created deals for user.`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
