export default interface ActiveWord {
  id: number
  text: string
  kind?: 'slow' | 'freeze' | 'heart' | 'bombclear' | 'danger' | 'normal'
  x: number
  y: number
}
