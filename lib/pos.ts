export class Pos {
  row: number
  col: number
  constructor(row?: number, col?: number) {
    this.row = row ?? 0
    this.col = col ?? 0
  }

  next_row() {
    this.row++
    this.col = 0
  }

  next_col() {
    this.col++
  }
}