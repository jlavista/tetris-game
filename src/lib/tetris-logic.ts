import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TETROMINO_COLORS,
  TETROMINO_SHAPES,
  type Tetromino,
  type TetrominoType,
} from './tetris-types'

export function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
}

export function createTetromino(type?: TetrominoType): Tetromino {
  const tetrominoType = type || getRandomTetrominoType()
  return {
    type: tetrominoType,
    shape: TETROMINO_SHAPES[tetrominoType],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[tetrominoType],
  }
}

function getRandomTetrominoType(): TetrominoType {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
  return types[Math.floor(Math.random() * types.length)]
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map((row) => row[index]).reverse()
  )
  return { ...piece, shape: newShape }
}

export function isValidMove(
  board: (string | null)[][],
  piece: Tetromino,
  newX: number,
  newY: number
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = newX + x
        const boardY = newY + y

        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX])
        ) {
          return false
        }
      }
    }
  }
  return true
}

export function mergePieceToBoard(
  board: (string | null)[][],
  piece: Tetromino
): (string | null)[][] {
  const newBoard = board.map((row) => [...row])
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y
        const boardX = piece.position.x + x
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color
        }
      }
    }
  }
  
  return newBoard
}

export function clearLines(board: (string | null)[][]): {
  newBoard: (string | null)[][]
  linesCleared: number
} {
  const fullLines: number[] = []
  
  board.forEach((row, index) => {
    if (row.every((cell) => cell !== null)) {
      fullLines.push(index)
    }
  })
  
  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 }
  }
  
  const newBoard = board.filter((_, index) => !fullLines.includes(index))
  
  const emptyLines = Array.from({ length: fullLines.length }, () =>
    Array(BOARD_WIDTH).fill(null)
  )
  
  return {
    newBoard: [...emptyLines, ...newBoard],
    linesCleared: fullLines.length,
  }
}

export function calculateScore(linesCleared: number, level: number): number {
  const basePoints = [0, 100, 300, 500, 800]
  return basePoints[linesCleared] * (level + 1)
}

export function calculateLevel(lines: number): number {
  return Math.floor(lines / 10)
}

export function getGhostPieceY(
  board: (string | null)[][],
  piece: Tetromino
): number {
  let ghostY = piece.position.y
  
  while (isValidMove(board, piece, piece.position.x, ghostY + 1)) {
    ghostY++
  }
  
  return ghostY
}
