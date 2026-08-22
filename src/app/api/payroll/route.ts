import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const payrolls = await prisma.payroll.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true, jobTitle: true, department: true } } },
      orderBy: { paymentDate: 'desc' },
    })

    return NextResponse.json(payrolls)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payroll records' }, { status: 500 })
  }
}
