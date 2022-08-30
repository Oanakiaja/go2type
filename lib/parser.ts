import { TokenNode, TokenOrder } from './token'
import { goDataType } from './type'

/**
 ** Expression -> "type" FiledSpec | "type" TagFiledSpec
 ** FiledSpec -> Ident TypeSpec | Ident, FiledSpec 
 ** TagFiledSpec -> Ident TagTypeSpec 
 ** TagTypeSpec -> StructType Tag | IdentType Tag | ArrayType Tag
 ** Tag -> `TagName:"TagValue"` | ε 
 ** TypeSpec -> StructType  | ArrayType | IdentType 
 ** StructType -> "struct"  StructContent
 ** StructContent -> { Field }
 ** Field -> FiledSpec Field | ε  
 ** ArrayType-> [] StructType | [] IdentType | [] ArrayType 
 ** IdentType -> "int64" | "int" | "string" | "bool" ....
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

  next() {
    return this.token_seq[this.cur]
  }

  eof() {
    return this.cur >= this.token_seq.length
  }

  consume_token() {
    return this.token_seq[this.cur++]
  }

  parse() {
    this.expression()
  }

  expression() {
    if (this.consume_token().tokenType === TokenOrder.TYPE) {
      if (this.filed_spec()) {

      }
      if (this.tag_filed_spec()) {

      }
      throw Error('parser: Expression -> "type" FiledSpec | "type" TagFiledSpec error')
    }
    throw Error("parser: token start is not Type")
  }

  filed_spec() {
    return false
  }

  tag_filed_spec() {
    return false
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