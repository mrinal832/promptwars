interface Node {
  id: string;
  dist: number;
  prev: string | null;
}

export function calculateBestRoute(
  zones: any[],
  routes: any[],
  startId: string,
  endId: string
) {
  const nodes: Record<string, Node> = {};
  const queue: string[] = [];

  // Create a map for quick zone lookup
  const zoneMap = new Map(zones.map(z => [z.id, z]));

  zones.forEach((z) => {
    nodes[z.id] = { id: z.id, dist: Infinity, prev: null };
    queue.push(z.id);
  });

  if (!nodes[startId]) return [];
  nodes[startId].dist = 0;

  while (queue.length > 0) {
    // Sort queue by distance (simple priority queue replacement)
    queue.sort((a, b) => nodes[a].dist - nodes[b].dist);
    const uId = queue.shift()!;
    const u = nodes[uId];

    if (uId === endId) break;
    if (u.dist === Infinity) break;

    const neighbors = routes.filter((r) => r.fromZoneId === uId);
    for (const r of neighbors) {
      const v = nodes[r.toZoneId];
      if (!v) continue;

      const targetZone = zoneMap.get(r.toZoneId);
      if (!targetZone || targetZone.status === 'closed') continue;

      // WEIGHT CALCULATION (SMART ROUTING)
      // 1. Base distance
      // 2. Crowd density penalty (exponential)
      // 3. Status penalty
      let multiplier = 1;
      
      // Density penalty
      if (targetZone.currentDensity > 80) multiplier *= 2.5;
      else if (targetZone.currentDensity > 50) multiplier *= 1.5;
      
      // Status penalty
      if (targetZone.status === 'congested') multiplier *= 1.8;
      if (targetZone.status === 'restricted') multiplier *= 3.0;

      const weight = r.distance * multiplier;
      const alt = u.dist + weight;

      if (alt < v.dist) {
        v.dist = alt;
        v.prev = uId;
      }
    }
  }

  const path: string[] = [];
  let curr: string | null = endId;
  while (curr && nodes[curr]?.prev !== null || curr === startId) {
    path.unshift(curr);
    if (curr === startId) break;
    curr = nodes[curr]?.prev || null;
  }

  return path.length > 1 ? path : [];
}
