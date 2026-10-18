import { blocked, type Obstacle } from "./townHallData.ts";
type Point = { x: number; y: number };
type Bounds = { left: number; right: number; top: number; bottom: number };
/** Small bounded A* grid, used only in the furnished classroom. No teleportation. */
export function findWalkPath(
  start: Point,
  end: Point,
  bounds: Bounds,
  obstacles: readonly Obstacle[],
  cell = 24,
): Point[] | null {
  const free = (p: Point) =>
    p.x >= bounds.left &&
    p.x <= bounds.right &&
    p.y >= bounds.top &&
    p.y <= bounds.bottom &&
    !blocked(p.x, p.y, obstacles);
  const clear = (a: Point, b: Point) => {
    if (!free(a) || !free(b)) return false;
    for (const o of obstacles) {
      let enter = 0,
        leave = 1;
      let outside = false;
      for (const [start, delta, min, max] of [
        [a.x, b.x - a.x, o.left, o.right],
        [a.y, b.y - a.y, o.top, o.bottom],
      ]) {
        if (Math.abs(delta) < 1e-10) {
          if (start <= min || start >= max) {
            outside = true;
            break;
          }
        } else {
          const t1 = (min - start) / delta,
            t2 = (max - start) / delta;
          enter = Math.max(enter, Math.min(t1, t2));
          leave = Math.min(leave, Math.max(t1, t2));
        }
      }
      if (!outside && enter < leave - 1e-10) return false;
    }
    return true;
  };
  if (!free(start) || !free(end)) return null;
  if (clear(start, end)) return [{ ...end }];
  const cols = Math.floor((bounds.right - bounds.left) / cell) + 1,
    rows = Math.floor((bounds.bottom - bounds.top) / cell) + 1;
  const point = (id: number): Point => ({
    x: bounds.left + (id % cols) * cell,
    y: bounds.top + Math.floor(id / cols) * cell,
  });
  const nearest = (p: Point) => {
    let best = -1,
      dist = Infinity;
    for (let id = 0; id < cols * rows; id++) {
      const q = point(id),
        d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < dist && free(q) && clear(p, q)) {
        best = id;
        dist = d;
      }
    }
    return best;
  };
  const from = nearest(start),
    to = nearest(end);
  if (from < 0 || to < 0) return null;
  const open = new Set([from]),
    g = new Map([[from, 0]]),
    parent = new Map<number, number>();
  const estimate = (id: number) =>
    Math.hypot(point(id).x - point(to).x, point(id).y - point(to).y);
  while (open.size) {
    let current = -1,
      best = Infinity;
    for (const id of open) {
      const score = g.get(id)! + estimate(id);
      if (score < best) {
        current = id;
        best = score;
      }
    }
    if (current === to) {
      const ids = [current];
      while (parent.has(ids[0])) ids.unshift(parent.get(ids[0])!);
      const path = [start, ...ids.map(point), end];
      const result: Point[] = [];
      let anchor = 0;
      while (anchor < path.length - 1) {
        let next = path.length - 1;
        while (next > anchor + 1 && !clear(path[anchor], path[next])) next--;
        result.push(path[next]);
        anchor = next;
      }
      return result;
    }
    open.delete(current);
    const cx = current % cols,
      cy = Math.floor(current / cols);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx,
          ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const id = ny * cols + nx;
        if (!free(point(id)) || !clear(point(current), point(id))) continue;
        const cost = g.get(current)! + cell * Math.hypot(dx, dy);
        if (cost < (g.get(id) ?? Infinity)) {
          g.set(id, cost);
          parent.set(id, current);
          open.add(id);
        }
      }
  }
  return null;
}
