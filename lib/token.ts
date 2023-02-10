import { Pos } from './pos'

export enum TokenOrder {
  // special token
  ILLEGAL,  // error token
  COMMENT,

  literal_begin,
  IDENT,  // main
  literal_end,

  // keywords
  keywords_begin,
  TYPE,
  STRUCT,
  keywords_end,

  // separator
  separator_begin,
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
  STAR,
  separator_end,
}

export const TokenEnum = {
  // keywords
  [TokenOrder.TYPE]: 'type',
  [TokenOrder.STRUCT]: 'struct',
  // separator
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
  [TokenOrder.DQUOTA]: '"',
  [TokenOrder.STAR]: '*'
} as const


export const Keywords = (() => {
  const map = new Map<string, number>()
  for (const num in TokenEnum) {
    map.set(TokenEnum[Number(num) as keyof typeof TokenEnum], Number(num))
  }
  return map
})()

export class TokenNode {
  token_type: TokenOrder;
  name: string;
  start: Pos;
  end: Pos
  constructor(tokenType: TokenOrder, name: string, start: Pos, end: Pos) {
    this.token_type = tokenType
    this.name = name
    this.start = start
    this.end = end
  }
}