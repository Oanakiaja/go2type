import { TokenNode, TokenOrder } from './token'
import { goDataType } from './type'
import { ArrayType, BasicLit, Field, FieldList, GenDecl, IdentType, StructType, Tree, TypeSpec, TypeSpecType } from './ast'

/**
 ** Expression -> "type" Decl 
 ** Decl -> Ident TypeSpec 
 ** TypeSpec -> StructType  | ArrayType | IdentType 
 ** StructType -> "struct"  StructContent
 ** StructContent -> { FieldItem
 ** FieldItem -> Decl Tag FieldItem | Ident, FieldItem | }  
 ** Tag -> `TagName:"TagValue"` | ε 
 ** ArrayType-> [] TypeSpec
 ** IdentType -> "int64" | "int" | "string" | "bool" ....
 */

// TODO: loc，comment

export class Parser {
  token_seq: TokenNode[]
  comment_seq: TokenNode[]
  cur: number

  constructor(token_seq: TokenNode[]) {
    this.token_seq = []
    this.comment_seq = []
    this.cur = 0
    for (const token of token_seq) {
      if (token.token_type === TokenOrder.COMMENT) {
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
    return this.expression()
  }

  expression(): Tree {
    // Expression -> "type" Decl 
    const tree = new Tree()
    while (this.consume_token()?.token_type === TokenOrder.TYPE) {
      tree.add_decl(this.type_decl())
    }
    return tree
  }

  type_decl(): GenDecl {
    // Decl -> Ident TypeSpec
    const decl = new GenDecl("type")
    if (this.next().token_type === TokenOrder.IDENT) {
      decl.add_specs(this.type_spec())
      return decl
    }
    throw Error("parser: FiledSpec start is not Ident")
  }

  type_spec(): TypeSpec {
    // Decl -> Ident TypeSpec
    const name = this.consume_token() // Ident
    return new TypeSpec(name, this.type_spec_type())
  }

  type_spec_type(): TypeSpecType {
    // TypeSpec -> StructType  | ArrayType | IdentType 
    const left_token = this.consume_token()
    if (left_token.token_type === TokenOrder.STRUCT) {
      //  StructType -> "struct"  StructContent
      return this.struct_type()
    }
    if (left_token.token_type === TokenOrder.LBRACK) {
      return this.array_type()
    }
    if (left_token.token_type === TokenOrder.IDENT) {
      return new IdentType(left_token)
    }
    throw Error(`parser: type_spec_type , dont know ${JSON.stringify(left_token)}`)
  }

  struct_type(): StructType {
    // StructContent -> { FieldItem
    if (this.consume_token().token_type === TokenOrder.LBRACE) {
      const struct = new StructType()
      struct.fields = this.field_list()
      return struct
    }
    throw Error(`parser: struct_type parse error`)
  }

  field_list(): FieldList {
    // FieldItem -> Ident, FieldItem ｜ Decl Tag FieldItem  | }  
    const fields = new FieldList()
    while (this.next().token_type !== TokenOrder.RBRACE) {
      const field = new Field()
      // Name 
      if (!this.is_ident_name(this.next())) {
        throw Error("parser: field_list , dont know identname")
      }
      this.add_field_item_name(field)
      // TypeSpec 
      field.set_type(this.type_spec_type())
      // Tag 
      field.set_tag(this.tag())
      fields.add_field(field)
    }
    this.consume_token() // '}'
    return fields
  }

  add_field_item_name(field: Field) {
    // FieldItem -> Ident, FieldItem ｜ Decl Tag FieldItem  | }  
    //                                   => Decl -> Ident TypeSpec 
    field.add_name(this.consume_token()) // name
    if (this.next().token_type === TokenOrder.COMMA) {
      this.consume_token() // ,
      if (this.is_ident_name(this.next())) {
        this.add_field_item_name(field)
      } else {
        throw Error('parser: add_field_item_name. after "," is not ident name ')
      }
    }
  }

  tag(): BasicLit | null {
    if (this.next().token_type === TokenOrder.DEFPOINT) {
      const tag = new BasicLit('String')
      let value = this.consume_token().name
      while (this.next().token_type !== TokenOrder.DEFPOINT) { // `
        value += this.consume_token().name
      }
      value += this.consume_token().name
      // `json:"name"`      
      tag.add_value(value)
      return tag
    }
    return null
  }

  array_type(): ArrayType {
    // ArrayType-> [] TypeSpec
    const array = new ArrayType()
    if (this.consume_token().token_type === TokenOrder.RBRACK) {
      array.add_elt(this.type_spec_type())
      return array
    }
    throw Error('parser: ArrayType parse error')
  }

  // is_comment(token: TokenNode) {
  //   return token.token_type === TokenOrder.COMMENT
  // }

  // is_ident_type(token: TokenNode) {
  //   if (token.token_type === TokenOrder.IDENT) {
  //     if (goDataType.includes(token.name as typeof goDataType[0])) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  is_ident_name(token: TokenNode) {
    if (token.token_type === TokenOrder.IDENT) {
      if (!goDataType.includes(token.name as typeof goDataType[0])) {
        return true
      }
    }
    return false
  }
}