import { describe, it, expect } from 'vitest';
import { calculateBestRoute } from '../src/lib/routing';

describe('Dijkstra Routing Algorithm', () => {
  const zones = [
    { id: 'gate1', name: 'Main Gate', currentDensity: 10, status: 'normal' },
    { id: 'corridor1', name: 'North Corridor', currentDensity: 90, status: 'congested' },
    { id: 'corridor2', name: 'South Corridor', currentDensity: 20, status: 'normal' },
    { id: 'seat104', name: 'Section 104', currentDensity: 30, status: 'normal' },
    { id: 'gate2', name: 'West Gate', currentDensity: 10, status: 'closed' },
  ];

  const routes = [
    { fromZoneId: 'gate1', toZoneId: 'corridor1', distance: 100 },
    { fromZoneId: 'gate1', toZoneId: 'corridor2', distance: 150 },
    { fromZoneId: 'corridor1', toZoneId: 'seat104', distance: 50 },
    { fromZoneId: 'corridor2', toZoneId: 'seat104', distance: 60 },
    { fromZoneId: 'gate1', toZoneId: 'gate2', distance: 10 },
  ];

  it('should find the fastest path avoiding congestion', () => {
    // North corridor is 100m but 90% density + congested status
    // South corridor is 150m but 20% density + normal status
    // Path 1 (North): 100 * (congestion penalty) + 50
    // Path 2 (South): 150 * 1 + 60
    
    const path = calculateBestRoute(zones, routes, 'gate1', 'seat104');
    
    // It should choose corridor2 because corridor1 is heavily congested
    expect(path).toContain('corridor2');
    expect(path).not.toContain('corridor1');
  });

  it('should return empty path if no connection exists', () => {
    const path = calculateBestRoute(zones, routes, 'gate1', 'nonexistent');
    expect(path).toEqual([]);
  });

  it('should avoid closed zones', () => {
    const path = calculateBestRoute(zones, routes, 'gate1', 'gate2');
    expect(path).toEqual([]);
  });
});
