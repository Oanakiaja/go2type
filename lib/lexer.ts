type Pos = {
  row: number
  col: number
}

export enum TokenOrder {
  // special token
  ILLEGAL,  // error token
  COMMENT,
  JSONTAG,

  literal_begin,
  IDENT,  // main
  literal_end,

  // keywords
  keywords_begin,
  TYPE,
  STRUCT,
  keywords_end,

  // operator
  operator_begin,
  LBRACK,
  LBRACE,
  COMMA,
  PERIOD,
  RBRACK,
  RBRACE,
  SEMICOLON,
  COLON,
  DEFPOINT,
  SQUOTA,
  DQUOTA,
  operator_end
}

export const TokenEnum = {
  // keywords
  [TokenOrder.TYPE]: 'type',
  [TokenOrder.STRUCT]: 'struct',
  // operator
  [TokenOrder.LBRACK]: '[',
  [TokenOrder.LBRACE]: '{',
  [TokenOrder.COMMA]: ',',
  [TokenOrder.PERIOD]: '.',
  [TokenOrder.RBRACK]: ']',
  [TokenOrder.RBRACE]: '}',
  [TokenOrder.SEMICOLON]: ';',
  [TokenOrder.COLON]: ':',
  [TokenOrder.DEFPOINT]: '`',
  [TokenOrder.SQUOTA]: "'",
  [TokenOrder.DQUOTA]: '"'
} as const


export const Keywords = (() => {
  const map = new Map<string,number>()
  for (const num in TokenEnum) {
    map.set(TokenEnum[Number(num) as keyof typeof TokenEnum], Number(num))
  }
  return map
})()

export class TokenNode {
  tokenType: TokenOrder;
  name: string;
  start: Pos
  end: Pos
  constructor(tokenType: TokenOrder, name: string, start: Pos, end: Pos) {
    this.tokenType = tokenType
    this.name = name
    this.start = start
    this.end = end
  }
}

export class Lexer {
  content: string
  pos: number
  row: number
  col: number

  constructor(content:string) {
    this.content = content
    this.pos = 0
    this.row = 0
    this.col = 0
  }

  scan() {
    const token_sequences: TokenNode[] = []
    console.time('tokenlize')
    while (!this.eof()) {
      this.consume_white_space()
      if (this.next() === '/') {
        const token = this.parse_comment()
        token && token_sequences.push(token)
      }
      if(/[\[\]\{\}\.\,\;\:\`\"\']/.test(this.next())){
        token_sequences.push(this.parse_opt())
      }
      const token = this.parse_word()
      token && token_sequences.push(token)
    }
    console.timeEnd('tokenlize')
    return token_sequences
  }

  next(count: number = 1) {
    return this.content.substring(this.pos, this.pos + count)
  }

  get_pos() {
    return {
      col: this.col,
      row: this.row
    }
  }

  eof() {
    return this.pos >= this.content.length
  }

  consume_char() {
    if (this.next() === '\n' || this.next(2)==='\n\r') {
      this.row++
      this.col = 0
    }
    this.col++
    return this.content[this.pos++]
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
    this.consume_while(/\s/)
  }

  consume_word() {
    return this.consume_while(/\w/)
  }


  parse_word() {
    const start = this.get_pos()
    const word = this.consume_word()
    if(word){
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

  parse_opt() {
    const start = this.get_pos()
    const opt = this.consume_char()
    const end = this.get_pos()
    const keyword = Keywords.get(opt)
    if (keyword && keyword > TokenOrder.operator_begin 
      && keyword < TokenOrder.operator_end) {
      return new TokenNode(keyword, opt, start, end)
    }
    throw Error(`token: don't know what is "${opt}" in token map`)
  }
  
  parse_comment() {
    // FIXME: Maybe Problem
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
        if(this.next()==='\r'){
          this.consume_char()
        }
        // FIXME: Maybe Problem
        const end = this.get_pos()
        return new TokenNode(TokenOrder.COMMENT, comment, start, end)
      }
      throw Error(`token: comment / doesn't have start tag`)
    }
    throw Error(`token: parse_comment doesn't have right enter`)
  }
}