export interface TracePuzzle {
  id: string
  rows: number
  cols: number
  numbers: Array<number | null>
  solution: number[]
  checkpoints: number
}

const STORE_KEY = "alphacom-trace-v1"

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashDate(id: string) {
  let hash = 2166136261
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function traceDateId(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function neighbors(index: number, rows: number, cols: number) {
  const row = Math.floor(index / cols)
  const col = index % cols
  const cells: number[] = []
  if (row > 0) cells.push(index - cols)
  if (row < rows - 1) cells.push(index + cols)
  if (col > 0) cells.push(index - 1)
  if (col < cols - 1) cells.push(index + 1)
  return cells
}

export function areAdjacent(a: number, b: number, cols: number) {
  const ar = Math.floor(a / cols)
  const ac = a % cols
  const br = Math.floor(b / cols)
  const bc = b % cols
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1
}

function hamiltonianPath(rows: number, cols: number, rand: () => number) {
  const total = rows * cols
  const starts = [0, cols - 1, total - cols, total - 1]
  const start = starts[Math.floor(rand() * starts.length)]
  const path = [start]
  const used = new Uint8Array(total)
  used[start] = 1

  const openDegree = (index: number) => neighbors(index, rows, cols).reduce((count, next) => count + (used[next] ? 0 : 1), 0)

  const walk = (): boolean => {
    if (path.length === total) return true
    const current = path[path.length - 1]
    const options = neighbors(current, rows, cols).filter((next) => !used[next])
    options.sort((a, b) => openDegree(a) - openDegree(b) || rand() - 0.5)
    for (const next of options) {
      used[next] = 1
      path.push(next)
      if (walk()) return true
      path.pop()
      used[next] = 0
    }
    return false
  }

  return walk() ? path.slice() : null
}

function placeCheckpoints(path: number[], count: number) {
  const picks = [0]
  const span = path.length - 1
  for (let step = 1; step < count - 1; step++) {
    const target = Math.round((step / (count - 1)) * span)
    const previous = picks[picks.length - 1]
    picks.push(Math.max(previous + 2, Math.min(span - 2, target)))
  }
  picks.push(span)
  const unique = [...new Set(picks)].sort((a, b) => a - b)
  if (unique[unique.length - 1] !== span) unique.push(span)
  return unique
}

export function puzzleForDate(date = new Date()): TracePuzzle {
  const id = traceDateId(date)
  const rand = mulberry32(hashDate(id))
  const rows = 6
  const cols = 6
  let solution: number[] | null = null
  for (let attempt = 0; attempt < 8 && !solution; attempt++) {
    solution = hamiltonianPath(rows, cols, rand)
  }
  if (!solution) {
    solution = []
    for (let row = 0; row < rows; row++) {
      const line = Array.from({ length: cols }, (_, col) => row * cols + (row % 2 ? cols - 1 - col : col))
      solution.push(...line)
    }
  }

  const checkpointCount = 6 + Math.floor(rand() * 2)
  const stops = placeCheckpoints(solution, checkpointCount)
  const numbers = Array<number | null>(rows * cols).fill(null)
  stops.forEach((pathIndex, order) => {
    numbers[solution[pathIndex]] = order + 1
  })

  return { id, rows, cols, numbers, solution, checkpoints: stops.length }
}

export function startCell(puzzle: TracePuzzle) {
  const index = puzzle.numbers.indexOf(1)
  return index === -1 ? 0 : index
}

export function reachedCheckpoint(path: number[], puzzle: TracePuzzle) {
  return path.reduce((highest, cell) => Math.max(highest, puzzle.numbers[cell] ?? 0), 0)
}

export function canEnter(cell: number, path: number[], puzzle: TracePuzzle) {
  if (cell < 0 || cell >= puzzle.rows * puzzle.cols) return false
  if (path.length === 0) return cell === startCell(puzzle)
  const head = path[path.length - 1]
  if (cell === head) return false
  if (!areAdjacent(head, cell, puzzle.cols)) return false
  if (path.includes(cell)) return path.length > 1 && cell === path[path.length - 2]
  const number = puzzle.numbers[cell]
  if (number != null && number !== reachedCheckpoint(path, puzzle) + 1) return false
  return true
}

export function isSolved(path: number[], puzzle: TracePuzzle) {
  const total = puzzle.rows * puzzle.cols
  if (path.length !== total || new Set(path).size !== total) return false
  let expected = 1
  for (const cell of path) {
    const number = puzzle.numbers[cell]
    if (number == null) continue
    if (number !== expected) return false
    expected += 1
  }
  return expected === puzzle.checkpoints + 1
}

export interface TraceProgress {
  solved: string[]
}

export function readTraceProgress(): TraceProgress {
  if (typeof window === "undefined") return { solved: [] }
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "")
    const solved = Array.isArray(parsed?.solved) ? parsed.solved.filter((item: unknown) => typeof item === "string") : []
    return { solved }
  } catch {
    return { solved: [] }
  }
}

export function rememberTraceSolve(id: string) {
  const progress = readTraceProgress()
  if (!progress.solved.includes(id)) progress.solved.push(id)
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(progress))
  } catch {
    // Private mode can block storage. The clear still shows for this visit.
  }
  return progress
}

export function traceStreak(solved: string[], today = traceDateId()) {
  const days = new Set(solved)
  if (!days.has(today)) return 0
  let streak = 0
  const cursor = new Date(`${today}T12:00:00`)
  while (days.has(traceDateId(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
