import { Pos } from './pos'
import { TokenNode, Keywords, TokenOrder } from './token'

const word_reg = /[\w\-]/

export class Lexer {
  content: string
  cur: number
  pos: Pos

  constructor(content: string) {
    this.content = content
    this.cur = 0
    this.pos = new Pos()
  }

  scan() {
    const token_sequences: TokenNode[] = []
    while (!this.eof()) {
      this.consume_white_space()
      if (this.next() === '/') {
        const token = this.parse_comment()
        token && token_sequences.push(token)
        continue;
      }
      if (/[\[\]\{\}\.\,\;\:\`\"\']/.test(this.next())) {
        token_sequences.push(this.parse_separator())
        continue;
      }
      if(word_reg.test(this.next())){
        const token = this.parse_word()
        token && token_sequences.push(token)
        continue;
      }
      throw Error(`token: don't support ${this.next()}`)
    }
    return token_sequences
  }

  next(count: number = 1) {
    return this.content.substring(this.cur, this.cur + count)
  }

  get_pos() {
    return new Pos(this.pos.row, this.pos.col)
  }

  eof() {
    return this.cur >= this.content.length
  }

  consume_char() {
    if (this.next() === '\n') {
      this.pos.next_row()
    } else {
      this.pos.next_col()
    }
    return this.content[this.cur++]
  }

  consume_while(rule: RegExp) {
    let res = ""
    while (!this.eof() && rule.test(this.next())) {
      res += this.consume_char()
    }
    return res
  }

  consume_until(end_with: RegExp) {
    let res = ""
    while (!this.eof() && !end_with.test(this.next())) {
      res += this.consume_char()
    }
    if (this.eof()) {
      throw Error(`token: consume_until don't end ${res}`)
    }
    return res
  }

  consume_white_space() {
    this.consume_while(/[\s\r]/)
  }

  consume_word() {
    return this.consume_while(word_reg)
  }


  parse_word() {
    const start = this.get_pos()
    const word = this.consume_word()
    if (word) {
      const end = this.get_pos()
      const keyword = Keywords.get(word)
      if (keyword && keyword > TokenOrder.keywords_begin
        && keyword < TokenOrder.keywords_end) {
        return new TokenNode(keyword, word, start, end)
      }
      return new TokenNode(TokenOrder.IDENT, word, start, end)
    }
    return undefined
  }

  parse_separator() {
    const start = this.get_pos()
    const separator = this.consume_char()
    const end = this.get_pos()
    const keyword = Keywords.get(separator)
    if (keyword && keyword > TokenOrder.separator_begin
      && keyword < TokenOrder.separator_end) {
      return new TokenNode(keyword, separator, start, end)
    }
    throw Error(`token: don't know what is "${separator}" in token map`)
  }

  parse_comment() {
    if (this.next(2) === '/*') {
      const start = this.get_pos()
      let comment = this.consume_char()
      comment += this.consume_char()
      while (!this.eof()) {
        comment += this.consume_until(/\*/)
        comment += this.consume_char() // *
        if (this.next() === '/') {
          comment += this.consume_char() // /
          const end = this.get_pos()
          return new TokenNode(TokenOrder.COMMENT, comment, start, end)
        }
      }
      throw Error(`token: comment /* doesn't have end tag`)
    }
    if (this.next(2) === '//') {
      const start = this.get_pos()
      let comment = this.consume_char()
      comment += this.consume_char()
      while (!this.eof()) {
        comment += this.consume_until(/\n/)
        this.consume_char() // \n
        if (this.next() === '\r') {
          this.consume_char()
        }
        const end = this.get_pos()
        return new TokenNode(TokenOrder.COMMENT, comment, start, end)
      }
      throw Error(`token: comment / doesn't have start tag`)
    }
    throw Error(`token: parse_comment doesn't have right enter`)
  }
}