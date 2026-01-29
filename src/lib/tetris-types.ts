export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export interface Position {
  x: number
  y: number
}

export interface Tetromino {
  type: TetrominoType
  shape: number[][]
  position: Position
  color: string
}

export interface GameState {
  board: (string | null)[][]
  currentPiece: Tetromino | null
  nextPiece: Tetromino | null
  score: number
  lines: number
  level: number
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
}

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20
export const BLOCK_SIZE = 30

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
}

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: 'oklch(0.75 0.18 195)',
  O: 'oklch(0.85 0.18 85)',
  T: 'oklch(0.65 0.22 310)',
  S: 'oklch(0.70 0.18 140)',
  Z: 'oklch(0.65 0.25 20)',
  J: 'oklch(0.60 0.20 250)',
  L: 'oklch(0.75 0.20 50)',
}

export const INITIAL_FALL_SPEED = 1000
export const FALL_SPEED_DECREASE = 50
export const FAST_FALL_SPEED = 50
