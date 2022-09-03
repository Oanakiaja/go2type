import { TokenNode, TokenOrder } from './token'
import { goDataType } from './type'
import { ArrayType, BasicLit, CommentExp, Field, FieldList, GenDecl, IdentType, StructType, Tree, TypeSpec, TypeSpecType } from './ast'
import { Loc, Pos } from './pos'

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

export class Parser {
  token_seq: TokenNode[]
  decl_seq: TokenNode[]
  comment_seq: TokenNode[]
  cur: number

  constructor(token_seq: TokenNode[]) {
    this.token_seq = token_seq
    this.decl_seq = []
    this.comment_seq = []
    this.cur = 0
    for (const token of token_seq) {
      if (token.token_type === TokenOrder.COMMENT) {
        this.comment_seq.push(token)
      } else {
        this.decl_seq.push(token)
      }
    }
  }

  pre() {
    return this.decl_seq[this.cur - 1]
  }

  next() {
    return this.decl_seq[this.cur]
  }

  consume_token() {
    return this.decl_seq[this.cur++]
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
    tree.set_comments(this.comment_seq.map(node => new CommentExp(node)))
    const end = this.decl_seq[this.decl_seq.length - 1].end;
    tree.set_loc(new Loc(new Pos(1, 1), end));
    return tree
  }

  type_decl(): GenDecl {
    // Decl -> Ident TypeSpec
    const decl = new GenDecl("type")
    if (this.next().token_type === TokenOrder.IDENT) {
      const start = this.pre().start
      decl.add_specs(this.type_spec())
      const end = this.pre().end
      decl.set_loc(new Loc(start, end))
      return decl
    }
    throw Error("parser: FiledSpec start is not Ident")
  }

  type_spec(): TypeSpec {
    // Decl -> Ident TypeSpec
    const start = this.next().start
    const name = this.consume_token() // Ident
    const type_spec_node = new TypeSpec(name, this.type_spec_type())
    const end = this.pre().end
    type_spec_node.set_loc(new Loc(start, end))
    return type_spec_node
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
    const start = this.pre().start
    if (this.consume_token().token_type === TokenOrder.LBRACE) {
      const struct = new StructType()
      struct.fields = this.field_list()
      const end = this.pre().end
      struct.set_loc(new Loc(start, end))
      return struct
    }
    throw Error(`parser: struct_type parse error`)
  }

  field_list(): FieldList {
    // FieldItem -> Ident, FieldItem ｜ Decl Tag FieldItem  | }  
    const start = this.pre().start
    const fields = new FieldList()
    while (this.next().token_type !== TokenOrder.RBRACE) {
      const start = this.next().start
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
      const end = this.pre().end
      field.set_loc(new Loc(start, end))
      fields.add_field(field)
    }
    this.consume_token() // '}'
    const end = this.pre().end
    fields.set_loc(new Loc(start, end))
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
      let { name: value, start } = this.consume_token()
      while (this.next().token_type !== TokenOrder.DEFPOINT) { // `
        value += this.consume_token().name
      }
      let { name, end } = this.consume_token()
      value += name
      // `json:"name"`
      tag.set_loc(new Loc(start, end))
      tag.add_value(value)

      return tag
    }
    return null
  }

  array_type(): ArrayType {
    // ArrayType-> [] TypeSpec
    const start = this.pre().start
    const array = new ArrayType()
    if (this.consume_token().token_type === TokenOrder.RBRACK) {
      array.add_elt(this.type_spec_type())
      const end = this.pre().end
      array.set_loc(new Loc(start, end))
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