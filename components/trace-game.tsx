"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  canEnter,
  isSolved,
  puzzleForDate,
  readTraceProgress,
  rememberTraceSolve,
  startCell,
  traceStreak,
  type TracePuzzle,
} from "@/lib/trace-puzzle"

const PATH = "#8E1B2C"

function formatDay(id: string) {
  const [year, month, day] = id.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function direction(from: number, to: number, cols: number) {
  const row = Math.floor(to / cols) - Math.floor(from / cols)
  const col = (to % cols) - (from % cols)
  if (col === 1) return 0
  if (row === 1) return 90
  if (col === -1) return 180
  return 270
}

export function TraceGame() {
  const [puzzle] = useState<TracePuzzle>(() => puzzleForDate(new Date()))
  const [path, setPath] = useState<number[]>(() => [startCell(puzzle)])
  const [hinted, setHinted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [cleared, setCleared] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const solved = isSolved(path, puzzle)

  useEffect(() => {
    const progress = readTraceProgress()
    setStreak(traceStreak(progress.solved, puzzle.id))
    setCleared(progress.solved.includes(puzzle.id))
  }, [puzzle])

  useEffect(() => {
    if (!solved) return
    const progress = rememberTraceSolve(puzzle.id)
    setStreak(traceStreak(progress.solved, puzzle.id))
    setCleared(true)
    const timer = window.setTimeout(() => {
      setPath([startCell(puzzle)])
      setHinted(false)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [solved, puzzle])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const focused = event.target
      if (focused instanceof HTMLElement && focused.closest("input, textarea")) return
      const head = path[path.length - 1]
      const delta =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "ArrowDown" ? puzzle.cols : event.key === "ArrowUp" ? -puzzle.cols : 0
      if (!delta) return
      const target = event.key
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(target)) return
      event.preventDefault()
      extend(head + delta)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const extend = (cell: number) => {
    setPath((current) => {
      if (!canEnter(cell, current, puzzle)) return current
      if (current.length > 1 && cell === current[current.length - 2]) return current.slice(0, -1)
      return [...current, cell]
    })
  }

  const cellFromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const board = boardRef.current
    if (!board) return null
    const rect = board.getBoundingClientRect()
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * puzzle.cols)
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * puzzle.rows)
    if (row < 0 || col < 0 || row >= puzzle.rows || col >= puzzle.cols) return null
    return row * puzzle.cols + col
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const cell = cellFromEvent(event)
    if (cell == null) return
    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    extend(cell)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing.current) return
    const cell = cellFromEvent(event)
    if (cell != null) extend(cell)
  }

  const undo = () => setPath((current) => (current.length > 1 ? current.slice(0, -1) : current))

  const hint = () => {
    setHinted(true)
    setPath((current) => {
      let shared = 0
      while (shared < current.length && current[shared] === puzzle.solution[shared]) shared += 1
      const next = puzzle.solution[shared]
      if (next == null) return current
      if (shared === current.length) return [...current, next]
      return puzzle.solution.slice(0, shared + 1)
    })
  }

  const geometry = useMemo(() => {
    const size = 100 / puzzle.cols
    const points = path.map((cell) => {
      const col = cell % puzzle.cols
      const row = Math.floor(cell / puzzle.cols)
      return `${(col + 0.5) * size},${(row + 0.5) * size}`
    })
    const head = path[path.length - 1]
    const previous = path[path.length - 2]
    const col = head % puzzle.cols
    const row = Math.floor(head / puzzle.cols)
    return {
      points: points.join(" "),
      head: { x: (col + 0.5) * size, y: (row + 0.5) * size },
      angle: previous == null ? 0 : direction(previous, head, puzzle.cols),
    }
  }, [path, puzzle.cols])

  return (
    <div className="bg-[#f6f3f0] dark:bg-stone-950">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,34rem)_16rem] lg:items-start lg:justify-center lg:gap-8">
        <section className="rounded-[28px] border border-stone-200/80 bg-white p-4 shadow-[0_24px_60px_-36px_rgba(28,25,23,0.45)] dark:border-white/10 dark:bg-stone-900 sm:p-6">
          <div className="mb-4 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8E1B2C] dark:text-rose-300">Trace</p>
              <h1 className="mt-1 text-lg font-medium tracking-tight text-stone-950 dark:text-white">{formatDay(puzzle.id)}</h1>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{cleared && streak > 0 ? `Streak ${streak}` : "One path. Every cell."}</p>
          </div>

          <div
            ref={boardRef}
            className="relative aspect-square touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => {
              drawing.current = false
            }}
            onPointerCancel={() => {
              drawing.current = false
            }}
          >
            <div
              className="grid h-full w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 dark:border-white/10 dark:bg-stone-950"
              style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
            >
              {puzzle.numbers.map((_, index) => (
                <div key={index} className="border border-stone-200/80 dark:border-white/10" />
              ))}
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
              {path.length > 1 ? (
                <polyline
                  points={geometry.points}
                  fill="none"
                  stroke={PATH}
                  strokeWidth="10.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              <g transform={`translate(${geometry.head.x} ${geometry.head.y}) rotate(${geometry.angle})`}>
                <path d="M-1.6 -2.3 L2.1 0 L-1.6 2.3" fill="none" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
            >
              {puzzle.numbers.map((number, index) => (
                <div key={index} className="relative">
                  {number != null ? (
                    <span className="absolute left-1/2 top-1/2 flex h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stone-950 text-[clamp(0.7rem,2.4vw,1rem)] font-medium text-white ring-2 ring-white dark:ring-stone-950">
                      {number}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={path.length < 2}
              className="h-11 rounded-full bg-stone-100 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={hint}
              disabled={solved}
              className="h-11 rounded-full border border-stone-300 text-sm font-medium text-stone-950 transition-colors hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:border-white"
            >
              Hint
            </button>
          </div>

          <p className="mt-4 rounded-2xl border border-stone-200 px-4 py-3 text-sm leading-relaxed text-stone-600 dark:border-white/10 dark:text-stone-300">
            {solved
              ? "Clear. The board is resetting so you can trace it again."
              : cleared
                ? "You already cleared today's circuit. The board is ready for another run."
                : hinted
                  ? "Feeling stuck? Tap Hint again for the next step in the right direction."
                  : "Start at 1. Connect the numbers in order, and cover every cell exactly once."}
          </p>
        </section>

        <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Guide
            title="Connect the dots in order"
            mark={
              <span className="flex items-center gap-1">
                {[1, 2, 3].map((number) => (
                  <span key={number} className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-950 text-[11px] text-white">
                    {number}
                  </span>
                ))}
              </span>
            }
          />
          <Guide
            title="Fill every cell"
            mark={
              <svg viewBox="0 0 48 32" className="h-8 w-12" aria-hidden>
                <path d="M6 8 H28 V24 H14 V16 H6 Z" fill={PATH} />
              </svg>
            }
          />
          <Guide
            title="Arrow keys work too"
            mark={
              <span className="grid grid-cols-3 gap-1 text-[10px] text-stone-500">
                <span />
                <Key label="↑" />
                <span />
                <Key label="←" />
                <Key label="↓" />
                <Key label="→" />
              </span>
            }
          />
        </aside>
      </div>
    </div>
  )
}

function Guide({ title, mark }: { title: string; mark: ReactNode }) {
  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-stone-900">
      <div className="flex h-14 items-center justify-center">{mark}</div>
      <p className="text-center text-sm leading-snug text-stone-700 dark:text-stone-300">{title}</p>
    </div>
  )
}

function Key({ label }: { label: string }) {
  return <span className="flex h-5 w-5 items-center justify-center rounded-md border border-stone-200 bg-stone-50 dark:border-white/10 dark:bg-stone-950 dark:text-stone-300">{label}</span>
}
