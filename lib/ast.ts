
import { Loc } from './pos'
import { TokenNode } from './token'

export class Expression {
  loc: Loc

  constructor(loc?: Loc) {
    this.loc = loc ?? new Loc()
  }

  set_loc(loc: Loc) {
    this.loc = loc
  }
}

export class Tree extends Expression {
  decls: GenDecl[]
  comments: CommentExp[]
  constructor() {
    super()
    this.decls = []
    this.comments = []
  }
  add_decl(decl: GenDecl) {
    this.decls.push(decl)
  }
  set_comments(comment: CommentExp[]) {
    this.comments = (comment)
  }
}

export class CommentExp extends Expression {
  text: string
  constructor(token: TokenNode) {
    super(new Loc(token.start, token.end))
    this.text = token.name
  }
}

export class GenDecl extends Expression {
  tok: string
  specs: TypeSpec[]
  constructor(tok: string) {
    super()
    this.tok = tok
    this.specs = []
  }
  add_specs(type_spec: TypeSpec) {
    this.specs.push(type_spec)
  }

}

export type TypeSpecType = StructType | ArrayType | IdentType

export class TypeSpec extends Expression {
  name: TokenNode
  type: TypeSpecType
  constructor(name: TokenNode, type: TypeSpecType) {
    super()
    this.name = name
    this.type = type
  }

}

export class StructType extends Expression {
  fields: FieldList | null
  constructor() {
    super()
    this.fields = null
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
  tag: BasicLit | null

  constructor() {
    super()
    this.names = []
    this.tag = null
  }

  add_name(name: TokenNode) {
    this.names.push(name)
  }

  set_type(type: TypeSpecType) {
    this.type = type
  }

  set_tag(tag: BasicLit | null) {
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
    // `json:"value,omitempty"`
    // `json:"-"`
    // `json:"value"`
    const { 1: value, 3: omit } = this.value?.match(
      /\`json:"([a-zA-Z0-9]*|\-)(,(omitempty))?"\`/
    ) || { 1: undefined, 3: undefined }
    return [value, omit ? true : false] as const
  }
}