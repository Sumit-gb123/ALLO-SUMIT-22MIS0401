import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  })

  if (!reservation) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  if (reservation.status !== 'PENDING') {
    return NextResponse.json(
      { message: 'Already processed' },
      { status: 400 }
    )
  }

  await pri