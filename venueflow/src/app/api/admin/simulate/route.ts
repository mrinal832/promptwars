import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { action } = await req.json()
    
    if (action === 'gate_overload') {
      const gate = await prisma.venueZone.findFirst({ where: { name: 'Gate A (North)' } })
      if (gate) {
        await prisma.venueZone.update({
          where: { id: gate.id },
          data: { currentDensity: 95, status: 'congested' }
        })
        await prisma.alert.create({
          data: { type: 'congestion', title: 'Gate A Overload', message: 'Gate A is over 95% capacity. Redirecting to Gate C.', severity: 'critical', targetZone: gate.id }
        })
      }
    } else if (action === 'food_stall_closure') {
      const stall = await prisma.venueZone.findFirst({ where: { name: 'Burger & Beer Stand' } })
      if (stall) {
        await prisma.venueZone.update({
          where: { id: stall.id },
          data: { currentDensity: 0, status: 'closed' }
        })
        await prisma.alert.create({
          data: { type: 'safety', title: 'Stall Closed', message: 'Burger & Beer Stand closed for maintenance (spill). Use Food Court 1.', severity: 'info', targetZone: stall.id }
        })
      }
    } else if (action === 'clear_all') {
      // simulate normal operations
      await prisma.venueZone.updateMany({
        data: { currentDensity: 30, status: 'normal' }
      })
      await prisma.alert.deleteMany()
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
