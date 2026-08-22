import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const attendances = await prisma.attendance.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true } } },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, action } = body

    if (action === 'checkIn') {
      const record = await prisma.attendance.create({
        data: { userId, checkIn: new Date(), status: 'PRESENT' },
      })
      return NextResponse.json(record, { status: 201 })
    }

    if (action === 'checkOut') {
      const latest = await prisma.attendance.findFirst({
        where: { userId, checkOut: null },
        orderBy: { date: 'desc' },
      })

      if (!latest) {
        return NextResponse.json({ error: 'No active check-in found' }, { status: 400 })
      }

      const updated = await prisma.attendance.update({
        where: { id: latest.id },
        data: { checkOut: new Date() },
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log attendance' }, { status: 500 })
  }
}
