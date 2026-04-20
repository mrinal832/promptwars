const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean old
  await prisma.waitTime.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.route.deleteMany()
  await prisma.alert.deleteMany()
  await prisma.venueZone.deleteMany()
  await prisma.user.deleteMany()

  // 1. Users
  await prisma.user.createMany({
    data: [
      { name: 'Alice Fan', role: 'attendee', seatSection: '104' },
      { name: 'Bob Fan', role: 'attendee', seatSection: '202' },
      { name: 'Admin Ops', role: 'admin' },
      { name: 'Staff Mike', role: 'security' },
    ]
  })

  // 2. Zones
  const zones = await Promise.all([
    prisma.venueZone.create({ data: { name: 'Gate A (North)', type: 'gate', coordinates: '{"x": 50, "y": 10}', currentDensity: 45, status: 'normal' } }),
    prisma.venueZone.create({ data: { name: 'Gate B (East)', type: 'gate', coordinates: '{"x": 90, "y": 50}', currentDensity: 85, status: 'congested' } }),
    prisma.venueZone.create({ data: { name: 'Gate C (South)', type: 'gate', coordinates: '{"x": 50, "y": 90}', currentDensity: 20, status: 'normal' } }),
    
    prisma.venueZone.create({ data: { name: 'Food Court 1', type: 'food', coordinates: '{"x": 30, "y": 30}', currentDensity: 60, status: 'normal' } }),
    prisma.venueZone.create({ data: { name: 'Burger & Beer Stand', type: 'food', coordinates: '{"x": 70, "y": 80}', currentDensity: 90, status: 'congested' } }),
    
    prisma.venueZone.create({ data: { name: 'Restroom North', type: 'restroom', coordinates: '{"x": 40, "y": 20}', currentDensity: 30, status: 'normal' } }),
    prisma.venueZone.create({ data: { name: 'Restroom South', type: 'restroom', coordinates: '{"x": 60, "y": 80}', currentDensity: 75, status: 'normal' } }),
    
    prisma.venueZone.create({ data: { name: 'Merch Store VIP', type: 'merch', coordinates: '{"x": 20, "y": 50}', currentDensity: 15, status: 'normal' } }),
    
    prisma.venueZone.create({ data: { name: 'Section 104', type: 'seating', coordinates: '{"x": 45, "y": 45}', currentDensity: 100, status: 'normal' } }),
    prisma.venueZone.create({ data: { name: 'Section 202', type: 'seating', coordinates: '{"x": 75, "y": 75}', currentDensity: 80, status: 'normal' } })
  ])

  // 3. Wait Times
  for (const zone of zones) {
    if (['food', 'restroom', 'merch', 'gate'].includes(zone.type)) {
      await prisma.waitTime.create({
        data: {
          zoneId: zone.id,
          estimatedWaitMinutes: Math.floor(zone.currentDensity / 10),
        }
      })
    }
  }

  // 4. Routes (Graph edges)
  await prisma.route.createMany({
    data: [
      { fromZoneId: zones[0].id, toZoneId: zones[3].id, distance: 200, crowdScore: 20, estimatedTime: 120 }, // Gate A -> Food 1
      { fromZoneId: zones[3].id, toZoneId: zones[8].id, distance: 150, crowdScore: 10, estimatedTime: 90 },  // Food 1 -> Sec 104
      { fromZoneId: zones[0].id, toZoneId: zones[5].id, distance: 100, crowdScore: 5, estimatedTime: 60 },   // Gate A -> Restroom N
      { fromZoneId: zones[5].id, toZoneId: zones[8].id, distance: 100, crowdScore: 5, estimatedTime: 60 },   // Restroom N -> Sec 104
      
      { fromZoneId: zones[1].id, toZoneId: zones[4].id, distance: 100, crowdScore: 80, estimatedTime: 80 },  // Gate B -> Stand
      { fromZoneId: zones[4].id, toZoneId: zones[9].id, distance: 100, crowdScore: 40, estimatedTime: 80 },  // Stand -> Sec 202
    ]
  })

  // 5. Alerts
  await prisma.alert.create({
    data: {
      type: 'congestion',
      title: 'High Congestion at Gate B',
      message: 'Consider using Gate A or C for faster entry.',
      targetZone: '*',
      severity: 'warning'
    }
  })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
