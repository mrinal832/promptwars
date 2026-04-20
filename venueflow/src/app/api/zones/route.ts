import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const zones = await prisma.venueZone.findMany({
      include: {
        waitTimes: {
          orderBy: { lastUpdated: 'desc' },
          take: 1
        }
      }
    })
    return NextResponse.json(zones)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 })
  }
}
