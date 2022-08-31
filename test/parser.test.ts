import {
  Lexer,
  Parser
} from '../lib'

test('parser basic', () => {
  const lex = new Lexer(`
  /* test 
  123
  */
  type Height int // comment
  type Person struct {
     Name string \`json:"name"\` //  comment
     Age uint8 // comment
     Height Height  // comment
     Birthday uint8  // comment
     Parents []Person 
     School struct {
       MiddleSchool,HighSchool,College string
     }
  }
  `)
  console.log(JSON.stringify(new Parser(lex.scan()).parse()))
  // TODO
  expect(true).toBe(true)
})