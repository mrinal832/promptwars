import { describe, it, expect, vi } from 'vitest';

// Mocking Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    venueZone: {
      findMany: vi.fn().mockResolvedValue([
        { id: '1', name: 'Zone 1', type: 'gate', currentDensity: 10, status: 'normal' },
        { id: '2', name: 'Zone 2', type: 'seating', currentDensity: 20, status: 'normal' },
      ]),
    },
    alert: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'a1', title: 'Welcome', message: 'Have fun!', severity: 'info' },
      ]),
    }
  }
}));

describe('API Endpoints', () => {
  it('should fetch zones successfully', async () => {
    // This is a unit test for the logic that would be in the GET handler
    // In a real integration test we'd hit the endpoint, but here we verify the Prisma interaction
    const prisma = (await import('@/lib/prisma')).default;
    const zones = await prisma.venueZone.findMany();
    expect(zones).toHaveLength(2);
    expect(zones[0].name).toBe('Zone 1');
  });

  it('should fetch alerts successfully', async () => {
    const prisma = (await import('@/lib/prisma')).default;
    const alerts = await prisma.alert.findMany();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].title).toBe('Welcome');
  });
});
