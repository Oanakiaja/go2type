import { TokenNode, TokenOrder } from './lexer'
import { goDataType } from './type'

/**
 * Expression -> "type" TypeSpec
 * TypeSpec -> Ident StructType | Ident IdentType | Ident ArrayType |Ident, TypeSpec 
 * StructType -> "struct"  StructContent
 * StructContent -> { Field }
 * Field -> TypeSpec Field | ε  
 * ArrayType-> [] StructType | [] IdentType | [] ArrayType 
 * IdentType -> "int64" | "int" | "string" | "bool" ....
 */

export class Parser {
  token_seq: TokenNode[]
  comment_seq: TokenNode[]
  cur: number

  constructor(token_seq: TokenNode[]) {
    this.token_seq = []
    this.comment_seq = []
    this.cur = 0
    for (const token of token_seq) {
      if (token.tokenType === TokenOrder.COMMENT) {
        this.comment_seq.push(token)
      } else {
        this.token_seq.push(token)
      }
    }
  }

  parse() {
    this.expression()
  }

  expression() {

  }

  is_comment(token: TokenNode) {
    return token.tokenType === TokenOrder.COMMENT
  }

  is_ident_type(token: TokenNode) {
    if (token.tokenType === TokenOrder.IDENT) {
      if (goDataType.includes(token.name as typeof goDataType[0])) {
        return true
      }
    }
    return false
  }
}