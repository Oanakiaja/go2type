export class Pos {
  row: number
  col: number
  constructor(row?: number, col?: number) {
    this.row = row ?? 1
    this.col = col ?? 1
  }

  next_row() {
    this.row++
    this.col = 1
  }

  next_col() {
    this.col++
  }
}

export class Loc {
  start: Pos
  end: Pos
  constructor(start?: Pos, end?: Pos){
    this.start = start ?? new Pos();
    this.end = end ?? new Pos();
  }
}