import { useEffect, useRef } from 'react'
import { BLOCK_SIZE, type Tetromino } from '@/lib/tetris-types'

interface NextPieceProps {
  piece: Tetromino | null
}

export function NextPiece({ piece }: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !piece) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const offsetX = (4 - piece.shape[0].length) * BLOCK_SIZE / 2
    const offsetY = (4 - piece.shape.length) * BLOCK_SIZE / 2

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const pixelX = x * BLOCK_SIZE + offsetX
          const pixelY = y * BLOCK_SIZE + offsetY

          ctx.fillStyle = piece.color
          ctx.fillRect(pixelX + 1, pixelY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 1
          ctx.strokeRect(pixelX + 1, pixelY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
        }
      }
    }
  }, [piece])

  return (
    <canvas
      ref={canvasRef}
      width={BLOCK_SIZE * 4}
      height={BLOCK_SIZE * 4}
      className="mx-auto"
    />
  )
}
