import { Generator } from "./gen"
import { Lexer } from "./lexer"
import { Parser } from "./parser"
import { format } from 'prettier'

export class Go2Type {
  content: string

  constructor(content: string) {
    this.content = content
  }

  transpiler() {
    const lex = new Lexer(this.content)
    return new Generator(new Parser(lex.scan()).parse()).gen()
  }

  transpiler_format(){
    const lex = new Lexer(this.content)
    return format(
      new Generator(new Parser(lex.scan()).parse()).gen(),
      { semi: false, parser: "typescript" }
    )
  }
}