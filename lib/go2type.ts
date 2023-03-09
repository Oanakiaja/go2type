import { Generator } from "./gen"
import { Lexer } from "./lexer"
import { Parser } from "./parser"

export class Go2Type {
  content: string

  constructor(content: string) {
    this.content = content
  }

  transpiler() {
    const tokens = new Lexer(this.content).scan()
    const ast = new Parser(tokens).parse()
    const code = new Generator(ast).gen()
    return code
  }
}