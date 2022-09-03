import { goIdentifierType, typeMap } from './type'
import {
  Tree,
  GenDecl,
  TypeSpec,
  StructType,
  ArrayType,
  IdentType,
  Field,
  TypeSpecType
} from "./ast";
import { Pos } from "./pos";
import { format } from 'prettier'


export class Generator {
  ast: Tree
  text_lines: string[]

  constructor(ast: Tree) {
    this.ast = ast
    this.text_lines = new Array(ast.loc.end.row).fill("")
  }

  gen() {
    this.gen_decls()
    this.gen_comments()
    return format(
      this.text_lines.filter(line => line !== "").join('\n'),
      { semi: false, parser: "typescript" }
    )
  }

  gen_decls() {
    this.ast.decls.forEach((decl) => this.gen_gen_decl(decl))
  }

  gen_gen_decl(decl: GenDecl) {
    this.add_text(decl.loc.start, decl.tok)
    decl.specs.forEach(spec => this.gen_type_spec(spec, true))
  }

  gen_type_spec(type_spec: TypeSpec, is_type_alias?: boolean) {
    this.add_text(type_spec.loc.start, type_spec.name.name)
    this.add_text(type_spec.loc.start, is_type_alias ? '=' : ':')
    this.gen_type_spec_type(type_spec.type)
  }

  gen_type_spec_type(type?: TypeSpecType) {
    if (type instanceof StructType) {
      this.gen_struct_type(type)
      return
    }
    if (type instanceof ArrayType) {
      this.gen_array_type(type)
      return
    }
    if (type instanceof IdentType) {
      this.add_text(
        type.loc.start,
        typeMap.get(type.name as goIdentifierType) ?? type.name,
        ""
      )
      return
    }
    throw Error('gen: dont have type')
  }

  gen_array_type(array_type: ArrayType) {
    this.gen_type_spec_type(array_type.elt)
    this.add_text(array_type.loc.end, '[]', "")
  }

  gen_struct_type(struct_type: StructType) {
    this.add_text(struct_type.loc.start, '{', "")
    if (struct_type?.fields && struct_type?.fields.list.length > 0) {
      struct_type.fields.list.forEach(field => this.gen_field(field))
    }
    this.add_text(struct_type.loc.end, "}", "")
  }

  gen_field(field: Field) {
    if (field.names.length > 1) {
      field.names.forEach((name, idx) => {
        this.add_text(field.loc.start, `${name.name}:`)
        this.gen_type_spec_type(field.type)
        if (idx != field.names.length - 1) {
          this.add_text(field.loc.start, ``, '; ')
        }
      })
    } else {
      // json_tag
      let name = field.names[0].name
      if (field.tag) {
        const [value, omit] = field.tag.parse_json_tag()
        if (value === '-') {
          return
        }
        if (value && value.length > 0) {
          name = value
        }
        if (omit) {
          name = name + `?`
        }
      }
      this.add_text(field.loc.start, `${name}:`)
      this.gen_type_spec_type(field.type)
    }
  }

  parse_json_tag(field: Field) {
    if (field.tag) {
      return field.tag.parse_json_tag()
    }
    return
  }


  gen_comments() {
    this.ast.comments.forEach(comment => this.add_text(comment.loc.start, comment.text, ""))
  }

  add_text(pos: Pos, text: string, tab: string = " ") {
    this.text_lines[pos.row - 1] += text + tab
  }


}