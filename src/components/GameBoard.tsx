import { useEffect, useRef } from 'react'
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, type Tetromino } from '@/lib/tetris-types'
import { getGhostPieceY } from '@/lib/tetris-logic'

interface GameBoardProps {
  board: (string | null)[][]
  currentPiece: Tetromino | null
  isPaused: boolean
  isGameOver: boolean
}

export function GameBoard({ board, currentPiece, isPaused, isGameOver }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          drawBlock(ctx, x, y, board[y][x]!)
        } else {
          drawEmptyBlock(ctx, x, y)
        }
      }
    }

    if (currentPiece) {
      const ghostY = getGhostPieceY(board, currentPiece)
      
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPiece.position.x + x
            const boardY = ghostY + y
            if (boardY >= 0) {
              drawGhostBlock(ctx, boardX, boardY, currentPiece.color)
            }
          }
        }
      }

      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPiece.position.x + x
            const boardY = currentPiece.position.y + y
            if (boardY >= 0) {
              drawBlock(ctx, boardX, boardY, currentPiece.color)
            }
          }
        }
      }
    }

    if (isPaused || isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [board, currentPiece, isPaused, isGameOver])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * BLOCK_SIZE}
        height={BOARD_HEIGHT * BLOCK_SIZE}
        className="border-4 border-primary/30 rounded-lg shadow-[0_0_30px_rgba(0,200,255,0.3)]"
      />
    </div>
  )
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const pixelX = x * BLOCK_SIZE
  const pixelY = y * BLOCK_SIZE

  ctx.fillStyle = color
  ctx.fillRect(pixelX + 1, pixelY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(pixelX + 1, pixelY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
}

function drawGhostBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const pixelX = x * BLOCK_SIZE
  const pixelY = y * BLOCK_SIZE

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.strokeRect(pixelX + 2, pixelY + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4)
  ctx.setLineDash([])
}

function drawEmptyBlock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const pixelX = x * BLOCK_SIZE
  const pixelY = y * BLOCK_SIZE

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1
  ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE)
}
