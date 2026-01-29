# Planning Guide

A classic Tetris game where players rotate and position falling tetrominoes to clear lines and achieve high scores.

**Experience Qualities**:
1. **Kinetic** - Smooth, responsive controls with satisfying block placement and line-clearing animations that reward player skill
2. **Focused** - Clean, distraction-free interface that keeps attention on the game board with clear visual feedback
3. **Nostalgic** - Modern interpretation of classic arcade aesthetics with bold colors and geometric precision

**Complexity Level**: Light Application (multiple features with basic state)
This is a single-page game with core mechanics (piece movement, rotation, line clearing), state management (score, level, game over), and keyboard controls, but doesn't require multiple views or complex data relationships.

## Essential Features

**Tetromino Movement**
- Functionality: Control falling blocks with arrow keys (left, right, down) and rotation (up arrow/spacebar)
- Purpose: Core gameplay mechanic allowing player agency
- Trigger: Key press events during active game
- Progression: Key press → validate move → update piece position → render new state
- Success criteria: Immediate response to input with no perceived lag, blocks move smoothly and predictably

**Line Clearing**
- Functionality: Detect completed horizontal lines, clear them, shift blocks down, award points
- Purpose: Core scoring mechanism and victory condition
- Trigger: Block placement that completes one or more lines
- Progression: Block lands → scan for complete lines → flash animation → remove lines → cascade blocks down → update score
- Success criteria: Lines clear with satisfying visual feedback, score increases appropriately, game board state updates correctly

**Score and Level System**
- Functionality: Track score, lines cleared, and current level with increasing difficulty
- Purpose: Provide progression and replayability motivation
- Trigger: Line clears increase score and line count, every 10 lines increases level
- Progression: Line clear → calculate points based on lines cleared simultaneously → update score → check for level up → increase fall speed
- Success criteria: Score accurately reflects performance, level progression feels balanced, difficulty scales appropriately

**Game State Management**
- Functionality: Start, pause, and game over states with appropriate UI
- Purpose: Standard game flow control
- Trigger: Player actions (start/pause button, keyboard shortcuts) or game events (collision at spawn)
- Progression: Start → pieces fall continuously → pause freezes state → game over shows final score → restart resets game
- Success criteria: Clean transitions between states, pause doesn't lose progress, game over is clearly communicated

**Next Piece Preview**
- Functionality: Display the upcoming tetromino piece
- Purpose: Allow strategic planning and increase skill ceiling
- Trigger: Whenever a new piece enters the game board
- Progression: Piece spawns → next piece generated → preview updates
- Success criteria: Always shows accurate next piece, visually distinct from main board

## Edge Case Handling

- **Invalid Moves**: Prevent pieces from moving through walls or existing blocks - piece stays in last valid position
- **Game Over at Spawn**: Handle case where new piece immediately collides - trigger game over state
- **Rapid Key Presses**: Debounce or throttle input to prevent double-moves or rotation bugs
- **Pause During Fall**: Preserve exact game state including piece position and fall timing
- **Multiple Line Clears**: Handle 2, 3, or 4 line clears ("double", "triple", "tetris") with bonus points

## Design Direction

The design should evoke arcade precision and kinetic energy - bold neon colors against deep backgrounds, crisp geometric forms, and snappy animations that make every placement feel satisfying and deliberate.

## Color Selection

A vibrant neon arcade palette with deep contrast that makes the game board pop and individual pieces instantly recognizable.

- **Primary Color**: Deep space blue/purple (oklch(0.25 0.08 280)) - main background that makes neon colors vibrate
- **Secondary Colors**: Each tetromino gets a distinct neon color (cyan, yellow, purple, green, red, blue, orange) with high chroma for instant recognition
- **Accent Color**: Electric cyan (oklch(0.75 0.15 200)) - for UI elements, score highlights, and active states
- **Foreground/Background Pairings**: 
  - Primary background (oklch(0.25 0.08 280)): White text (oklch(0.98 0 0)) - Ratio 9.2:1 ✓
  - Card/board background (oklch(0.18 0.05 280)): White text (oklch(0.98 0 0)) - Ratio 12.1:1 ✓
  - Accent cyan (oklch(0.75 0.15 200)): Dark text (oklch(0.15 0 0)) - Ratio 8.5:1 ✓

## Font Selection

The typeface should be technical and geometric with strong character, evoking arcade cabinets and digital displays while maintaining modern readability.

- **Typographic Hierarchy**:
  - H1 (Game Title): Space Grotesk Bold/48px/tight tracking (-0.02em)
  - Score Display: JetBrains Mono Bold/32px/monospace for numbers
  - UI Labels: Space Grotesk Medium/14px/normal tracking
  - Game Over: Space Grotesk Bold/36px/tight tracking

## Animations

Animations should be snappy and purposeful, reinforcing the kinetic feel - pieces drop with subtle acceleration, line clears flash with satisfying emphasis (100-150ms), and game over transitions smoothly (300ms). Piece placement should have a subtle impact effect, and the ghost piece (showing drop position) should fade in/out subtly.

## Component Selection

- **Components**: 
  - Card (game board container with custom dark gradient background)
  - Button (start, pause, restart with bold accent colors)
  - Badge (level indicator with neon glow effect)
  - Dialog (game over overlay with final score and restart option)
  - Progress (optional: level progress bar)
  
- **Customizations**: 
  - Custom Canvas component for game board rendering (better performance than DOM elements)
  - Custom tetromino color mapping with neon/glow effects using box-shadow
  - Ghost piece renderer showing drop preview with reduced opacity
  
- **States**: 
  - Buttons: Default solid with glow, hover brightens and expands glow, active scales down slightly, disabled fades to 40% opacity
  - Game board: Idle state, active play state, paused (overlay with blur), game over (red tint overlay)
  
- **Icon Selection**: 
  - Play (play icon) for start
  - Pause (pause icon) for pause
  - ArrowsCounterClockwise (for restart)
  - CaretLeft/Right/Down for control hints
  
- **Spacing**: 
  - Game container: p-8 for breathing room
  - Board to side panel: gap-6
  - UI elements within panels: gap-4
  - Tight spacing for score numbers: gap-1
  
- **Mobile**: 
  - Stack layout vertically (board on top, controls below)
  - Add on-screen button controls for touch devices
  - Reduce board size to fit mobile viewport
  - Adjust font sizes down (H1: 32px, score: 24px)
