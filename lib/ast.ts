
import { Loc } from './pos'
import { TokenNode } from './token'

abstract class Expression {
  loc: Loc
  constructor(loc?: Loc) {
    this.loc = loc ?? new Loc()
  }
  // TODO: Loc 逻辑
  // TODO: transpiler 逻辑
}

export class File extends Expression {
  decls: GenDecl[]
  comments: Comment[]
  constructor() {
    super()
    this.decls = []
    this.comments = []
  }
  add_decl(decl: GenDecl) {
    this.decls.push(decl)
  }
  add_comments(comment: Comment) {
    this.comments.push(comment)
  }
}

export class Comment extends Expression {
  text: string
  constructor(text: string) {
    super()
    this.text = text
  }
}

export class GenDecl extends Expression {
  l_paren: number
  right_paren: number
  tok: string
  specs: TypeSpec[]
  constructor(tok: string) {
    super()
    this.l_paren = 0
    this.right_paren = 0
    this.tok = tok
    this.specs = []
  }
  add_specs(type_spec: TypeSpec) {
    this.specs.push(type_spec)
  }
}

type TypeSpecType = StructType | ArrayType | IdentType

export class TypeSpec extends Expression {
  assign: number
  name: TokenNode
  type: TypeSpecType
  constructor(name: TokenNode, type: TypeSpecType) {
    super()
    this.assign = 0
    this.name = name
    this.type = type
  }
}

export class StructType extends Expression {
  fields: FieldList
  in_complete: boolean
  struct: number
  constructor(fields: FieldList) {
    super()
    this.in_complete = false
    this.fields = fields
    this.struct = 0
  }
}

export class FieldList extends Expression {
  opening: number
  closing: number
  list: Field[]
  constructor() {
    super()
    this.opening = 0
    this.closing = 0
    this.list = []
  }
  add_field(field: Field) {
    this.list.push(field)
  }
}

export class IdentType extends Expression {
  name: string
  constructor(node: TokenNode) {
    super(new Loc(node.start, node.end))
    this.name = node.name
  }
}

export class Field extends Expression {
  names: TokenNode[]
  type?: TypeSpecType
  tag?: BasicLit

  constructor() {
    super()
    this.names = []
  }

  add_name(name: TokenNode) {
    this.names.push(name)
  }

  add_type(type: TypeSpecType) {
    this.type = type
  }

  add_tag(tag: BasicLit) {
    this.tag = tag
  }
}

export class ArrayType extends Expression {
  elt?: TypeSpecType
  l_brack: number

  constructor() {
    super()
    this.l_brack = 0
  }

  add_elt(elt: TypeSpecType) {
    this.elt = elt
  }
}

export class BasicLit extends Expression {
  kind: string // 'String'
  value?: string
  constructor(kind: string) {
    super()
    this.kind = kind
  }

  add_value(value: string) {
    this.value = value
  }

  parse_json_tag() {
    // TODO: 增加 json_tag 的识别
  }
}