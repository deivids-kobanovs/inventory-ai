export function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seededRandom(key: string) {
  return mulberry32(hashString(key))
}

export function randRange(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min)
}

export function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(randRange(rng, min, max + 1))
}
