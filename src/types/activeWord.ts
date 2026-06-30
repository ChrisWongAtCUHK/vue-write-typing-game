export default interface ActiveWord {
  id: number
  text: string
  kind?:
    | 'slow'
    | 'freeze'
    | 'heart'
    | 'bombclear'
    | 'danger'
    | 'normal'
    | undefined
  x: number
  y: number
}
