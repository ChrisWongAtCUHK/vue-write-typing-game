import type Piece from './piece.ts'

export default interface Particle {
  id: number
  x: number
  y: number
  color: string
  pieces: Piece[]
}
