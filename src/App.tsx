import { useEffect, useRef, useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameBoard } from '@/components/GameBoard'
import { NextPiece } from '@/components/NextPiece'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Play, Pause, ArrowsCounterClockwise } from '@phosphor-icons/react'
import {
  createEmptyBoard,
  createTetromino,
  rotatePiece,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  calculateLevel,
} from '@/lib/tetris-logic'
import {
  INITIAL_FALL_SPEED,
  FALL_SPEED_DECREASE,
  FAST_FALL_SPEED,
  type GameState,
} from '@/lib/tetris-types'

function App() {
  const [highScore, setHighScore] = useKV<number>('tetris-high-score', 0)
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
  })

  const fallIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const fastFallRef = useRef<boolean>(false)

  const startGame = useCallback(() => {
    const nextPiece = createTetromino()
    const currentPiece = createTetromino()
    
    setGameState({
      board: createEmptyBoard(),
      currentPiece,
      nextPiece,
      score: 0,
      lines: 0,
      level: 0,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
    })
  }, [])

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.isGameOver || !prev.isPlaying) {
        return prev
      }

      const newX = prev.currentPiece.position.x + deltaX
      const newY = prev.currentPiece.position.y + deltaY

      if (isValidMove(prev.board, prev.currentPiece, newX, newY)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { x: newX, y: newY },
          },
        }
      }

      if (deltaY > 0) {
        return lockPiece(prev)
      }

      return prev
    })
  }, [])

  const rotate = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.isGameOver || !prev.isPlaying) {
        return prev
      }

      const rotated = rotatePiece(prev.currentPiece)
      
      if (isValidMove(prev.board, rotated, rotated.position.x, rotated.position.y)) {
        return { ...prev, currentPiece: rotated }
      }

      return prev
    })
  }, [])

  const hardDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.isGameOver || !prev.isPlaying) {
        return prev
      }

      let newY = prev.currentPiece.position.y
      while (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.position.x, newY + 1)) {
        newY++
      }

      const droppedPiece = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position, y: newY },
      }

      return lockPiece({ ...prev, currentPiece: droppedPiece })
    })
  }, [])

  const lockPiece = (state: GameState): GameState => {
    if (!state.currentPiece) return state

    const newBoard = mergePieceToBoard(state.board, state.currentPiece)
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
    
    const newLines = state.lines + linesCleared
    const newLevel = calculateLevel(newLines)
    const newScore = state.score + calculateScore(linesCleared, state.level)

    const nextPiece = state.nextPiece || createTetromino()
    const newCurrentPiece = createTetromino()

    if (!isValidMove(clearedBoard, nextPiece, nextPiece.position.x, nextPiece.position.y)) {
      setHighScore((currentHigh) => Math.max(currentHigh ?? 0, newScore))
      return {
        ...state,
        board: clearedBoard,
        currentPiece: nextPiece,
        score: newScore,
        lines: newLines,
        level: newLevel,
        isGameOver: true,
        isPlaying: false,
      }
    }

    return {
      ...state,
      board: clearedBoard,
      currentPiece: nextPiece,
      nextPiece: newCurrentPiece,
      score: newScore,
      lines: newLines,
      level: newLevel,
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isGameOver) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          movePiece(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          movePiece(1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          fastFallRef.current = true
          break
        case 'ArrowUp':
        case ' ':
          e.preventDefault()
          if (e.key === ' ') {
            hardDrop()
          } else {
            rotate()
          }
          break
        case 'p':
        case 'Escape':
          e.preventDefault()
          pauseGame()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        fastFallRef.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.isPlaying, gameState.isGameOver, movePiece, rotate, pauseGame, hardDrop])

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current)
      }
      return
    }

    const speed = fastFallRef.current
      ? FAST_FALL_SPEED
      : Math.max(INITIAL_FALL_SPEED - gameState.level * FALL_SPEED_DECREASE, 100)

    fallIntervalRef.current = setInterval(() => {
      movePiece(0, 1)
    }, speed)

    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.level, movePiece])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 tracking-tight text-primary drop-shadow-[0_0_20px_rgba(0,200,255,0.5)]">
          TETRIS
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <Card className="p-6 bg-card/80 backdrop-blur">
            <GameBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
            />
          </Card>

          <div className="flex flex-col gap-4 w-full lg:w-64">
            <Card className="p-6 bg-card/80 backdrop-blur">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Next
              </h2>
              <NextPiece piece={gameState.nextPiece} />
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Score
                </div>
                <div className="text-3xl font-bold font-mono text-primary">
                  {gameState.score}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Lines
                </div>
                <div className="text-2xl font-bold font-mono">{gameState.lines}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Level
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {gameState.level}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  High Score
                </div>
                <div className="text-xl font-bold font-mono text-accent">{highScore}</div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur space-y-3">
              {!gameState.isPlaying ? (
                <Button
                  onClick={startGame}
                  className="w-full shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)]"
                  size="lg"
                >
                  <Play weight="fill" className="mr-2" />
                  {gameState.score > 0 ? 'New Game' : 'Start Game'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={pauseGame}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <Pause weight="fill" className="mr-2" />
                    {gameState.isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={startGame}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ArrowsCounterClockwise className="mr-2" />
                    Restart
                  </Button>
                </>
              )}
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground mb-2">Controls</div>
              <div>← → : Move</div>
              <div>↑ : Rotate</div>
              <div>↓ : Soft Drop</div>
              <div>Space : Hard Drop</div>
              <div>P / Esc : Pause</div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={gameState.isGameOver} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center">
              Game Over
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Final Score</div>
              <div className="text-5xl font-bold font-mono text-primary">
                {gameState.score}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Lines</div>
                <div className="text-2xl font-bold">{gameState.lines}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Level</div>
                <div className="text-2xl font-bold">{gameState.level}</div>
              </div>
            </div>
            {gameState.score === highScore && gameState.score > 0 && (
              <div className="text-center text-accent font-medium">
                🎉 New High Score!
              </div>
            )}
            <Button
              onClick={startGame}
              className="w-full shadow-[0_0_20px_rgba(0,200,255,0.4)]"
              size="lg"
            >
              <Play weight="fill" className="mr-2" />
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App