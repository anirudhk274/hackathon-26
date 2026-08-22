import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const app = express()
const PORT = process.env.API_PORT || 3001

// --- Prisma Setup ---
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set. Create a .env file with your PostgreSQL connection string.')
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// --- Middleware ---
app.use(cors())
app.use(express.json())

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ────────────────────────────────────────────
//  USERS
// ────────────────────────────────────────────
app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (error) {
    console.error('GET /api/users error:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ────────────────────────────────────────────
//  ATTENDANCE
// ────────────────────────────────────────────
app.get('/api/attendance', async (req, res) => {
  try {
    const userId = req.query.userId

    const attendances = await prisma.attendance.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true } } },
      orderBy: { date: 'desc' },
    })

    res.json(attendances)
  } catch (error) {
    console.error('GET /api/attendance error:', error)
    res.status(500).json({ error: 'Failed to fetch attendance' })
  }
})

app.post('/api/attendance', async (req, res) => {
  try {
    const { userId, action } = req.body

    if (action === 'checkIn') {
      const record = await prisma.attendance.create({
        data: { userId, checkIn: new Date(), status: 'PRESENT' },
      })
      return res.status(201).json(record)
    }

    if (action === 'checkOut') {
      const latest = await prisma.attendance.findFirst({
        where: { userId, checkOut: null },
        orderBy: { date: 'desc' },
      })

      if (!latest) {
        return res.status(400).json({ error: 'No active check-in found' })
      }

      const updated = await prisma.attendance.update({
        where: { id: latest.id },
        data: { checkOut: new Date() },
      })
      return res.json(updated)
    }

    return res.status(400).json({ error: 'Invalid action' })
  } catch (error) {
    console.error('POST /api/attendance error:', error)
    res.status(500).json({ error: 'Failed to log attendance' })
  }
})

// ────────────────────────────────────────────
//  LEAVES
// ────────────────────────────────────────────
app.get('/api/leaves', async (req, res) => {
  try {
    const userId = req.query.userId

    const leaves = await prisma.leave.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(leaves)
  } catch (error) {
    console.error('GET /api/leaves error:', error)
    res.status(500).json({ error: 'Failed to fetch leaves' })
  }
})

app.post('/api/leaves', async (req, res) => {
  try {
    const { userId, type, startDate, endDate, reason } = req.body

    const newLeave = await prisma.leave.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    })

    res.status(201).json(newLeave)
  } catch (error) {
    console.error('POST /api/leaves error:', error)
    res.status(500).json({ error: 'Failed to create leave request' })
  }
})

app.patch('/api/leaves', async (req, res) => {
  try {
    const { id, status, adminComments } = req.body

    const updated = await prisma.leave.update({
      where: { id },
      data: { status, adminComments },
    })

    res.json(updated)
  } catch (error) {
    console.error('PATCH /api/leaves error:', error)
    res.status(500).json({ error: 'Failed to update leave' })
  }
})

// ────────────────────────────────────────────
//  PAYROLL
// ────────────────────────────────────────────
app.get('/api/payroll', async (req, res) => {
  try {
    const userId = req.query.userId

    const payrolls = await prisma.payroll.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true, jobTitle: true, department: true } } },
      orderBy: { paymentDate: 'desc' },
    })

    res.json(payrolls)
  } catch (error) {
    console.error('GET /api/payroll error:', error)
    res.status(500).json({ error: 'Failed to fetch payroll records' })
  }
})

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Dayflow API server running on http://localhost:${PORT}`)
})
