import 'dotenv/config'
import { PrismaClient, Role, AttendanceStatus, LeaveStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.payroll.deleteMany()
  await prisma.leave.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.user.deleteMany()

  const admin = await prisma.user.create({
    data: {
      employeeId: 'EMP-001',
      email: 'admin@dayflow.com',
      passwordHash: 'admin123',
      name: 'Sarah Jenkins',
      role: Role.ADMIN,
      phone: '+1 555-0192',
      address: '100 Admin Plaza, Tech District',
      jobTitle: 'HR Director',
      department: 'Human Resources',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  })

  const emp1 = await prisma.user.create({
    data: {
      employeeId: 'EMP-002',
      email: 'alex@dayflow.com',
      passwordHash: 'emp123',
      name: 'Alex Rivera',
      role: Role.EMPLOYEE,
      phone: '+1 555-0143',
      address: '742 Evergreen Terrace',
      jobTitle: 'Senior Frontend Developer',
      department: 'Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  })

  const emp2 = await prisma.user.create({
    data: {
      employeeId: 'EMP-003',
      email: 'priya@dayflow.com',
      passwordHash: 'emp123',
      name: 'Priya Sharma',
      role: Role.EMPLOYEE,
      phone: '+1 555-0188',
      address: '12 Sparks Street',
      jobTitle: 'UI/UX Designer',
      department: 'Design',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  })

  await prisma.payroll.createMany({
    data: [
      { userId: admin.id, baseSalary: 95000, allowances: 5000, deductions: 2000, netSalary: 98000 },
      { userId: emp1.id, baseSalary: 80000, allowances: 3000, deductions: 1500, netSalary: 81500 },
      { userId: emp2.id, baseSalary: 75000, allowances: 2500, deductions: 1200, netSalary: 76300 },
    ],
  })

  await prisma.attendance.createMany({
    data: [
      { userId: emp1.id, status: AttendanceStatus.PRESENT, checkIn: new Date(Date.now() - 28800000), checkOut: new Date() },
      { userId: emp2.id, status: AttendanceStatus.PRESENT, checkIn: new Date(Date.now() - 27000000) },
      { userId: admin.id, status: AttendanceStatus.PRESENT, checkIn: new Date(Date.now() - 30000000), checkOut: new Date() },
    ],
  })

  await prisma.leave.createMany({
    data: [
      {
        userId: emp1.id,
        type: 'SICK',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-02'),
        reason: 'Medical checkup',
        status: LeaveStatus.PENDING,
      },
      {
        userId: emp2.id,
        type: 'PAID',
        startDate: new Date('2026-09-10'),
        endDate: new Date('2026-09-15'),
        reason: 'Family vacation',
        status: LeaveStatus.APPROVED,
        adminComments: 'Approved. Enjoy your time off!',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })