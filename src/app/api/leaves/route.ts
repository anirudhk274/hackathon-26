import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const leaves = await prisma.leave.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, employeeId: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(leaves)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, startDate, endDate, reason } = body

    const newLeave = await prisma.leave.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    })

    return NextResponse.json(newLeave, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create leave request' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, adminComments } = body

    const updated = await prisma.leave.update({
      where: { id },
      data: { status, adminComments },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leave' }, { status: 500 })
  }
}
