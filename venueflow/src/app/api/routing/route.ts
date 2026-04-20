import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateBestRoute } from '@/lib/routing'

// Simple in-memory cache for performance optimization
const routeCache = new Map<string, { path: any[], timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds cache for dynamic routing

export async function POST(req: Request) {
  try {
    const { startId, endId } = await req.json()
    const cacheKey = `${startId}-${endId}`;
    
    // Performance optimization: Return cached route if available and recent
    const cached = routeCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json({ path: cached.path, cached: true });
    }
    
    const zones = await prisma.venueZone.findMany()
    const routes = await prisma.route.findMany()
    
    const pathIds = calculateBestRoute(zones, routes, startId, endId)
    const path = pathIds.map(id => zones.find(z => z.id === id))
    
    // Update cache
    routeCache.set(cacheKey, { path, timestamp: Date.now() });
    
    return NextResponse.json({ path, cached: false })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to calculate route' }, { status: 500 })
  }
}
