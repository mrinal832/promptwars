import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' }
    })
    return NextResponse.json(alerts)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}
